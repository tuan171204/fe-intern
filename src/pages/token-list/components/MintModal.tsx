import * as React from "react"
import { formatEther } from "viem"
import { useAccount } from "wagmi"

import { Button } from "../../../components/ui/button"
import { Dialog } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Loading } from "../../../components/ui/loading"
import { SubmitButton } from "../../../components/ui/submit-button"
import { TOKEN_DECIMALS } from "../../../constants/contract"
import { useEthBalance } from "../../../hooks/useEthBalance"
import { useMintToken, type MintTokenStep } from "../../../hooks/useMintToken"
import { useNetworkGuard } from "../../../hooks/useNetworkGuard"
import type { TokenOnchainInfo } from "../../../hooks/useTokenOnchainData"
import type { Token } from "../../../types/tokens"
import { toBigInt } from "../../../utils/token-math"
import { formatTokenAmount } from "../../../utils/web3-format"

export interface MintModalProps {
    token: Token | null
    /** Dữ liệu on-chain (totalSupply) của token đang mint; undefined nếu chưa tải được */
    onchain?: TokenOnchainInfo
    onClose: () => void
    /** Gọi sau khi mint thành công để trang cha refetch supply / balance */
    onMinted: () => void
}

const SUBMIT_LABELS: Partial<Record<MintTokenStep, string>> = {
    submitting: "Confirm in MetaMask...",
    confirming: "Confirming on Chain...",
    error: "Retry Mint",
}

const STATUS_TEXT: Partial<Record<MintTokenStep, string>> = {
    submitting: "Checking supply and waiting for your confirmation in MetaMask",
    confirming: "Transaction sent. Waiting for block confirmation",
}

/* Ô chỉ đọc: không cho focus bằng Tab, không đổi con trỏ thành "cấm" vì đây là thông tin, không phải ô bị khoá */
const readOnlyProps = { readOnly: true, tabIndex: -1, className: "cursor-default focus-visible:border-transparent" } as const

const EtherscanLink = ({ href }: { href: string }) => (
    <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-xs font-medium text-teal-600 underline underline-offset-2 hover:text-teal-700"
    >
        View transaction on Etherscan
    </a>
)

const MintModal = ({ token, onchain, onClose, onMinted }: MintModalProps) => {
    const { address } = useAccount()
    const { canTransact } = useNetworkGuard()
    const { step, error, isBusy, txUrl, submit, reset } = useMintToken({ onSuccess: onMinted })
    /* Chỉ theo dõi số dư ETH khi modal đang mở */
    const { balance: ethBalance } = useEthBalance(token ? address : undefined)

    /* Mỗi lần mở modal cho token khác: đưa luồng mint về ban đầu */
    React.useEffect(() => {
        reset()
    }, [token, reset])

    /* Không cho đóng khi đang ký / chờ xác nhận để user không mất dấu giao dịch */
    const handleClose = () => {
        if (isBusy) return
        reset()
        onClose()
    }

    const maxSupply = toBigInt(token?.maxSupply)
    const amountPerMintWei = toBigInt(token?.amountPerMint)
    const mintFeeWei = toBigInt(token?.mintFee)

    const totalSupply = onchain?.totalSupply
    const remaining = totalSupply !== undefined ? (maxSupply > totalSupply ? maxSupply - totalSupply : 0n) : undefined
    const soldOut = totalSupply !== undefined && maxSupply > 0n && totalSupply >= maxSupply
    /* Còn supply nhưng không đủ cho 1 lần mint -> contract sẽ revert */
    const remainingTooLow = !soldOut && remaining !== undefined && remaining < amountPerMintWei
    /* Chưa đủ ETH cho mintFee (chưa tính gas) */
    const insufficientFee = !soldOut && canTransact && ethBalance !== undefined && ethBalance.value < mintFeeWei

    const blocked = soldOut || remainingTooLow || insufficientFee || !canTransact

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!token || isBusy || blocked) return
        void submit(token.tokenAddress)
    }

    const amountPerMint = token ? formatTokenAmount(amountPerMintWei, TOKEN_DECIMALS, 4) : ""
    const mintFee = token ? formatEther(mintFeeWei) : ""
    const remainingText = remaining !== undefined ? formatTokenAmount(remaining, TOKEN_DECIMALS, 4) : "-"

    return (
        <Dialog isOpen={!!token} onClose={handleClose} title={token ? `${token.name} Token` : undefined}>
            {token && (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                    <Input
                        label="Amount Per Mint"
                        value={amountPerMint}
                        endAdornment={<span className="text-xs text-muted-foreground">{token.symbol}</span>}
                        {...readOnlyProps}
                    />
                    <Input
                        label="Mint Fee"
                        value={mintFee}
                        endAdornment={<span className="text-xs text-muted-foreground">ETH</span>}
                        {...readOnlyProps}
                    />
                    <Input
                        label="Remaining Supply"
                        value={remainingText}
                        endAdornment={<span className="text-xs text-muted-foreground">{token.symbol}</span>}
                        {...readOnlyProps}
                    />

                    {soldOut && (
                        <p role="alert" className="rounded-md bg-red-50 p-3 text-xs text-destructive">
                            Max supply reached. This token can&apos;t be minted any further.
                        </p>
                    )}

                    {remainingTooLow && (
                        <p role="alert" className="rounded-md bg-red-50 p-3 text-xs text-destructive">
                            The remaining supply is smaller than the amount per mint.
                        </p>
                    )}

                    {!soldOut && !canTransact && (
                        <p role="alert" className="rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                            Connect your wallet on Sepolia Testnet to mint.
                        </p>
                    )}

                    {insufficientFee && ethBalance && (
                        <p role="alert" className="rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                            Not enough Sepolia ETH. Minting needs {mintFee} ETH plus gas, but your balance is{" "}
                            {formatEther(ethBalance.value)} ETH.
                        </p>
                    )}

                    {isBusy && (
                        <div
                            role="status"
                            aria-live="polite"
                            className="flex items-start gap-2 rounded-md border border-border bg-muted/40 p-3 text-xs"
                        >
                            <Loading size="sm" className="mt-0.5 text-teal-600" />
                            <div className="flex flex-col gap-1">
                                <span>{STATUS_TEXT[step]}</span>
                                {txUrl && <EtherscanLink href={txUrl} />}
                            </div>
                        </div>
                    )}

                    {step === "error" && error && (
                        <div role="alert" className="flex flex-col gap-1.5 rounded-md bg-red-50 p-3 text-xs text-destructive">
                            <p>{error}</p>
                            {/* Có txHash = tx đã được gửi đi: cho user tự kiểm tra trước khi Retry */}
                            {txUrl && <EtherscanLink href={txUrl} />}
                        </div>
                    )}

                    {step === "success" ? (
                        <div className="flex flex-col gap-3 text-center">
                            <p className="text-sm">
                                Minted{" "}
                                <span className="font-semibold">
                                    {amountPerMint} {token.symbol}
                                </span>{" "}
                                successfully.
                            </p>
                            {txUrl && <EtherscanLink href={txUrl} />}
                            <Button
                                type="button"
                                onClick={handleClose}
                                className="h-11 w-full rounded-full bg-teal-600 text-white hover:bg-teal-700"
                            >
                                Done
                            </Button>
                        </div>
                    ) : (
                        <SubmitButton loading={isBusy} disabled={isBusy || blocked} className="mt-2">
                            {SUBMIT_LABELS[step] ?? "Mint"}
                        </SubmitButton>
                    )}
                </form>
            )}
        </Dialog>
    )
}

export default MintModal
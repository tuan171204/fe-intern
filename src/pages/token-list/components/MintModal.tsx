import * as React from "react"
import type { ParseKeys } from "i18next"
import { Trans, useTranslation } from "react-i18next"
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
    /** On-chain data (totalSupply) of the token being minted; undefined if not loaded yet */
    onchain?: TokenOnchainInfo
    onClose: () => void
    /** Called after a successful mint so the parent page can refetch supply / balance */
    onMinted: () => void
}

const SUBMIT_LABEL_KEYS: Partial<Record<MintTokenStep, ParseKeys>> = {
    submitting: "mint.confirmInWallet",
    confirming: "mint.confirming",
    error: "mint.retry",
}

const STATUS_TEXT_KEYS: Partial<Record<MintTokenStep, ParseKeys>> = {
    submitting: "mint.statusSubmitting",
    confirming: "mint.statusConfirming",
}

/* Read-only fields: skip them in tab order and keep the default cursor, since they are info rather than locked inputs */
const readOnlyProps = { readOnly: true, tabIndex: -1, className: "cursor-default focus-visible:border-transparent" } as const

const EtherscanLink = ({ href }: { href: string }) => {
    const { t } = useTranslation()

    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-teal-600 underline underline-offset-2 hover:text-teal-700"
        >
            {t("common.viewOnEtherscan")}
        </a>
    )
}

const MintModal = ({ token, onchain, onClose, onMinted }: MintModalProps) => {
    const { t } = useTranslation()
    const { address } = useAccount()
    const { canTransact } = useNetworkGuard()
    const { step, error, isBusy, txUrl, submit, reset } = useMintToken({ onSuccess: onMinted })
    /* Only watch the ETH balance while the modal is open */
    const { balance: ethBalance } = useEthBalance(token ? address : undefined)

    /* Reset the mint flow whenever the modal opens for a different token */
    React.useEffect(() => {
        reset()
    }, [token, reset])

    /* Block closing while signing / confirming so the user doesn't lose track of the transaction */
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
    /* Supply is left but not enough for one mint -> the contract would revert */
    const remainingTooLow = !soldOut && remaining !== undefined && remaining < amountPerMintWei
    /* Not enough ETH for the mint fee (gas not included) */
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

    const submitLabelKey = SUBMIT_LABEL_KEYS[step]
    const statusTextKey = STATUS_TEXT_KEYS[step]

    return (
        <Dialog isOpen={!!token} onClose={handleClose} title={token ? t("mint.title", { name: token.name }) : undefined}>
            {token && (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                    <Input
                        label={t("mint.amountPerMint")}
                        value={amountPerMint}
                        endAdornment={<span className="text-xs text-muted-foreground">{token.symbol}</span>}
                        {...readOnlyProps}
                    />
                    <Input
                        label={t("mint.mintFee")}
                        value={mintFee}
                        endAdornment={<span className="text-xs text-muted-foreground">ETH</span>}
                        {...readOnlyProps}
                    />
                    <Input
                        label={t("mint.remainingSupply")}
                        value={remainingText}
                        endAdornment={<span className="text-xs text-muted-foreground">{token.symbol}</span>}
                        {...readOnlyProps}
                    />

                    {soldOut && (
                        <p
                            role="alert"
                            className="rounded-md bg-red-50 p-3 text-xs text-destructive dark:bg-red-950/40"
                        >
                            {t("mint.soldOut")}
                        </p>
                    )}

                    {remainingTooLow && (
                        <p
                            role="alert"
                            className="rounded-md bg-red-50 p-3 text-xs text-destructive dark:bg-red-950/40"
                        >
                            {t("mint.remainingTooLow")}
                        </p>
                    )}

                    {!soldOut && !canTransact && (
                        <p
                            role="alert"
                            className="rounded-md bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                        >
                            {t("mint.connectNotice")}
                        </p>
                    )}

                    {insufficientFee && ethBalance && (
                        <p
                            role="alert"
                            className="rounded-md bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                        >
                            {t("mint.insufficientEth", { fee: mintFee, balance: formatEther(ethBalance.value) })}
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
                                {statusTextKey && <span>{t(statusTextKey)}</span>}
                                {txUrl && <EtherscanLink href={txUrl} />}
                            </div>
                        </div>
                    )}

                    {step === "error" && error && (
                        <div
                            role="alert"
                            className="flex flex-col gap-1.5 rounded-md bg-red-50 p-3 text-xs text-destructive dark:bg-red-950/40"
                        >
                            <p>{error}</p>
                            {/* A txHash means the tx was sent: let the user check it before retrying */}
                            {txUrl && <EtherscanLink href={txUrl} />}
                        </div>
                    )}

                    {step === "success" ? (
                        <div className="flex flex-col gap-3 text-center">
                            <p className="text-sm">
                                <Trans
                                    i18nKey="mint.success"
                                    values={{ amount: amountPerMint, symbol: token.symbol }}
                                    components={{ b: <span className="font-semibold" /> }}
                                />
                            </p>
                            {txUrl && <EtherscanLink href={txUrl} />}
                            <Button
                                type="button"
                                onClick={handleClose}
                                className="h-11 w-full rounded-full bg-teal-600 text-white hover:bg-teal-700"
                            >
                                {t("mint.done")}
                            </Button>
                        </div>
                    ) : (
                        <SubmitButton loading={isBusy} disabled={isBusy || blocked} className="mt-2">
                            {submitLabelKey ? t(submitLabelKey) : t("mint.button")}
                        </SubmitButton>
                    )}
                </form>
            )}
        </Dialog>
    )
}

export default MintModal
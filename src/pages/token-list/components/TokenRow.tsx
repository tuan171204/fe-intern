import { useTranslation } from "react-i18next"

import { Avatar } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { CopyAddress } from "../../../components/ui/copy-address"
import { Progress } from "../../../components/ui/progress"
import { Skeleton } from "../../../components/ui/skeleton"
import { TOKEN_DECIMALS } from "../../../constants/contract"
import type { TokenOnchainInfo } from "../../../hooks/useTokenOnchainData"
import type { Token } from "../../../types/tokens"
import { getImageUrl } from "../../../utils/api"
import cn from "../../../utils/cn"
import { formatPercent, percentOf, toBigInt } from "../../../utils/token-math"
import { formatTokenAmount } from "../../../utils/web3-format"
import { TOKEN_GRID_COLS } from "./grid"

const MobileLabel = ({ children }: { children: string }) => (
    <span className="text-xs text-muted-foreground md:hidden">{children}</span>
)

export interface TokenRowProps {
    token: Token
    /** On-chain data of this token (undefined if not available yet) */
    onchain?: TokenOnchainInfo
    isConnected: boolean
    supplyLoading: boolean
    balanceLoading: boolean
    /** Row click: open the token detail popup (GET /tokens/:address) */
    onSelect: (tokenAddress: string) => void
    /** Mint button click: open the mint popup */
    onMint: (token: Token) => void
}

const TokenRow = ({ token, onchain, isConnected, supplyLoading, balanceLoading, onSelect, onMint }: TokenRowProps) => {
    const { t } = useTranslation()
    const maxSupply = toBigInt(token.maxSupply)
    const totalSupply = onchain?.totalSupply
    const balance = onchain?.balance

    const mintPercent = totalSupply !== undefined ? percentOf(totalSupply, maxSupply) : undefined
    const holdPercent = balance !== undefined ? percentOf(balance, maxSupply) : undefined
    const fullyMinted = totalSupply !== undefined && maxSupply > 0n && totalSupply >= maxSupply

    const balanceText = balance !== undefined ? formatTokenAmount(balance, TOKEN_DECIMALS, 4) : "-"
    const holdPercentText = holdPercent !== undefined ? formatPercent(holdPercent) : "-"
    const mintPercentText = mintPercent !== undefined ? formatPercent(mintPercent) : "-"
    const walletHint = !isConnected ? t("tokenList.walletHint") : undefined

    return (
        <div
            role="row"
            onClick={() => onSelect(token.tokenAddress)}
            className={cn("grid cursor-pointer grid-cols-2 items-center gap-3 p-4 md:gap-4", TOKEN_GRID_COLS)}
        >
            <div role="cell" className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
                <Avatar src={getImageUrl(token.image)} fallback={token.name} alt={token.name} size="lg" className="size-12" />
                <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate">
                        <span className="text-base font-semibold">{token.name}</span>{" "}
                        <span className="text-sm text-muted-foreground">{token.symbol}</span>
                    </p>
                    {/* Prevent the copy button click from opening the popup */}
                    <div onClick={(e) => e.stopPropagation()} className="w-fit max-w-full">
                        <CopyAddress address={token.tokenAddress} head={8} tail={6} className="text-xs text-foreground" />
                    </div>
                </div>
            </div>

            <div role="cell" className="flex flex-col gap-0.5 md:items-center">
                <MobileLabel>{t("tokenList.balance")}</MobileLabel>
                {balanceLoading ? (
                    <Skeleton className="h-5 w-16" />
                ) : (
                    <span title={walletHint} className="text-base font-semibold">
                        {balanceText}
                    </span>
                )}
            </div>

            <div role="cell" className="flex flex-col gap-0.5 md:items-center">
                <MobileLabel>{t("tokenList.supplyPercent")}</MobileLabel>
                {balanceLoading ? (
                    <Skeleton className="h-5 w-12" />
                ) : (
                    <span title={walletHint} className="text-base font-semibold">
                        {holdPercentText}
                    </span>
                )}
            </div>

            <div role="cell" className="col-span-2 flex flex-col gap-1.5 md:col-span-1">
                <MobileLabel>{t("tokenList.mintProgress")}</MobileLabel>
                {supplyLoading ? (
                    <Skeleton className="h-2 w-full rounded-full" />
                ) : (
                    <div className="flex items-center gap-2">
                        <Progress
                            value={mintPercent ?? 0}
                            aria-label={t("tokenList.progressAria", { name: token.name })}
                            className="h-2 flex-1 bg-teal-50"
                        />
                        <span className="w-14 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                            {mintPercentText}
                        </span>
                    </div>
                )}
            </div>

            <div role="cell" className="col-span-2 md:col-span-1 md:flex md:justify-center">
                <Button
                    variant="outline"
                    disabled={fullyMinted}
                    aria-label={
                        fullyMinted
                            ? t("tokenList.mintedAria", { name: token.name })
                            : t("tokenList.mintAria", { name: token.name })
                    }
                    onClick={(e) => {
                        e.stopPropagation()
                        onMint(token)
                    }}
                    className="h-9 w-full rounded-full border-teal-600 px-8 text-teal-600 shadow-none hover:bg-teal-50 hover:text-teal-700 md:w-auto"
                >
                    {fullyMinted ? t("tokenList.minted") : t("tokenList.mint")}
                </Button>
            </div>
        </div>
    )
}

export default TokenRow
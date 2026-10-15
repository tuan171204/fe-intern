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
    /** Dữ liệu on-chain của token này (undefined nếu chưa có) */
    onchain?: TokenOnchainInfo
    isConnected: boolean
    supplyLoading: boolean
    balanceLoading: boolean
    /** Click vào row: mở popup chi tiết token (GET /tokens/:address) */
    onSelect: (tokenAddress: string) => void
    /** Click nút Mint: mở popup mint */
    onMint: (token: Token) => void
}

const TokenRow = ({ token, onchain, isConnected, supplyLoading, balanceLoading, onSelect, onMint }: TokenRowProps) => {
    const maxSupply = toBigInt(token.maxSupply)
    const totalSupply = onchain?.totalSupply
    const balance = onchain?.balance

    const mintPercent = totalSupply !== undefined ? percentOf(totalSupply, maxSupply) : undefined
    const holdPercent = balance !== undefined ? percentOf(balance, maxSupply) : undefined
    const fullyMinted = totalSupply !== undefined && maxSupply > 0n && totalSupply >= maxSupply

    const balanceText = balance !== undefined ? formatTokenAmount(balance, TOKEN_DECIMALS, 4) : "-"
    const holdPercentText = holdPercent !== undefined ? formatPercent(holdPercent) : "-"
    const mintPercentText = mintPercent !== undefined ? formatPercent(mintPercent) : "-"
    const walletHint = !isConnected ? "Connect your wallet to see this value" : undefined

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
                    {/* Tránh click vào nút copy làm mở popup */}
                    <div onClick={(e) => e.stopPropagation()} className="w-fit max-w-full">
                        <CopyAddress address={token.tokenAddress} head={8} tail={6} className="text-xs text-foreground" />
                    </div>
                </div>
            </div>

            <div role="cell" className="flex flex-col gap-0.5 md:items-center">
                <MobileLabel>Balance</MobileLabel>
                {balanceLoading ? (
                    <Skeleton className="h-5 w-16" />
                ) : (
                    <span title={walletHint} className="text-base font-semibold">
                        {balanceText}
                    </span>
                )}
            </div>

            <div role="cell" className="flex flex-col gap-0.5 md:items-center">
                <MobileLabel>% of Supply</MobileLabel>
                {balanceLoading ? (
                    <Skeleton className="h-5 w-12" />
                ) : (
                    <span title={walletHint} className="text-base font-semibold">
                        {holdPercentText}
                    </span>
                )}
            </div>

            <div role="cell" className="col-span-2 flex flex-col gap-1.5 md:col-span-1">
                <MobileLabel>Mint Progress</MobileLabel>
                {supplyLoading ? (
                    <Skeleton className="h-2 w-full rounded-full" />
                ) : (
                    <div className="flex items-center gap-2">
                        <Progress
                            value={mintPercent ?? 0}
                            aria-label={`Mint progress of ${token.name}`}
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
                    aria-label={fullyMinted ? `${token.name} is fully minted` : `Mint ${token.name}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        onMint(token)
                    }}
                    className="h-9 w-full rounded-full border-teal-600 px-8 text-teal-600 shadow-none hover:bg-teal-50 hover:text-teal-700 md:w-auto"
                >
                    {fullyMinted ? "Minted" : "Mint"}
                </Button>
            </div>
        </div>
    )
}

export default TokenRow
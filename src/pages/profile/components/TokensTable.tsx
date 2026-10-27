import { useTranslation } from "react-i18next"

import { Button } from "../../../components/ui/button"
import { Skeleton } from "../../../components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { TOKEN_DECIMALS } from "../../../constants/contract"
import { useLoadMoreTrigger } from "../../../hooks/useLoadMoreTrigger"
import { useTokenOnchainData } from "../../../hooks/useTokenOnchainData"
import type { Token } from "../../../types/tokens"
import { getImageUrl } from "../../../utils/api"
import { formatPercent, percentOf, toBigInt } from "../../../utils/token-math"
import { formatTokenAmount } from "../../../utils/web3-format"
import AssetIdentity from "./AssetIdentity"

export interface TokensTableProps {
    /** Tokens grouped by the page they were fetched in (infinite scroll appends a new page each time) */
    pages: Token[][]
    /** First page is loading */
    loading: boolean
    error: string | null
    onRetry: () => void
    hasMore: boolean
    /** A next page is loading */
    loadingMore: boolean
    loadMoreError: string | null
    onLoadMore: () => void
}

const INITIAL_SKELETON_ROWS = 5
const MORE_SKELETON_ROWS = 2

const SkeletonRows = ({ count }: { count: number }) => (
    <>
        {Array.from({ length: count }, (_, i) => (
            <TableRow key={i} className="hover:bg-transparent">
                <TableCell>
                    <div className="flex items-center gap-3">
                        <Skeleton className="size-10 rounded-full" />
                        <div className="flex flex-col gap-1.5">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-32" />
                        </div>
                    </div>
                </TableCell>
                <TableCell>
                    <Skeleton className="mx-auto h-4 w-16" />
                </TableCell>
                <TableCell>
                    <Skeleton className="mx-auto h-4 w-12" />
                </TableCell>
                <TableCell>
                    <Skeleton className="ml-auto h-4 w-20" />
                </TableCell>
            </TableRow>
        ))}
    </>
)

/**
 * Rows of ONE fetched page. On-chain reads are scoped per page, so appending a new page
 * never refetches (or flashes skeletons on) the rows that are already displayed.
 */
const TokenRows = ({ tokens }: { tokens: Token[] }) => {
    const onchain = useTokenOnchainData(tokens)

    return (
        <>
            {tokens.map((token) => {
                const maxSupply = toBigInt(token.maxSupply)
                const balance = onchain.byAddress[token.tokenAddress.toLowerCase()]?.balance

                return (
                    <TableRow key={token._id}>
                        <TableCell>
                            <AssetIdentity
                                name={token.name}
                                symbol={token.symbol}
                                address={token.tokenAddress}
                                avatar={getImageUrl(token.image)}
                            />
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                            {onchain.balanceLoading ? (
                                <Skeleton className="mx-auto h-4 w-16" />
                            ) : balance !== undefined ? (
                                formatTokenAmount(balance, TOKEN_DECIMALS, 4)
                            ) : (
                                "-"
                            )}
                        </TableCell>
                        <TableCell className="text-center font-semibold">
                            {onchain.balanceLoading ? (
                                <Skeleton className="mx-auto h-4 w-12" />
                            ) : balance !== undefined ? (
                                formatPercent(percentOf(balance, maxSupply))
                            ) : (
                                "-"
                            )}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatTokenAmount(maxSupply, TOKEN_DECIMALS, 4)}
                        </TableCell>
                    </TableRow>
                )
            })}
        </>
    )
}

const TokensTable = ({
    pages,
    loading,
    error,
    onRetry,
    hasMore,
    loadingMore,
    loadMoreError,
    onLoadMore,
}: TokensTableProps) => {
    const { t } = useTranslation()

    /* Disabled while loading or after a failed page, so a failure doesn't trigger an endless retry loop */
    const sentinelRef = useLoadMoreTrigger({
        onLoadMore,
        enabled: hasMore && !loading && !loadingMore && !error && !loadMoreError,
    })

    const renderBody = () => {
        if (loading) return <SkeletonRows count={INITIAL_SKELETON_ROWS} />

        if (error) {
            return (
                <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-8 text-center">
                        <p className="text-sm text-destructive">{error}</p>
                        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
                            {t("common.retry")}
                        </Button>
                    </TableCell>
                </TableRow>
            )
        }

        if (pages.length === 0) {
            return (
                <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                        {t("profile.tokensTable.empty")}
                    </TableCell>
                </TableRow>
            )
        }

        return (
            <>
                {pages.map((tokens) => (
                    <TokenRows key={tokens[0]._id} tokens={tokens} />
                ))}

                {loadingMore && <SkeletonRows count={MORE_SKELETON_ROWS} />}

                {loadMoreError && (
                    <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={4} className="py-4 text-center">
                            <p className="text-sm text-destructive">{loadMoreError}</p>
                            <Button variant="outline" size="sm" className="mt-3" onClick={onLoadMore}>
                                {t("common.retry")}
                            </Button>
                        </TableCell>
                    </TableRow>
                )}
            </>
        )
    }

    return (
        <div className="flex flex-col">
            <Table className="min-w-[560px]">
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="text-sm text-foreground">{t("profile.tokensTable.token")}</TableHead>
                        <TableHead className="text-center text-sm">{t("profile.tokensTable.balance")}</TableHead>
                        <TableHead className="text-center text-sm">{t("profile.tokensTable.supplyPercent")}</TableHead>
                        <TableHead className="text-right text-sm">{t("profile.tokensTable.totalSupply")}</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>{renderBody()}</TableBody>
            </Table>

            {/* Sentinel: when it scrolls near the viewport, the next page is requested */}
            <div ref={sentinelRef} aria-hidden="true" className="h-px" />
            <p role="status" aria-live="polite" className="sr-only">
                {loadingMore ? t("common.loading") : ""}
            </p>
        </div>
    )
}

export default TokensTable
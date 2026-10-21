import { Button } from "../../../components/ui/button"
import Pagination from "../../../components/ui/pagination"
import { Skeleton } from "../../../components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { TOKEN_DECIMALS } from "../../../constants/contract"
import { useTokenOnchainData } from "../../../hooks/useTokenOnchainData"
import type { PaginationMeta, Token } from "../../../types/tokens"
import { getImageUrl } from "../../../utils/api"
import { formatPercent, percentOf, toBigInt } from "../../../utils/token-math"
import { formatTokenAmount } from "../../../utils/web3-format"
import AssetIdentity from "./AssetIdentity"

export interface TokensTableProps {
    tokens: Token[]
    /** Trang đang chọn */
    page: number
    pagination: PaginationMeta
    loading: boolean
    error: string | null
    onRetry: () => void
    onPageChange: (page: number) => void
}

const SKELETON_ROWS = 5

const TokensTable = ({ tokens, page, pagination, loading, error, onRetry, onPageChange }: TokensTableProps) => {
    const onchain = useTokenOnchainData(tokens)

    const renderRows = () => {
        if (loading) {
            return Array.from({ length: SKELETON_ROWS }, (_, i) => (
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
            ))
        }

        if (error) {
            return (
                <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-8 text-center">
                        <p className="text-sm text-destructive">{error}</p>
                        <Button variant="outline" size="sm" className="mt-3" onClick={onRetry}>
                            Retry
                        </Button>
                    </TableCell>
                </TableRow>
            )
        }

        if (tokens.length === 0) {
            return (
                <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={4} className="py-8 text-center text-sm text-muted-foreground">
                        You haven&apos;t created any tokens yet.
                    </TableCell>
                </TableRow>
            )
        }

        return tokens.map((token) => {
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
        })
    }

    return (
        <div className="flex flex-col gap-4">
            <Table className="min-w-[560px]">
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="text-sm text-foreground">Token</TableHead>
                        <TableHead className="text-center text-sm">Balance</TableHead>
                        <TableHead className="text-center text-sm">% of Supply</TableHead>
                        <TableHead className="text-right text-sm">Total of Supply</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>{renderRows()}</TableBody>
            </Table>

            <Pagination
                page={page}
                limit={pagination.limit}
                total={pagination.total}
                onPageChange={onPageChange}
                disabled={loading}
            />
        </div>
    )
}

export default TokensTable
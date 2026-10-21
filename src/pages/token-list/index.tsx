import * as React from "react"

import { getTokens } from "../../api/token"
import { Button } from "../../components/ui/button"
import Pagination from "../../components/ui/pagination"
import { usePaginatedTokens } from "../../hooks/usePaginatedTokens"
import { useTokenOnchainData } from "../../hooks/useTokenOnchainData"
import type { Token } from "../../types/tokens"
import MintModal from "./components/MintModal"
import TokenDetailModal from "./components/TokenDetailModal"
import TokenListHeader from "./components/TokenListHeader"
import TokenRow from "./components/TokenRow"
import TokenRowSkeleton from "./components/TokenRowSkeleton"

const TOKENS_PER_PAGE = 10
const SKELETON_ROWS = 5
/* RPC fallback có thể trả về node chưa kịp đồng bộ block mới -> refetch thêm 1 lần sau mint */
const POST_MINT_REFETCH_DELAY_MS = 4000

const TokenList = () => {
    const [page, setPage] = React.useState(1)
    const [detailTokenAddress, setDetailTokenAddress] = React.useState<string | null>(null)
    const [mintingToken, setMintingToken] = React.useState<Token | null>(null)

    const { items, pagination, loading, error, reload } = usePaginatedTokens(getTokens, page, TOKENS_PER_PAGE)

    /* Dữ liệu on-chain của cả trang trong 2 multicall (totalSupply + balanceOf) */
    const onchain = useTokenOnchainData(items)
    const { refetch: refetchOnchain } = onchain

    /* Mint xong: tải lại totalSupply + balanceOf để Mint Progress / Balance / % of Supply cập nhật ngay */
    const handleMinted = React.useCallback(() => {
        void refetchOnchain()
        window.setTimeout(() => void refetchOnchain(), POST_MINT_REFETCH_DELAY_MS)
    }, [refetchOnchain])

    const handlePageChange = (nextPage: number) => {
        setPage(nextPage)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const renderRows = () => {
        if (loading) {
            return Array.from({ length: SKELETON_ROWS }, (_, i) => <TokenRowSkeleton key={i} />)
        }

        if (error) {
            return (
                <div role="row" className="flex flex-col items-center gap-3 p-8 text-center">
                    <p role="cell" className="text-sm text-destructive">
                        {error}
                    </p>
                    <Button variant="outline" size="sm" onClick={reload}>
                        Retry
                    </Button>
                </div>
            )
        }

        if (items.length === 0) {
            return (
                <div role="row" className="p-8 text-center text-sm text-muted-foreground">
                    <span role="cell">No tokens have been created yet.</span>
                </div>
            )
        }

        return items.map((token) => (
            <TokenRow
                key={token._id}
                token={token}
                onchain={onchain.byAddress[token.tokenAddress.toLowerCase()]}
                isConnected={onchain.isConnected}
                supplyLoading={onchain.supplyLoading}
                balanceLoading={onchain.balanceLoading}
                onSelect={setDetailTokenAddress}
                onMint={setMintingToken}
            />
        ))
    }

    return (
        <>
            {onchain.isError && !loading && !error && (
                <div
                    role="alert"
                    className="mb-2.5 flex items-center justify-between gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-xs text-amber-800"
                >
                    <span>Could not load on-chain data (balance, mint progress).</span>
                    <Button variant="outline" size="sm" onClick={() => void onchain.refetch()}>
                        Retry
                    </Button>
                </div>
            )}

            <div role="table" aria-label="Tokens" className="flex w-full flex-col gap-2.5">
                <TokenListHeader />
                <div role="rowgroup" className="divide-y divide-border/60 overflow-hidden rounded-lg bg-background">
                    {renderRows()}
                </div>
            </div>

            <Pagination
                page={page}
                limit={pagination.limit}
                total={pagination.total}
                onPageChange={handlePageChange}
                disabled={loading}
                className="mt-4"
            />

            <TokenDetailModal tokenAddress={detailTokenAddress} onClose={() => setDetailTokenAddress(null)} />
            <MintModal
                token={mintingToken}
                onchain={mintingToken ? onchain.byAddress[mintingToken.tokenAddress.toLowerCase()] : undefined}
                onClose={() => setMintingToken(null)}
                onMinted={handleMinted}
            />
        </>
    )
}

export default TokenList
import * as React from "react"

import type { Token } from "../types/tokens"
import { getErrorMessage } from "../utils/api"
import type { TokenListFetcher } from "./usePaginatedTokens"

/**
 * Accumulates pages of tokens for infinite scroll.
 * - `pages` keeps each fetched page as its own array (stable references, so per-page on-chain reads don't refetch)
 * - tokens already seen are dropped, so a new token created between two requests can't produce duplicates
 * - a "generation" counter ignores responses of requests that were superseded by a reload
 */
export function useInfiniteTokens(fetcher: TokenListFetcher, limit: number) {
    const [pages, setPages] = React.useState<Token[][]>([])
    const [total, setTotal] = React.useState(0)
    const [hasMore, setHasMore] = React.useState(false)
    const [loading, setLoading] = React.useState(true)
    const [loadingMore, setLoadingMore] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const [loadMoreError, setLoadMoreError] = React.useState<string | null>(null)

    const nextPage = React.useRef(1)
    const inFlight = React.useRef(false)
    const hasMoreRef = React.useRef(false)
    const generation = React.useRef(0)
    const seenIds = React.useRef(new Set<string>())

    const load = React.useCallback(
        async (reset: boolean) => {
            if (!reset && inFlight.current) return

            if (reset) {
                generation.current += 1
                nextPage.current = 1
                seenIds.current = new Set()
                hasMoreRef.current = false
                setPages([])
                setTotal(0)
                setHasMore(false)
                setError(null)
                setLoadMoreError(null)
                setLoadingMore(false)
                setLoading(true)
            } else {
                setLoadMoreError(null)
                setLoadingMore(true)
            }

            const gen = generation.current
            const page = nextPage.current
            inFlight.current = true

            try {
                const res = await fetcher({ page, limit })
                if (gen !== generation.current) return

                const fresh = res.data.filter((token) => !seenIds.current.has(token._id))
                fresh.forEach((token) => seenIds.current.add(token._id))
                nextPage.current = page + 1

                const more = res.data.length > 0 && page * limit < res.pagination.total
                hasMoreRef.current = more

                if (fresh.length > 0) setPages((prev) => [...prev, fresh])
                setTotal(res.pagination.total)
                setHasMore(more)
            } catch (err: unknown) {
                if (gen !== generation.current) return
                const message = getErrorMessage(err, "Failed to load tokens")
                if (page === 1) setError(message)
                else setLoadMoreError(message)
            } finally {
                if (gen === generation.current) {
                    inFlight.current = false
                    setLoading(false)
                    setLoadingMore(false)
                }
            }
        },
        [fetcher, limit]
    )

    React.useEffect(() => {
        void load(true)
    }, [load])

    const loadMore = React.useCallback(() => {
        if (!hasMoreRef.current) return
        void load(false)
    }, [load])

    const reload = React.useCallback(() => void load(true), [load])

    const items = React.useMemo(() => pages.flat(), [pages])

    return { pages, items, total, hasMore, loading, loadingMore, error, loadMoreError, loadMore, reload }
}
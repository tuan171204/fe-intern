import * as React from "react"

import type { PaginationMeta, PaginationParams, Token, TokenListResponse } from "../types/tokens"
import { getErrorMessage } from "../utils/api"

export type TokenListFetcher = (params: PaginationParams) => Promise<TokenListResponse>

export function usePaginatedTokens(fetcher: TokenListFetcher, page: number, limit: number) {
    const [items, setItems] = React.useState<Token[]>([])
    const [pagination, setPagination] = React.useState<PaginationMeta>({ total: 0, page, limit })
    const [loading, setLoading] = React.useState(true)
    const [error, setError] = React.useState<string | null>(null)
    const [reloadKey, setReloadKey] = React.useState(0)

    React.useEffect(() => {
        let cancelled = false
        setLoading(true)
        setError(null)

        fetcher({ page, limit })
            .then((res) => {
                if (cancelled) return
                setItems(res.data)
                setPagination(res.pagination)
            })
            .catch((err: unknown) => {
                if (!cancelled) setError(getErrorMessage(err, "Failed to load tokens"))
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [fetcher, page, limit, reloadKey])

    const reload = React.useCallback(() => setReloadKey((k) => k + 1), [])

    return { items, pagination, loading, error, reload }
}
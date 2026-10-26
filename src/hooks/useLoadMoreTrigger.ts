import * as React from "react"

export interface UseLoadMoreTriggerOptions {
    onLoadMore: () => void
    /** false while loading / when there is nothing more to load: the observer is disconnected */
    enabled: boolean
    /** Start loading before the sentinel is actually visible */
    rootMargin?: string
}

/**
 * Returns a ref callback for a sentinel element placed after the list.
 * Re-creating the observer whenever `enabled` flips back to true makes it fire again if the sentinel
 * is still visible after a page has loaded (e.g. the page is shorter than the viewport).
 */
export function useLoadMoreTrigger({ onLoadMore, enabled, rootMargin = "240px" }: UseLoadMoreTriggerOptions) {
    const [node, setNode] = React.useState<Element | null>(null)

    const onLoadMoreRef = React.useRef(onLoadMore)
    React.useEffect(() => {
        onLoadMoreRef.current = onLoadMore
    })

    React.useEffect(() => {
        if (!node || !enabled || typeof IntersectionObserver === "undefined") return

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries.some((entry) => entry.isIntersecting)) onLoadMoreRef.current()
            },
            { rootMargin }
        )
        observer.observe(node)
        return () => observer.disconnect()
    }, [node, enabled, rootMargin])

    return setNode
}
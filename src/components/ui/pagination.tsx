import cn from "../../utils/cn"
import Icon from "./icon"

export interface PaginationProps {
    page: number
    limit: number
    total: number
    onPageChange: (page: number) => void
    disabled?: boolean
    className?: string
}

type PageItem = number | "start-ellipsis" | "end-ellipsis"

const range = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, i) => from + i)

/** Vd: [1, "start-ellipsis", 4, 5, 6, "end-ellipsis", 20] */
const getPageItems = (page: number, totalPages: number): PageItem[] => {
    if (totalPages <= 7) return range(1, totalPages)
    if (page <= 4) return [...range(1, 5), "end-ellipsis", totalPages]
    if (page >= totalPages - 3) return [1, "start-ellipsis", ...range(totalPages - 4, totalPages)]
    return [1, "start-ellipsis", page - 1, page, page + 1, "end-ellipsis", totalPages]
}

const buttonClass =
    "inline-flex size-8 items-center justify-center rounded-md text-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

/** Ẩn khi chỉ có 1 trang */
const Pagination = ({ page, limit, total, onPageChange, disabled = false, className }: PaginationProps) => {
    const totalPages = Math.max(1, Math.ceil(total / limit))
    if (totalPages <= 1) return null

    return (
        <nav aria-label="Pagination" className={cn("flex items-center justify-center gap-1", className)}>
            <button
                type="button"
                aria-label="Previous page"
                disabled={disabled || page <= 1}
                onClick={() => onPageChange(page - 1)}
                className={cn(buttonClass, "text-muted-foreground hover:bg-accent")}
            >
                <Icon name="chevron-left" size="md" />
            </button>

            {getPageItems(page, totalPages).map((item) =>
                typeof item === "number" ? (
                    <button
                        key={item}
                        type="button"
                        aria-label={`Page ${item}`}
                        aria-current={item === page ? "page" : undefined}
                        disabled={disabled}
                        onClick={() => onPageChange(item)}
                        className={cn(
                            buttonClass,
                            item === page ? "bg-teal-600 font-medium text-white" : "text-foreground hover:bg-accent"
                        )}
                    >
                        {item}
                    </button>
                ) : (
                    <span key={item} aria-hidden="true" className="px-1 text-xs text-muted-foreground">
                        …
                    </span>
                )
            )}

            <button
                type="button"
                aria-label="Next page"
                disabled={disabled || page >= totalPages}
                onClick={() => onPageChange(page + 1)}
                className={cn(buttonClass, "text-muted-foreground hover:bg-accent")}
            >
                <Icon name="chevron-right" size="md" />
            </button>
        </nav>
    )
}

export { Pagination }
export default Pagination
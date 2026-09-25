import cn from "../../utils/cn"
import Icon from "./icon"

export type ToastVariant = "success" | "error"

export interface ToastItem {
    id: number
    message: string
    variant: ToastVariant
}

export interface ToastViewportProps {
    items: ToastItem[]
    onDismiss: (id: number) => void
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
    success: "border-teal-600/30 bg-teal-50 text-teal-700",
    error: "border-destructive/30 bg-destructive/10 text-destructive",
}

/** Danh sách toast nổi góc dưới bên phải (mobile: full-width sát cạnh dưới) */
const ToastViewport = ({ items, onDismiss }: ToastViewportProps) => {
    if (items.length === 0) return null

    return (
        <div
            role="region"
            aria-label="Notifications"
            className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
        >
            {items.map((item) => (
                <div
                    key={item.id}
                    role="status"
                    aria-live="polite"
                    className={cn(
                        "pointer-events-auto flex w-full max-w-sm items-start gap-2 rounded-lg border px-4 py-3 text-sm shadow-lg",
                        "animate-in fade-in-0 slide-in-from-bottom-2 duration-200",
                        VARIANT_STYLES[item.variant]
                    )}
                >
                    <Icon name={item.variant === "success" ? "check" : "close"} size="sm" className="mt-0.5 shrink-0" />
                    <p className="flex-1">{item.message}</p>
                    <button
                        type="button"
                        onClick={() => onDismiss(item.id)}
                        aria-label="Dismiss notification"
                        className="shrink-0 rounded p-0.5 text-current/70 transition-colors hover:text-current"
                    >
                        <Icon name="close" size="xs" />
                    </button>
                </div>
            ))}
        </div>
    )
}

export { ToastViewport }
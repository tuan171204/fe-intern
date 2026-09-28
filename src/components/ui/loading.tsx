import * as React from "react"

import cn from "../../utils/cn"

const SIZES = { sm: "size-4", md: "size-5", lg: "size-7" } as const

export interface LoadingProps extends React.SVGProps<SVGSVGElement> {
    size?: keyof typeof SIZES
    label?: string
}

/** Spinner dùng inline trong Button, form, hoặc bất kỳ đâu cần báo hiệu đang xử lý */
const Loading = ({ size = "md", label = "Loading...", className, ...props }: LoadingProps) => (
    <span role="status" className="inline-flex items-center">
        <svg
            className={cn("animate-spin text-current", SIZES[size], className)}
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            {...props}
        >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <span className="sr-only">{label}</span>
    </span>
)

export interface LoadingOverlayProps {
    show: boolean
    label?: string
    className?: string
}

/** Overlay mờ phủ container cha (cha cần position: relative) */
const LoadingOverlay = ({ show, label, className }: LoadingOverlayProps) => {
    if (!show) return null

    return (
        <div
            className={cn(
                "absolute inset-0 z-10 flex items-center justify-center gap-2 rounded-[inherit] bg-background/70 backdrop-blur-[1px]",
                className
            )}
        >
            <Loading size="lg" className="text-teal-600" />
            {label && <span className="text-xs font-medium text-muted-foreground">{label}</span>}
        </div>
    )
}

export { Loading, LoadingOverlay }
export default Loading
import * as React from "react"
import { X } from "lucide-react"

import cn from "../../utils/cn"

export interface DialogProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

const Dialog = ({ isOpen, onClose, title, children, className }: DialogProps) => {
  const titleId = React.useId()

  // Đóng bằng phím Esc + khoá scroll nền khi modal mở
  React.useEffect(() => {
    if (!isOpen) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    const prevOverflow = document.body.style.overflow

    document.addEventListener("keydown", onKeyDown)
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", onKeyDown)
      document.body.style.overflow = prevOverflow
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay làm mờ nền */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-black/30 animate-in fade-in-0 duration-200"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          "relative w-full max-w-lg rounded-xl bg-background p-6 text-foreground shadow-xl",
          "animate-in fade-in-0 zoom-in-95 duration-200",
          className
        )}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <X className="size-6" />
        </button>

        {title && (
          <h2 id={titleId} className="mb-6 px-6 text-center text-xl font-semibold">
            {title}
          </h2>
        )}

        {children}
      </div>
    </div>
  )
}

export { Dialog }
export default Dialog
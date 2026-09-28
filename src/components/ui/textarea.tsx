import * as React from "react"

import cn from "../../utils/cn"

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

/** Có bộ đếm "0/500" khi truyền `maxLength` + `value` (controlled) */
const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, id, required, maxLength, value, ...props }, ref) => {
    const autoId = React.useId()
    const textareaId = id ?? autoId
    const showCounter = maxLength !== undefined && typeof value === "string"

    return (
      <div className="flex w-full flex-col gap-1.5">
        {(label || showCounter) && (
          <div className="flex items-center justify-between text-xs">
            {label && (
              <label htmlFor={textareaId} className="font-medium text-foreground">
                {required && <span className="mr-0.5 text-destructive">*</span>}
                {label}
              </label>
            )}
            {showCounter && (
              <span className="text-muted-foreground">
                {value.length}/{maxLength}
              </span>
            )}
          </div>
        )}

        <textarea
          id={textareaId}
          ref={ref}
          value={value}
          maxLength={maxLength}
          required={required}
          aria-invalid={!!error}
          className={cn(
            "min-h-24 w-full resize-none rounded-lg border border-transparent bg-muted px-3 py-2 text-sm transition-colors",
            "placeholder:text-muted-foreground hover:border-teal-600/50",
            "focus-visible:border-teal-600 focus-visible:bg-background focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive hover:border-destructive focus-visible:border-destructive",
            className
          )}
          {...props}
        />

        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
export default Textarea

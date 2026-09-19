import * as React from "react"

import cn from "../../utils/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, required, ...props }, ref) => {
    const autoId = React.useId()
    const inputId = id ?? autoId
    const errorId = `${inputId}-error`

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-foreground">
            {required && <span className="mr-0.5 text-destructive">*</span>}
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          className={cn(
            "h-10 w-full rounded-lg border border-transparent bg-muted px-3 text-sm text-foreground transition-colors",
            "placeholder:text-muted-foreground",
            "hover:border-teal-600/50 focus-visible:border-teal-600 focus-visible:bg-background focus-visible:outline-none",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-destructive hover:border-destructive focus-visible:border-destructive",
            className
          )}
          {...props}
        />

        {error && (
          <p id={errorId} className="text-xs text-destructive">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
export default Input

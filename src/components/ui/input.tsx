import * as React from "react"

import cn from "../../utils/cn"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  /** Dòng gợi ý nhỏ dưới ô nhập (ẩn khi có lỗi) */
  hint?: string
  /** Phần tử đặt bên trái trong ô nhập (vd: icon) */
  startAdornment?: React.ReactNode
  /** Phần tử đặt bên phải trong ô nhập (vd: nút hiện/ẩn mật khẩu) */
  endAdornment?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, startAdornment, endAdornment, id, required, ...props }, ref) => {
    const autoId = React.useId()
    const inputId = id ?? autoId
    const errorId = `${inputId}-error`
    const hintId = `${inputId}-hint`

    return (
      <div className="flex w-full flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-md font-normal text-foreground">
            {required && <span className="mr-0.5 text-destructive">*</span>}
            {label}
          </label>
        )}

        <div className="relative">
          {startAdornment && (
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-muted-foreground">
              {startAdornment}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            required={required}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className={cn(
              "h-12 w-full rounded-lg border-[1.75px] border-transparent bg-[#F5FBFB] px-3 py-6 text-sm text-foreground transition-colors",
              "placeholder:text-muted-foreground",
              "hover:border-teal-600/50 focus-visible:border-teal-600 focus-visible:outline-none",
              "disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive hover:border-destructive focus-visible:border-destructive",
              startAdornment && "pl-10",
              endAdornment && "pr-10",
              className
            )}
            {...props}
          />
          {endAdornment && (
            <div className="absolute inset-y-0 right-3 flex items-center">{endAdornment}</div>
          )}
        </div>

        {error ? (
          <p id={errorId} className="text-xs text-destructive">
            {error}
          </p>
        ) : (
          hint && (
            <p id={hintId} className="text-[10px] text-muted-foreground">
              {hint}
            </p>
          )
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
export default Input
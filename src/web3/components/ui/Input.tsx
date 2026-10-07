// components/ui/Input.tsx
import type { InputHTMLAttributes, ReactNode } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean
  /** Phần tử đặt bên phải trong ô nhập (symbol token, nút Max...) */
  suffix?: ReactNode
}

export function Input({ invalid = false, suffix, className = '', ...props }: InputProps) {
  const state = invalid
    ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
    : 'border-slate-200 focus:border-indigo-400 focus:ring-indigo-100'

  return (
    <div className="relative">
      <input
        {...props}
        aria-invalid={invalid || undefined}
        className={
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm transition ' +
          'placeholder:text-slate-400 focus:outline-none focus:ring-4 disabled:bg-slate-50 ' +
          `${state} ${suffix ? 'pr-28' : ''} ${className}`
        }
      />
      {suffix && <div className="absolute inset-y-0 right-2 flex items-center gap-2">{suffix}</div>}
    </div>
  )
}

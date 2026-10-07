// components/ui/Field.tsx
// Label + input + hint/lỗi. `children` là render-prop nhận `id` để label gắn đúng với input.
import { useId, type ReactNode } from 'react'

interface FieldProps {
  label: string
  hint?: ReactNode
  error?: string | null
  children: (id: string) => ReactNode
}

export function Field({ label, hint, error, children }: FieldProps) {
  const id = useId()
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        {hint && <span className="text-xs text-slate-500">{hint}</span>}
      </div>
      {children(id)}
      {error && <p className="mt-1.5 text-xs text-rose-600">{error}</p>}
    </div>
  )
}

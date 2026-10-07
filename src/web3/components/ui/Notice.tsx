// components/ui/Notice.tsx
import type { ReactNode } from 'react'
import { Icon, type IconName } from './Icon'
import { Spinner } from './Spinner'

export type Tone = 'info' | 'success' | 'error' | 'warning'

const tones: Record<Tone, { box: string; icon: IconName }> = {
  info: { box: 'border-sky-200 bg-sky-50 text-sky-900', icon: 'info' },
  success: { box: 'border-emerald-200 bg-emerald-50 text-emerald-900', icon: 'checkCircle' },
  error: { box: 'border-rose-200 bg-rose-50 text-rose-900', icon: 'xCircle' },
  warning: { box: 'border-amber-200 bg-amber-50 text-amber-900', icon: 'alert' },
}

interface NoticeProps {
  tone: Tone
  /** Hiện spinner thay icon (đang chờ xử lý) */
  loading?: boolean
  children: ReactNode
}

export function Notice({ tone, loading = false, children }: NoticeProps) {
  const { box, icon } = tones[tone]
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={`flex items-start gap-2.5 rounded-2xl border px-3.5 py-3 text-sm ${box}`}
    >
      <span className="mt-0.5 shrink-0">
        {loading ? <Spinner className="h-4 w-4" /> : <Icon name={icon} className="h-4 w-4" />}
      </span>
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}

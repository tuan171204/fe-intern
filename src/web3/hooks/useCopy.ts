// hooks/useCopy.ts
// Copy text vào clipboard và bật cờ `copied` trong thời gian ngắn để đổi nhãn nút.
import { useCallback, useEffect, useRef, useState } from 'react'

export function useCopy(resetMs = 1500) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  // Dọn timer khi component bị huỷ.
  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text)
        setCopied(true)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => setCopied(false), resetMs)
      } catch {
        // Clipboard có thể bị chặn (http, quyền trình duyệt) -> bỏ qua êm.
      }
    },
    [resetMs],
  )

  return { copied, copy }
}

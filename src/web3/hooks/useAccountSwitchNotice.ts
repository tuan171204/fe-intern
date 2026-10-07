// Khi account đang dùng đổi từ A sang B (do chọn trong app hoặc đổi trong MetaMask),
// hook này phát hiện và trả về địa chỉ mới trong vài giây để hiện thông báo ngắn.
import { useEffect, useRef, useState } from 'react'
import type { Address } from 'viem'

export function useAccountSwitchNotice(address: Address | undefined, visibleMs = 5000): Address | null {
  const previous = useRef<Address | undefined>(undefined)
  const [switchedTo, setSwitchedTo] = useState<Address | null>(null)

  useEffect(() => {
    if (!address) {
      setSwitchedTo(null) // ngắt kết nối -> xoá thông báo
      previous.current = undefined
      return
    }
    const hasSwitched = previous.current !== undefined && previous.current !== address
    previous.current = address
    if (!hasSwitched) return

    setSwitchedTo(address)
    const timer = window.setTimeout(() => setSwitchedTo(null), visibleMs)
    return () => window.clearTimeout(timer)
  }, [address, visibleMs])

  return switchedTo
}
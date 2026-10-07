// hooks/useAccountSwitchNotice.ts
// Khi người dùng đổi tài khoản trong MetaMask (sự kiện accountsChanged), wagmi tự cập nhật
// `address`. Hook này phát hiện việc đổi từ tài khoản A sang B để hiện thông báo ngắn.
import { useEffect, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import type { Address } from 'viem'

export function useAccountSwitchNotice(visibleMs = 5000): Address | null {
  const { address } = useAccount()
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

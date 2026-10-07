// components/AccountMenu.tsx
// Xử lý trường hợp MetaMask kết nối NHIỀU tài khoản:
//  - wagmi trả `addresses` (tất cả account đã cấp quyền) và `address` (account đang active).
//  - App chỉ dùng account active; khi đổi account trong MetaMask, wagmi tự cập nhật `address`.
//  - Menu này liệt kê các account, đánh dấu account đang dùng, và cho mở lại hộp chọn account.
import { useEffect, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import type { EIP1193Provider } from 'viem'
import { shortenAddress } from '../lib/format'
import { Avatar } from './ui/Avatar'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'

export function AccountMenu() {
  const { address, addresses, connector } = useAccount()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Đóng menu khi bấm ra ngoài hoặc nhấn Escape.
  useEffect(() => {
    if (!open) return
    const onMouseDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  if (!address) return null
  const accounts = addresses ?? [address]

  // Mở hộp chọn account của MetaMask (wallet_requestPermissions) để thêm/bớt account được kết nối.
  // Sau khi người dùng chọn xong, MetaMask phát accountsChanged và wagmi tự cập nhật.
  const manageAccounts = async () => {
    if (!connector) return
    try {
      const provider = (await connector.getProvider()) as EIP1193Provider
      await provider.request({ method: 'wallet_requestPermissions', params: [{ eth_accounts: {} }] })
    } catch {
      // Người dùng đóng hộp thoại -> bỏ qua.
    }
    setOpen(false)
  }

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white py-1.5 pl-2 pr-3 text-sm font-medium text-slate-800 shadow-sm transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
      >
        <Avatar address={address} size="sm" />
        <span className="font-mono">{shortenAddress(address)}</span>
        {accounts.length > 1 && (
          <span className="rounded-full bg-indigo-100 px-1.5 py-0.5 text-[10px] font-semibold text-indigo-700">
            {accounts.length}
          </span>
        )}
        <Icon
          name="chevronDown"
          className={`h-4 w-4 text-slate-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-10 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10"
        >
          <p className="px-2 pb-1 pt-1.5 text-xs font-medium text-slate-500">
            Tài khoản đã kết nối ({accounts.length})
          </p>

          <ul className="space-y-0.5">
            {accounts.map((acc) => (
              <li
                key={acc}
                className={`flex items-center gap-2.5 rounded-xl px-2 py-2 ${
                  acc === address ? 'bg-indigo-50' : ''
                }`}
              >
                <Avatar address={acc} size="sm" />
                <span title={acc} className="flex-1 font-mono text-sm text-slate-800">
                  {shortenAddress(acc)}
                </span>
                {acc === address && (
                  <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                    Đang dùng
                  </span>
                )}
              </li>
            ))}
          </ul>

          <p className="px-2 py-2 text-xs leading-relaxed text-slate-500">
            Ứng dụng luôn dùng tài khoản đang được chọn trong MetaMask. Để đổi, hãy chọn tài khoản khác
            ngay trong MetaMask.
          </p>

          <Button variant="secondary" size="sm" fullWidth onClick={manageAccounts}>
            Chọn lại tài khoản kết nối
          </Button>
        </div>
      )}
    </div>
  )
}

// Menu chọn account trong số các account MetaMask đã cấp quyền cho app:
//  - `accounts`: tất cả account đã cấp quyền; `address`: account đang dùng trong app.
//  - Bấm một account để dùng nó (MetaMask không cho dApp tự đổi account của ví, nên app tự giữ lựa chọn).
//  - Account chưa có trong danh sách: bấm "Chọn lại tài khoản kết nối" để mở hộp chọn của MetaMask.
import { useEffect, useRef, useState } from 'react'
import { useAccount } from 'wagmi'
import type { Address, EIP1193Provider } from 'viem'
import { shortenAddress } from '../lib/format'
import { Avatar } from './ui/Avatar'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'

interface AccountMenuProps {
  /** Account đang dùng trong app */
  address: Address | undefined
  /** Các account đã cấp quyền */
  accounts: readonly Address[]
  onSelect: (address: Address) => void
}

export function AccountMenu({ address, accounts, onSelect }: AccountMenuProps) {
  const { connector } = useAccount()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

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

  // Mở hộp chọn account của MetaMask (wallet_requestPermissions) để thêm/bớt account được kết nối.
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
            {accounts.map((acc) => {
              const isActive = acc === address
              return (
                <li key={acc}>
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      onSelect(acc)
                      setOpen(false)
                    }}
                    className={`flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-2 py-2 text-left transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${isActive ? 'bg-indigo-50' : ''
                      }`}
                  >
                    <Avatar address={acc} size="sm" />
                    <span title={acc} className="flex-1 font-mono text-sm text-slate-800">
                      {shortenAddress(acc)}
                    </span>
                    {isActive && (
                      <span className="rounded-full bg-indigo-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                        Đang dùng
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          <p className="px-2 py-2 text-xs leading-relaxed text-slate-500">
            Chọn tài khoản để dùng trong ứng dụng. Muốn dùng tài khoản chưa có trong danh sách, bấm
            “Chọn lại tài khoản kết nối”.
          </p>

          <Button variant="secondary" size="sm" fullWidth onClick={manageAccounts}>
            Chọn lại tài khoản kết nối
          </Button>
        </div>
      )}
    </div>
  )
}
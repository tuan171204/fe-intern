// components/WalletPanel.tsx
// Tính năng 2: Connect / Disconnect MetaMask, hiển thị địa chỉ rút gọn + nút Copy.
import { useState } from 'react'
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { getErrorMessage, shortenAddress } from '../lib/format'
import { ghostButtonClass, primaryButtonClass } from './ui/styles'

export function WalletPanel() {
  // useAccount: trạng thái ví hiện tại (address, đã kết nối chưa...)
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  // useConnect: hàm connect + danh sách connector khai báo trong config.ts
  const { connect, connectors, isPending, error } = useConnect()
  // useDisconnect: ngắt kết nối ví
  const { disconnect } = useDisconnect()

  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!address) return
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1500)
    } catch {
      // Clipboard có thể bị chặn (http, quyền trình duyệt) -> bỏ qua êm.
    }
  }

  if (isConnected && address) {
    return (
      <div className="flex flex-wrap items-center gap-2">
        <span title={address} className="rounded-lg bg-slate-100 px-3 py-1.5 font-mono text-sm text-slate-800">
          {shortenAddress(address)}
        </span>
        <button type="button" onClick={handleCopy} className={ghostButtonClass}>
          {copied ? 'Đã copy' : 'Copy'}
        </button>
        <button type="button" onClick={() => disconnect()} className={ghostButtonClass}>
          Disconnect
        </button>
      </div>
    )
  }

  const busy = isPending || isConnecting || isReconnecting
  const connector = connectors[0]

  return (
    <div className="flex flex-col items-start gap-2 sm:items-end">
      <button
        type="button"
        disabled={busy || !connector}
        onClick={() => connector && connect({ connector })}
        className={`${primaryButtonClass} sm:w-auto`}
      >
        {busy ? 'Đang kết nối…' : 'Connect Wallet'}
      </button>
      {error && <p className="max-w-xs text-xs text-rose-600">{getErrorMessage(error)}</p>}
    </div>
  )
}

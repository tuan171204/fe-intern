import { useAccount, useConnect } from 'wagmi'
import { getErrorMessage } from '../lib/format'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'

export function ConnectPrompt() {
  const { connect, connectors, isPending, error } = useConnect()
  const { isConnecting, isReconnecting } = useAccount()

  const busy = isPending || isConnecting || isReconnecting
  const connector = connectors[0]

  return (
    <section className="flex flex-col items-center rounded-3xl border border-slate-200/80 bg-white px-6 py-14 text-center shadow-sm">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
        <Icon name="wallet" className="h-7 w-7" />
      </span>
      <h2 className="mt-5 text-lg font-semibold text-slate-900">Kết nối ví để bắt đầu</h2>
      <p className="mt-1.5 max-w-sm text-sm text-slate-500">
        Dùng MetaMask để xem số dư và chuyển ETH hoặc token ERC-20 trên Sepolia.
      </p>

      <Button
        className="mt-6"
        loading={busy}
        disabled={!connector}
        onClick={() => connector && connect({ connector })}
      >
        {busy ? 'Đang kết nối…' : 'Connect Wallet'}
      </Button>

      {error && <p className="mt-4 max-w-sm text-xs text-rose-600">{getErrorMessage(error)}</p>}
    </section>
  )
}

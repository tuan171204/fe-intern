// components/WalletCard.tsx
// Thẻ tổng quan: tài khoản đang dùng, nút Copy và số dư Sepolia ETH.
import { useAccount, useBalance } from 'wagmi'
import type { Address } from 'viem'
import { SEPOLIA_CHAIN_ID } from '../constants/network'
import { useCopy } from '../hooks/useCopy'
import { formatDisplay, shortenAddress } from '../lib/format'
import { Avatar } from './ui/Avatar'
import { Button } from './ui/Button'
import { Icon } from './ui/Icon'

export function WalletCard({ address }: { address: Address }) {
  const { addresses } = useAccount()
  // Cùng query key với useEthTransfer => react-query dùng chung cache, không gọi RPC thêm.
  const { data: balance, isLoading } = useBalance({ address, chainId: SEPOLIA_CHAIN_ID })
  const { copied, copy } = useCopy()
  const accountCount = addresses?.length ?? 1

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 p-6 text-white shadow-lg shadow-slate-900/10 sm:p-8">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-indigo-500/25 blur-3xl" />

      <div className="relative flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <Avatar address={address} size="lg" />
          <div>
            <p className="text-xs text-slate-400">Tài khoản đang dùng</p>
            <p title={address} className="mt-0.5 font-mono text-base font-medium">
              {shortenAddress(address)}
            </p>
          </div>
        </div>

        <Button variant="glass" size="sm" onClick={() => copy(address)}>
          <Icon name={copied ? 'check' : 'copy'} className="h-3.5 w-3.5" />
          {copied ? 'Đã copy' : 'Copy'}
        </Button>
      </div>

      <div className="relative mt-8">
        <p className="text-xs text-slate-400">Số dư Sepolia ETH</p>
        {isLoading || !balance ? (
          <div className="mt-2 h-10 w-48 animate-pulse rounded-lg bg-white/10" />
        ) : (
          <p className="mt-1 break-all text-4xl font-semibold tabular-nums tracking-tight">
            {formatDisplay(balance.value, balance.decimals)}
            <span className="ml-2 text-lg font-medium text-slate-400">{balance.symbol}</span>
          </p>
        )}
      </div>

      {accountCount > 1 && (
        <p className="relative mt-6 text-xs text-slate-400">
          MetaMask đang kết nối {accountCount} tài khoản. Mọi giao dịch sẽ dùng tài khoản ở trên.
        </p>
      )}
    </section>
  )
}

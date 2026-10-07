// components/Header.tsx
import { useDisconnect } from 'wagmi'
import type { Address } from 'viem'
import { AccountMenu } from './AccountMenu'
import { NetworkPill } from './NetworkPill'
import { Button } from './ui/Button'

interface HeaderProps {
  isConnected: boolean
  isWrongNetwork: boolean
  /** Account đang dùng trong app */
  address: Address | undefined
  /** Các account MetaMask đã cấp quyền */
  accounts: readonly Address[]
  onSelectAccount: (address: Address) => void
}

export function Header({ isConnected, isWrongNetwork, address, accounts, onSelectAccount }: HeaderProps) {
  const { disconnect } = useDisconnect()

  return (
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">Sepolia Wallet</h1>
        <p className="text-sm text-slate-500">Chuyển ETH và ERC-20 trên mạng thử nghiệm.</p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <NetworkPill isConnected={isConnected} isWrongNetwork={isWrongNetwork} />
        {isConnected && (
          <>
            <AccountMenu address={address} accounts={accounts} onSelect={onSelectAccount} />
            <Button variant="secondary" size="sm" onClick={() => disconnect()}>
              Disconnect
            </Button>
          </>
        )}
      </div>
    </header>
  )
}
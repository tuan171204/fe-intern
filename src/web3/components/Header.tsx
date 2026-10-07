// components/Header.tsx
import { useDisconnect } from 'wagmi'
import { AccountMenu } from './AccountMenu'
import { NetworkPill } from './NetworkPill'
import { Button } from './ui/Button'

interface HeaderProps {
  isConnected: boolean
  isWrongNetwork: boolean
}

export function Header({ isConnected, isWrongNetwork }: HeaderProps) {
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
            <AccountMenu />
            <Button variant="secondary" size="sm" onClick={() => disconnect()}>
              Disconnect
            </Button>
          </>
        )}
      </div>
    </header>
  )
}

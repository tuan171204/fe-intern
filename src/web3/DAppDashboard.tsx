// DAppDashboard.tsx
// Trang chính: chỉ ghép các phần lại với nhau, không chứa logic nghiệp vụ.
import { ConnectPrompt } from './components/ConnectPrompt'
import { Erc20Card } from './components/Erc20Card'
import { EthCard } from './components/EthCard'
import { Header } from './components/Header'
import { NetworkBanner } from './components/NetworkBanner'
import { WalletCard } from './components/WalletCard'
import { Notice } from './components/ui/Notice'
import { useAccountSwitchNotice } from './hooks/useAccountSwitchNotice'
import { useActiveAccount } from './hooks/useActiveAccount'
import { useNetworkGuard } from './hooks/useNetworkGuard'
import { shortenAddress } from './lib/format'

export default function DAppDashboard() {
  const { isConnected, isWrongNetwork, canTransact } = useNetworkGuard()
  const { address, accounts, selectAccount } = useActiveAccount()
  const switchedTo = useAccountSwitchNotice(address)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 antialiased">
      <div className="mx-auto max-w-4xl space-y-5 px-4 py-6 sm:px-6 lg:py-10">
        <Header
          isConnected={isConnected}
          isWrongNetwork={isWrongNetwork}
          address={address}
          accounts={accounts}
          onSelectAccount={selectAccount}
        />

        {switchedTo && (
          <Notice tone="info">
            Đã chuyển sang tài khoản <span className="font-mono font-medium">{shortenAddress(switchedTo)}</span>.
            Số dư và các form đã được làm mới.
          </Notice>
        )}

        {isWrongNetwork && <NetworkBanner />}

        {isConnected && address ? (
          <>
            <WalletCard address={address} />

            {/* key={address}: đổi account -> remount, xoá sạch form và trạng thái giao dịch của account cũ */}
            <div
              className={`grid gap-5 transition-opacity duration-200 md:grid-cols-2 ${isWrongNetwork ? 'opacity-60' : ''
                }`}
            >
              <EthCard key={`eth-${address}`} address={address} canTransact={canTransact} />
              <Erc20Card key={`erc20-${address}`} address={address} canTransact={canTransact} />
            </div>
          </>
        ) : (
          <ConnectPrompt />
        )}
      </div>
    </div>
  )
}
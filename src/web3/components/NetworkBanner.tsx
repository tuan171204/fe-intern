// components/NetworkBanner.tsx
// Tính năng 1: banner cảnh báo sai mạng + nút "Switch to Sepolia Network".
import { useSwitchChain } from 'wagmi'
import { SEPOLIA_CHAIN_ID } from '../constants/network'
import { getErrorMessage } from '../lib/format'
import { Button } from './ui/Button'
import { Notice } from './ui/Notice'

export function NetworkBanner() {
  const { switchChain, isPending, error } = useSwitchChain()

  return (
    <div className="space-y-2">
      <Notice tone="warning">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>Ví đang ở sai mạng. Ứng dụng này chỉ hoạt động trên Sepolia Testnet.</span>
          <Button size="sm" loading={isPending} onClick={() => switchChain({ chainId: SEPOLIA_CHAIN_ID })}>
            {isPending ? 'Đang chuyển…' : 'Switch to Sepolia Network'}
          </Button>
        </div>
      </Notice>
      {error && <Notice tone="error">{getErrorMessage(error)}</Notice>}
    </div>
  )
}

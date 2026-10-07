// hooks/useNetworkGuard.ts
// Tính năng 1: kiểm tra mạng của ví + tự động yêu cầu chuyển sang Sepolia.
import { useEffect, useRef } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { SEPOLIA_CHAIN_ID } from '../constants/network'

export function useNetworkGuard() {
  // chainId ở đây là chain THỰC TẾ mà ví đang dùng (kể cả chain không nằm trong config).
  const { address, chainId, isConnected } = useAccount()
  // useSwitchChain: yêu cầu ví đổi sang chain khác.
  const { switchChain } = useSwitchChain()

  const isWrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID

  // Tự động yêu cầu MetaMask chuyển sang Sepolia ngay khi kết nối sai mạng.
  // Dùng ref để chỉ tự hỏi 1 lần/phiên kết nối (tránh spam popup nếu người dùng từ chối);
  // sau đó người dùng vẫn có thể bấm nút trong NetworkBanner.
  const autoSwitchAsked = useRef(false)
  useEffect(() => {
    if (!isConnected) {
      autoSwitchAsked.current = false
      return
    }
    if (isWrongNetwork && !autoSwitchAsked.current) {
      autoSwitchAsked.current = true
      switchChain({ chainId: SEPOLIA_CHAIN_ID })
    }
  }, [isConnected, isWrongNetwork, switchChain])

  return {
    address,
    isConnected,
    isWrongNetwork,
    /** Chỉ cho phép gửi giao dịch khi đã kết nối và đúng mạng */
    canTransact: isConnected && !isWrongNetwork,
  }
}

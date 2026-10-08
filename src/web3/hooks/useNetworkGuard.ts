import { useEffect, useRef } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'
import { SEPOLIA_CHAIN_ID } from '../constants/network'

export function useNetworkGuard() {
  // chainId ở đây là chain THỰC TẾ mà ví đang dùng (kể cả chain không nằm trong config).
  const { address, chainId, isConnected } = useAccount()
  // useSwitchChain: yêu cầu ví đổi sang chain khác.
  const { switchChain } = useSwitchChain()

  const isWrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID
  
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

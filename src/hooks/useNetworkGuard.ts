import * as React from "react"
import { useAccount, useSwitchChain } from "wagmi"

import { SEPOLIA_CHAIN_ID } from "../config/network"

/**
 * Chain Guard: khi ví đang kết nối nhưng sai mạng, tự động yêu cầu chuyển sang Sepolia (1 lần / lần kết nối).
 * Nếu người dùng từ chối, `isWrongNetwork` vẫn là true để UI hiện banner + nút "Switch to Sepolia".
 * Khi chưa kết nối ví, hook không làm gì
 */
export function useNetworkGuard() {
    // chainId ở đây là chain thực tế mà ví đang dùng (kể cả chain không nằm trong config)
    const { address, chainId, isConnected } = useAccount()
    const { switchChain } = useSwitchChain()

    const isWrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID

    const autoSwitchAsked = React.useRef(false)
    React.useEffect(() => {
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
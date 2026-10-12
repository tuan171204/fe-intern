// File: src/hooks/useNetworkGuard.ts
import * as React from "react"
import { useAccount, useSwitchChain } from "wagmi"

import { SEPOLIA_CHAIN_ID } from "../config/network"

export interface UseNetworkGuardOptions {
    /** true: tự yêu cầu ví chuyển sang Sepolia (1 lần / lần kết nối). Chỉ bật ở NetworkGuard toàn cục. */
    autoSwitch?: boolean
}

/**
 * Chain Guard: phát hiện ví đang kết nối nhưng sai mạng (không phải Sepolia 11155111).
 * Khi chưa kết nối ví, hook không làm gì nên các trang Web2 không bị ảnh hưởng.
 */
export function useNetworkGuard({ autoSwitch = false }: UseNetworkGuardOptions = {}) {
    // chainId ở đây là chain THỰC TẾ mà ví đang dùng (kể cả chain không nằm trong config)
    const { address, chainId, isConnected } = useAccount()
    const { switchChain } = useSwitchChain()

    const isWrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID

    const autoSwitchAsked = React.useRef(false)
    React.useEffect(() => {
        if (!isConnected) {
            autoSwitchAsked.current = false
            return
        }
        if (autoSwitch && isWrongNetwork && !autoSwitchAsked.current) {
            autoSwitchAsked.current = true
            switchChain({ chainId: SEPOLIA_CHAIN_ID })
        }
    }, [autoSwitch, isConnected, isWrongNetwork, switchChain])

    return {
        address,
        chainId,
        isConnected,
        isWrongNetwork,
        /** Chỉ cho phép gửi giao dịch khi đã kết nối và đúng mạng */
        canTransact: isConnected && !isWrongNetwork,
    }
}
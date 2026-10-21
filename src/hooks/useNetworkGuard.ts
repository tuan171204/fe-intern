// File: src/hooks/useNetworkGuard.ts
import * as React from "react"
import { useAccount, useSwitchChain } from "wagmi"

import { SEPOLIA_CHAIN_ID } from "../config/network"

export interface UseNetworkGuardOptions {
    /**
     * true: tự yêu cầu ví chuyển sang Sepolia (1 lần mỗi khi ví rời khỏi Sepolia).
     * Chỉ bật ở NetworkGuard toàn cục, và phải tắt khi luồng đăng nhập SIWE đang chạy
     * (luồng đó tự chuyển mạng theo đúng thứ tự trước khi xin chữ ký).
     */
    autoSwitch?: boolean
}

/**
 * Chain Guard: phát hiện ví đang kết nối nhưng sai mạng (không phải Sepolia 11155111).
 * Khi chưa kết nối ví, hook không làm gì.
 */
export function useNetworkGuard({ autoSwitch = false }: UseNetworkGuardOptions = {}) {
    // chainId ở đây là chain THỰC TẾ mà ví đang dùng (kể cả chain không nằm trong config)
    const { address, chainId, isConnected } = useAccount()
    const { switchChain } = useSwitchChain()

    const isWrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID

    const autoSwitchAsked = React.useRef(false)
    React.useEffect(() => {
        /* Chưa kết nối hoặc đã đúng mạng: reset để lần sai mạng sau được hỏi lại 1 lần */
        if (!isConnected || !isWrongNetwork) {
            autoSwitchAsked.current = false
            return
        }
        if (autoSwitch && !autoSwitchAsked.current) {
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
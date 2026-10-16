import * as React from "react"
import { useAccount, useConnect, useDisconnect, type Connector } from "wagmi"

import { useToast } from "../store/ToastContext"
import { getWalletErrorMessage } from "../utils/web3-errors"

/** Bỏ connector trùng tên (MetaMask có thể xuất hiện 2 lần: cấu hình sẵn + tự phát hiện qua EIP-6963). */
const uniqueByName = (list: readonly Connector[]): Connector[] => {
    const seen = new Set<string>()
    return list.filter((c) => {
        const key = c.name.toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })
}

export function useWalletConnection() {
    const { address, isConnected, isConnecting, isReconnecting } = useAccount()
    const { connect, connectors, isPending, variables } = useConnect()
    const { disconnect } = useDisconnect()
    const { success, error: showError } = useToast()

    const walletConnectors = React.useMemo(() => uniqueByName(connectors), [connectors])

    // Connector đang chờ người dùng xác nhận trong ví
    const pendingConnector = variables?.connector
    const pendingConnectorId = isPending && typeof pendingConnector !== "function" ? pendingConnector?.id : undefined

    const connectWallet = React.useCallback(
        (target: Connector, onConnected?: () => void) => {
            connect(
                { connector: target },
                {
                    onSuccess: () => {
                        success("Kết nối ví thành công")
                        onConnected?.()
                    },
                    onError: (err) =>
                        showError(getWalletErrorMessage(err, "Bạn đã từ chối yêu cầu kết nối trong MetaMask.")),
                }
            )
        },
        [connect, success, showError]
    )

    const disconnectWallet = React.useCallback(() => {
        disconnect(undefined, { onSuccess: () => success("Đã ngắt kết nối ví") })
    }, [disconnect, success])

    return {
        address,
        isConnected,
        /** Đang kết nối hoặc đang khôi phục kết nối cũ khi tải trang */
        isBusy: isConnecting || isReconnecting || isPending,
        isRestoring: isReconnecting,
        walletConnectors,
        pendingConnectorId,
        isPending,
        connectWallet,
        disconnectWallet,
    }
}
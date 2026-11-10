import * as React from "react"
import { useAccount, useConnect, useDisconnect, type Connector } from "wagmi"

import i18n from "../i18n"
import { useToast } from "../store/ToastContext"
import { getWalletErrorMessage } from "../utils/web3-errors"

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

    // Connector currently waiting for the user's confirmation in the wallet
    const pendingConnector = variables?.connector
    const pendingConnectorId = isPending && typeof pendingConnector !== "function" ? pendingConnector?.id : undefined

    const connectWallet = React.useCallback(
        (target: Connector, onConnected?: () => void) => {
            connect(
                { connector: target },
                {
                    onSuccess: () => {
                        success(i18n.t("wallet.toast.connected"))
                        onConnected?.()
                    },
                    onError: (err) =>
                        showError(getWalletErrorMessage(err, i18n.t("errors.rejectedConnection"))),
                }
            )
        },
        [connect, success, showError]
    )

    const disconnectWallet = React.useCallback(() => {
        disconnect(undefined, { onSuccess: () => success(i18n.t("wallet.toast.disconnected")) })
    }, [disconnect, success])

    return {
        address,
        isConnected,
        /** Connecting, or restoring a previous connection on page load */
        isBusy: isConnecting || isReconnecting || isPending,
        isRestoring: isReconnecting,
        walletConnectors,
        pendingConnectorId,
        isPending,
        connectWallet,
        disconnectWallet,
    }
}
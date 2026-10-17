import * as React from "react"
import { useSwitchChain } from "wagmi"

import { SEPOLIA_CHAIN_ID } from "../config/network"
import { useToast } from "../store/ToastContext"
import { getWalletErrorMessage } from "../utils/web3-errors"

/** Request ví chuyển sang Sepolia kèm Toast báo kết quả. */
export function useSwitchToSepolia() {
    const { switchChain, isPending } = useSwitchChain()
    const { success, error: showError } = useToast()

    const switchToSepolia = React.useCallback(() => {
        switchChain(
            { chainId: SEPOLIA_CHAIN_ID },
            {
                onSuccess: () => success("Switched to Sepolia Testnet"),
                onError: (err) =>
                    showError(getWalletErrorMessage(err, "You rejected the network switch in MetaMask.")),
            }
        )
    }, [switchChain, success, showError])

    return { switchToSepolia, isSwitching: isPending }
}
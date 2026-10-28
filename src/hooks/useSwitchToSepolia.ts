import * as React from "react"
import { useSwitchChain } from "wagmi"

import { SEPOLIA_CHAIN_ID } from "../config/network"
import i18n from "../i18n"
import { useToast } from "../store/ToastContext"
import { getWalletErrorMessage } from "../utils/web3-errors"

/** Asks the wallet to switch to Sepolia and reports the result with a toast. */
export function useSwitchToSepolia() {
    const { switchChain, isPending } = useSwitchChain()
    const { success, error: showError } = useToast()

    const switchToSepolia = React.useCallback(() => {
        switchChain(
            { chainId: SEPOLIA_CHAIN_ID },
            {
                onSuccess: () => success(i18n.t("wallet.toast.switched")),
                onError: (err) =>
                    showError(getWalletErrorMessage(err, i18n.t("errors.rejectedSwitch"))),
            }
        )
    }, [switchChain, success, showError])

    return { switchToSepolia, isSwitching: isPending }
}
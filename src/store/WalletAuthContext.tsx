import * as React from "react"
import { isAxiosError } from "axios"
import { useAccount, useConnect, useDisconnect, useSignMessage, useSwitchChain, type Connector } from "wagmi"

import { loginWithSignature, requestMessage } from "../api/auth"
import { SEPOLIA_CHAIN_ID } from "../config/network"
import i18n from "../i18n"
import { getErrorMessage } from "../utils/api"
import { getWalletErrorMessage } from "../utils/web3-errors"
import { useAuth } from "./AuthContext"
import { useToast } from "./ToastContext"

export type SiweStep =
    | "idle"
    | "connecting"
    | "switching"
    | "requesting"
    | "signing"
    | "authenticating"
    | "success"
    | "error"

interface WalletAuthContextValue {
    step: SiweStep
    /** True while the flow is in any step from connecting to authenticating */
    isBusy: boolean
    /** Id of the connector waiting for confirmation in the wallet */
    pendingConnectorId: string | undefined
    /** Full flow: connect wallet -> (switch to Sepolia) -> request message -> sign -> login */
    connectAndSignIn: (connector: Connector, onConnected?: () => void) => Promise<void>
    /** Re-runs (switch to Sepolia) -> request -> sign -> login when the wallet is already connected (retry after an error) */
    signIn: () => Promise<void>
    /** Clears the session and disconnects the wallet */
    logout: () => void
}

const WalletAuthContext = React.createContext<WalletAuthContextValue | undefined>(undefined)

const toErrorMessage = (err: unknown) =>
    isAxiosError(err)
        ? getErrorMessage(err, i18n.t("errors.authFailed"))
        : getWalletErrorMessage(err, i18n.t("errors.rejectedRequest"))

const WalletAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { address, chainId, status } = useAccount()
    const { connectAsync } = useConnect()
    const { disconnect } = useDisconnect()
    const { signMessageAsync } = useSignMessage()
    const { switchChainAsync } = useSwitchChain()
    const { isLogged, user, login, logout: clearSession } = useAuth()
    const { success, error: toastError } = useToast()

    const [step, setStep] = React.useState<SiweStep>("idle")
    const [pendingConnectorId, setPendingConnectorId] = React.useState<string | undefined>(undefined)

    /* Prevents running the flow twice (double click, StrictMode, retry while running) */
    const inFlight = React.useRef(false)

    /* The wallet must be on the right network BEFORE asking for a signature: the switch finishes
       (or is rejected) first, then the signing step starts, so MetaMask never shows two popups at once.
       NetworkGuard is disabled while this flow runs. */
    const ensureSepolia = React.useCallback(
        async (currentChainId: number | undefined) => {
            if (currentChainId === SEPOLIA_CHAIN_ID) return
            setStep("switching")
            await switchChainAsync({ chainId: SEPOLIA_CHAIN_ID })
        },
        [switchChainAsync]
    )

    const authenticate = React.useCallback(
        async (walletAddress: string, currentChainId: number | undefined) => {
            await ensureSepolia(currentChainId)

            setStep("requesting")
            const message = await requestMessage({ walletAddress })

            setStep("signing")
            const signature = await signMessageAsync({ message })

            setStep("authenticating")
            const token = await loginWithSignature({ walletAddress, signature, message })

            login(token)
            setStep("success")
            success(i18n.t("auth.signedIn"))
        },
        [ensureSepolia, signMessageAsync, login, success]
    )

    const connectAndSignIn = React.useCallback(
        async (connector: Connector, onConnected?: () => void) => {
            if (inFlight.current) return
            inFlight.current = true

            try {
                setStep("connecting")
                setPendingConnectorId(connector.id)
                const { accounts, chainId: connectedChainId } = await connectAsync({ connector })

                setPendingConnectorId(undefined)
                onConnected?.()
                await authenticate(accounts[0], connectedChainId)
            } catch (err) {
                setStep("error")
                toastError(toErrorMessage(err))
            } finally {
                setPendingConnectorId(undefined)
                inFlight.current = false
            }
        },
        [connectAsync, authenticate, toastError]
    )

    const signIn = React.useCallback(async () => {
        if (inFlight.current || !address) return
        inFlight.current = true

        try {
            await authenticate(address, chainId)
        } catch (err) {
            setStep("error")
            toastError(toErrorMessage(err))
        } finally {
            inFlight.current = false
        }
    }, [address, chainId, authenticate, toastError])

    const logout = React.useCallback(() => {
        clearSession()
        disconnect()
        setStep("idle")
    }, [clearSession, disconnect])

    /* Wallet disconnected -> clear the session. This also covers a page reload: wagmi goes through
       "connecting"/"reconnecting" and ends at "disconnected" when MetaMask no longer grants access to the site. */
    const walletWasActive = React.useRef(false)
    React.useEffect(() => {
        if (status === "connected" || status === "connecting" || status === "reconnecting") {
            walletWasActive.current = true
            return
        }
        if (status === "disconnected" && walletWasActive.current) {
            walletWasActive.current = false
            if (isLogged) clearSession()
        }
    }, [status, isLogged, clearSession])

    /* Account switched inside MetaMask -> the JWT no longer matches the active wallet */
    React.useEffect(() => {
        if (status !== "connected" || !address || !user) return
        if (address.toLowerCase() !== user.address.toLowerCase()) {
            clearSession()
            toastError(i18n.t("auth.accountChanged"))
        }
    }, [status, address, user, clearSession, toastError])

    /* Every logout path (Logout button, wallet disconnect, expired token) -> reset the flow to idle */
    React.useEffect(() => {
        if (!isLogged && step === "success") setStep("idle")
    }, [isLogged, step])

    const value = React.useMemo<WalletAuthContextValue>(
        () => ({
            step,
            isBusy:
                step === "connecting" ||
                step === "switching" ||
                step === "requesting" ||
                step === "signing" ||
                step === "authenticating",
            pendingConnectorId,
            connectAndSignIn,
            signIn,
            logout,
        }),
        [step, pendingConnectorId, connectAndSignIn, signIn, logout]
    )

    return <WalletAuthContext.Provider value={value}>{children}</WalletAuthContext.Provider>
}

const useWalletAuth = () => {
    const ctx = React.useContext(WalletAuthContext)
    if (!ctx) throw new Error("useWalletAuth must be used within WalletAuthProvider")
    return ctx
}

export { WalletAuthProvider, useWalletAuth }
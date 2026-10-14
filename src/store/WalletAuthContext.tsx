import * as React from "react"
import { isAxiosError } from "axios"
import { useAccount, useConnect, useDisconnect, useSignMessage, type Connector } from "wagmi"

import { loginWithSignature, requestMessage } from "../api/auth"
import { getErrorMessage } from "../utils/api"
import { getWalletErrorMessage } from "../utils/web3-errors"
import { useAuth } from "./AuthContext"
import { useToast } from "./ToastContext"

export type SiweStep = "idle" | "connecting" | "requesting" | "signing" | "authenticating" | "success" | "error"

interface WalletAuthContextValue {
    step: SiweStep
    /** Đang ở 1 trong các bước connecting -> authenticating */
    isBusy: boolean
    /** id connector đang chờ xác nhận trong ví */
    pendingConnectorId: string | undefined
    /** Toàn bộ flow: connect ví -> request message -> ký -> login */
    connectAndSignIn: (connector: Connector, onConnected?: () => void) => Promise<void>
    /** Chạy lại phần request -> ký -> login khi ví đã kết nối (retry sau lỗi) */
    signIn: () => Promise<void>
    /** Xoá phiên đăng nhập và ngắt kết nối ví */
    logout: () => void
}

const WalletAuthContext = React.createContext<WalletAuthContextValue | undefined>(undefined)

const toErrorMessage = (err: unknown) =>
    isAxiosError(err)
        ? getErrorMessage(err, "Authentication failed")
        : getWalletErrorMessage(err, "You rejected the request in MetaMask.")

const WalletAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { address, status } = useAccount()
    const { connectAsync } = useConnect()
    const { disconnect } = useDisconnect()
    const { signMessageAsync } = useSignMessage()
    const { isLogged, user, login, logout: clearSession } = useAuth()
    const { success, error: toastError } = useToast()

    const [step, setStep] = React.useState<SiweStep>("idle")
    const [pendingConnectorId, setPendingConnectorId] = React.useState<string | undefined>(undefined)

    /* Chặn chạy trùng flow (double click, StrictMode, bấm retry khi đang chạy) */
    const inFlight = React.useRef(false)

    const authenticate = React.useCallback(
        async (walletAddress: string) => {
            setStep("requesting")
            const message = await requestMessage({ walletAddress })

            setStep("signing")
            const signature = await signMessageAsync({ message })

            setStep("authenticating")
            const token = await loginWithSignature({ walletAddress, signature, message })

            login(token)
            setStep("success")
            success("Signed in successfully")
        },
        [signMessageAsync, login, success]
    )

    const connectAndSignIn = React.useCallback(
        async (connector: Connector, onConnected?: () => void) => {
            if (inFlight.current) return
            inFlight.current = true

            try {
                setStep("connecting")
                setPendingConnectorId(connector.id)
                const { accounts } = await connectAsync({ connector })

                setPendingConnectorId(undefined)
                onConnected?.()
                await authenticate(accounts[0])
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
            await authenticate(address)
        } catch (err) {
            setStep("error")
            toastError(toErrorMessage(err))
        } finally {
            inFlight.current = false
        }
    }, [address, authenticate, toastError])

    const logout = React.useCallback(() => {
        clearSession()
        disconnect()
        setStep("idle")
    }, [clearSession, disconnect])

    /* Ví ngắt kết nối (sau khi đã từng connected trong phiên này) -> xoá phiên đăng nhập.
       Dùng ref để không logout nhầm lúc wagmi đang khôi phục kết nối khi tải trang. */
    const wasConnected = React.useRef(false)
    React.useEffect(() => {
        if (status === "connected") {
            wasConnected.current = true
            return
        }
        if (status === "disconnected" && wasConnected.current) {
            wasConnected.current = false
            if (isLogged) clearSession()
        }
    }, [status, isLogged, clearSession])

    /* Đổi account trong MetaMask -> JWT không còn khớp với ví đang dùng */
    React.useEffect(() => {
        if (status !== "connected" || !address || !user) return
        if (address.toLowerCase() !== user.address.toLowerCase()) {
            clearSession()
            toastError("Wallet account changed. Please sign in again.")
        }
    }, [status, address, user, clearSession, toastError])

    /* Mọi đường logout (nút Logout, ngắt ví, token hết hạn) -> đưa flow về idle */
    React.useEffect(() => {
        if (!isLogged && step === "success") setStep("idle")
    }, [isLogged, step])

    const value = React.useMemo<WalletAuthContextValue>(
        () => ({
            step,
            isBusy: step === "connecting" || step === "requesting" || step === "signing" || step === "authenticating",
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
import * as React from "react"
import { useAccount } from "wagmi"

import { SEPOLIA_CHAIN_ID } from "../../config/network"
import { useSwitchToSepolia } from "../../hooks/useSwitchToSepolia"
import { useWalletConnection } from "../../hooks/useWalletConnection"
import { useWalletAuth, type SiweStep } from "../../store/WalletAuthContext"
import { Button, type ButtonProps } from "../ui/button"
import Icon from "../ui/icon"
import WalletConnectModal from "./WalletConnectModal"

const STEP_LABELS: Partial<Record<SiweStep, string>> = {
    connecting: "Connecting...",
    requesting: "Requesting Message...",
    signing: "Waiting for Signature...",
    authenticating: "Authenticating...",
}

export interface ConnectWalletButtonProps {
    label?: string
    size?: ButtonProps["size"]
    className?: string
}

/** Nút Connect + đăng nhập SIWE cho khu vực guest (chưa có JWT) */
const ConnectWalletButton = ({ label = "Connect Wallet", size, className }: ConnectWalletButtonProps) => {
    const { address, chainId, status } = useAccount()
    const { walletConnectors, isRestoring } = useWalletConnection()
    const { step, isBusy, pendingConnectorId, connectAndSignIn, signIn, logout } = useWalletAuth()
    const { switchToSepolia, isSwitching } = useSwitchToSepolia()
    const [modalOpen, setModalOpen] = React.useState(false)

    const isConnected = status === "connected" && !!address
    const isWrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID

    let content: React.ReactNode

    if (isBusy || isRestoring) {
        // Đang chạy 1 trong các bước: Connecting -> Requesting -> Signing -> Authenticating
        content = (
            <Button size={size} disabled loading className={className} title="Please follow the prompts in MetaMask">
                {STEP_LABELS[step] ?? "Connecting..."}
            </Button>
        )
    } else if (isWrongNetwork) {
        content = (
            <>
                <Button size={size} loading={isSwitching} onClick={switchToSepolia} className={className}>
                    Switch to Sepolia
                </Button>
                <DisconnectLink onClick={logout} />
            </>
        )
    } else if (isConnected) {
        // Ví đã kết nối nhưng chưa có JWT (từ chối ký / API lỗi) -> cho thử lại
        content = (
            <>
                <Button size={size} onClick={() => void signIn()} className={className}>
                    {step === "error" ? "Retry Sign In" : "Sign In"}
                </Button>
                <DisconnectLink onClick={logout} />
            </>
        )
    } else {
        content = (
            <Button size={size} onClick={() => setModalOpen(true)} className={className}>
                <Icon name="wallet" size="md" aria-hidden="true" />
                {label}
            </Button>
        )
    }

    return (
        <>
            <div className="flex flex-wrap items-center justify-center gap-3">{content}</div>

            <WalletConnectModal
                isOpen={modalOpen && !isConnected}
                onClose={() => setModalOpen(false)}
                connectors={walletConnectors}
                pendingConnectorId={pendingConnectorId}
                isPending={step === "connecting"}
                onSelect={(connector) => void connectAndSignIn(connector, () => setModalOpen(false))}
            />
        </>
    )
}

const DisconnectLink = ({ onClick }: { onClick: () => void }) => (
    <button
        type="button"
        onClick={onClick}
        className="text-xs underline underline-offset-2 opacity-80 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    >
        Disconnect
    </button>
)

export { ConnectWalletButton }
export default ConnectWalletButton
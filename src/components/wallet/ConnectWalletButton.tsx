import * as React from "react"
import type { ParseKeys } from "i18next"
import { useTranslation } from "react-i18next"
import { useAccount } from "wagmi"

import { SEPOLIA_CHAIN_ID } from "../../config/network"
import { useSwitchToSepolia } from "../../hooks/useSwitchToSepolia"
import { useWalletConnection } from "../../hooks/useWalletConnection"
import { useWalletAuth, type SiweStep } from "../../store/WalletAuthContext"
import { Button, type ButtonProps } from "../ui/button"
import Icon from "../ui/icon"
import WalletConnectModal from "./WalletConnectModal"

const STEP_LABEL_KEYS: Partial<Record<SiweStep, ParseKeys>> = {
    connecting: "wallet.steps.connecting",
    switching: "wallet.steps.switching",
    requesting: "wallet.steps.requesting",
    signing: "wallet.steps.signing",
    authenticating: "wallet.steps.authenticating",
}

export interface ConnectWalletButtonProps {
    /** Falls back to the localized "Connect Wallet" when omitted */
    label?: string
    size?: ButtonProps["size"]
    className?: string
    secondaryClassName?: string
}

/** Connect + SIWE sign-in button for the guest area (no JWT yet) */
const ConnectWalletButton = ({ label, size, className, secondaryClassName }: ConnectWalletButtonProps) => {
    const { t } = useTranslation()
    const { address, chainId, status } = useAccount()
    const { walletConnectors, isRestoring } = useWalletConnection()
    const { step, isBusy, pendingConnectorId, connectAndSignIn, signIn, logout } = useWalletAuth()
    const { switchToSepolia, isSwitching } = useSwitchToSepolia()
    const [modalOpen, setModalOpen] = React.useState(false)

    const isConnected = status === "connected" && !!address
    const isWrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID

    /* Escape hatch when the wallet is connected but not signed in: switch wallet or disconnect */
    const disconnectButton = (
        <Button type="button" variant="outline" size={size} onClick={logout} className={secondaryClassName}>
            {t("wallet.disconnect")}
        </Button>
    )

    const stepLabelKey = STEP_LABEL_KEYS[step]

    let content: React.ReactNode

    if (isBusy || isRestoring) {
        // One of: Connecting -> Switching -> Requesting -> Signing -> Authenticating
        content = (
            <Button size={size} disabled loading className={className} title={t("wallet.followPrompts")}>
                {t(stepLabelKey ?? "wallet.steps.connecting")}
            </Button>
        )
    } else if (isWrongNetwork) {
        content = (
            <>
                <Button size={size} loading={isSwitching} onClick={switchToSepolia} className={className}>
                    {isSwitching ? t("wallet.switchingNetwork") : t("wallet.switchToSepolia")}
                </Button>
                {disconnectButton}
            </>
        )
    } else if (isConnected) {
        // Wallet connected but no JWT yet (signature rejected / API error) -> allow retry
        content = (
            <>
                <Button size={size} onClick={() => void signIn()} className={className}>
                    {step === "error" ? t("wallet.retrySignIn") : t("wallet.signIn")}
                </Button>
                {disconnectButton}
            </>
        )
    } else {
        content = (
            <Button size={size} onClick={() => setModalOpen(true)} className={className}>
                <Icon name="wallet" size="md" aria-hidden="true" />
                {label ?? t("wallet.connectWallet")}
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

export { ConnectWalletButton }
export default ConnectWalletButton
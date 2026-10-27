import * as React from "react"
import { useTranslation } from "react-i18next"
import { useAccount } from "wagmi"

import { SEPOLIA_CHAIN_ID } from "../../config/network"
import { useCopy } from "../../hooks/useCopy"
import { useEthBalance } from "../../hooks/useEthBalance"
import { useSwitchToSepolia } from "../../hooks/useSwitchToSepolia"
import { useWalletConnection } from "../../hooks/useWalletConnection"
import cn from "../../utils/cn"
import { Button } from "../ui/button"
import { shortenAddress } from "../ui/copy-address"
import Icon from "../ui/icon"
import { Skeleton } from "../ui/skeleton"
import WalletConnectModal from "./WalletConnectModal"

const menuItemClass =
    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"

const WalletButton = () => {
    const { t } = useTranslation()
    const { chainId } = useAccount()
    const {
        address,
        isConnected,
        isBusy,
        isRestoring,
        walletConnectors,
        pendingConnectorId,
        isPending,
        connectWallet,
        disconnectWallet,
    } = useWalletConnection()
    const { switchToSepolia, isSwitching } = useSwitchToSepolia()
    const { formatted, isLoading: isBalanceLoading, isError: isBalanceError } = useEthBalance(address)
    const { copied, copy } = useCopy()

    const [modalOpen, setModalOpen] = React.useState(false)
    const [menuOpen, setMenuOpen] = React.useState(false)
    const rootRef = React.useRef<HTMLDivElement>(null)

    const isWrongNetwork = isConnected && chainId !== SEPOLIA_CHAIN_ID

    const open = menuOpen && isConnected

    React.useEffect(() => {
        if (!open) return

        const onPointerDown = (e: MouseEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setMenuOpen(false)
        }
        const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false)

        document.addEventListener("mousedown", onPointerDown)
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("mousedown", onPointerDown)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [open])

    const handleDisconnect = () => {
        setMenuOpen(false)
        disconnectWallet()
    }

    let trigger: React.ReactNode

    if (isRestoring || (isBusy && !isConnected && !modalOpen)) {
        // Restoring a previous connection on page load / connecting
        trigger = (
            <Button
                disabled
                loading
                className="h-9 rounded-full bg-teal-600 px-4 text-white hover:bg-teal-700"
            >
                {t("wallet.connecting")}
            </Button>
        )
    } else if (!isConnected || !address) {
        trigger = (
            <Button
                onClick={() => setModalOpen(true)}
                className="h-9 rounded-full bg-teal-600 px-4 text-white hover:bg-teal-700"
            >
                <Icon name="wallet" size="md" aria-hidden="true" />
                <span className="hidden sm:inline">{t("wallet.connectWallet")}</span>
                <span className="sm:hidden">{t("wallet.connect")}</span>
            </Button>
        )
    } else {
        trigger = (
            <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label={t("wallet.walletMenu")}
                className={cn(
                    "flex h-9 items-center gap-2 rounded-full border px-3 text-xs font-medium transition-colors",
                    "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                    isWrongNetwork
                        ? "border-amber-400 bg-amber-50 text-amber-700 hover:bg-amber-100 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300 dark:hover:bg-amber-950/60"
                        : "border-border bg-background hover:bg-accent",
                    open && !isWrongNetwork && "bg-accent"
                )}
            >
                {isWrongNetwork ? (
                    <>
                        <Icon name="alert" size="md" aria-hidden="true" />
                        <span>{t("wallet.wrongNetwork")}</span>
                    </>
                ) : (
                    <>
                        <span aria-hidden="true" className="size-2 shrink-0 rounded-full bg-teal-600" />
                        <span title={address}>{shortenAddress(address, 5, 4)}</span>
                        {formatted && (
                            <span className="hidden border-l border-border pl-2 text-muted-foreground md:inline">
                                {formatted}
                            </span>
                        )}
                    </>
                )}
                <Icon
                    name="chevron-down"
                    size="sm"
                    aria-hidden="true"
                    className={cn("transition-transform", open && "rotate-180")}
                />
            </button>
        )
    }

    return (
        <div ref={rootRef} className="relative">
            {trigger}

            {open && address && (
                <div
                    role="menu"
                    className="fixed inset-x-4 top-[4.25rem] z-40 rounded-lg border border-border bg-background p-2 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150 sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-72"
                >
                    <div className="px-2 pb-2 pt-1">
                        <p className="text-[11px] text-muted-foreground">{t("wallet.connectedWallet")}</p>
                        <p className="mt-0.5 break-all font-mono text-xs" title={address}>
                            {shortenAddress(address, 5, 4)}
                        </p>
                    </div>

                    {isWrongNetwork ? (
                        <div
                            role="alert"
                            className="mb-2 flex flex-col gap-2 rounded-md border border-amber-300 bg-amber-50 p-3 text-xs text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                        >
                            <p>{t("wallet.wrongNetworkNotice")}</p>
                            <Button
                                size="sm"
                                loading={isSwitching}
                                onClick={switchToSepolia}
                                className="w-full rounded-full bg-teal-600 text-white hover:bg-teal-700"
                            >
                                {isSwitching ? t("wallet.switchingNetwork") : t("wallet.switchToSepolia")}
                            </Button>
                        </div>
                    ) : (
                        <div className="mb-2 rounded-md bg-muted/60 p-3">
                            <p className="text-[11px] text-muted-foreground">{t("wallet.ethBalance")}</p>
                            {isBalanceLoading ? (
                                <Skeleton className="mt-1.5 h-5 w-28" />
                            ) : isBalanceError ? (
                                <p className="mt-1 text-xs text-destructive">{t("wallet.balanceError")}</p>
                            ) : (
                                <p className="mt-1 text-base font-semibold tabular-nums">{formatted ?? "0 ETH"}</p>
                            )}
                        </div>
                    )}

                    <button type="button" role="menuitem" onClick={() => copy(address)} className={menuItemClass}>
                        <Icon
                            name={copied ? "check" : "copy"}
                            size="md"
                            aria-hidden="true"
                            className={copied ? "text-teal-600" : undefined}
                        />
                        {copied ? t("wallet.copied") : t("wallet.copyAddress")}
                    </button>
                    <button type="button" role="menuitem" onClick={handleDisconnect} className={menuItemClass}>
                        <Icon name="logout" size="md" aria-hidden="true" />
                        {t("wallet.disconnect")}
                    </button>
                </div>
            )}

            <WalletConnectModal
                isOpen={modalOpen && !isConnected}
                onClose={() => setModalOpen(false)}
                connectors={walletConnectors}
                pendingConnectorId={pendingConnectorId}
                isPending={isPending}
                onSelect={(connector) => connectWallet(connector, () => setModalOpen(false))}
            />
        </div>
    )
}

export { WalletButton }
export default WalletButton
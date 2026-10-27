import { useTranslation } from "react-i18next"
import type { Connector } from "wagmi"

import cn from "../../utils/cn"
import { Dialog } from "../ui/dialog"
import Icon from "../ui/icon"
import { Loading } from "../ui/loading"

export interface WalletConnectModalProps {
    isOpen: boolean
    onClose: () => void
    connectors: readonly Connector[]
    /** Id of the connector waiting for confirmation in the wallet */
    pendingConnectorId?: string
    isPending: boolean
    onSelect: (connector: Connector) => void
}

const WalletConnectModal = ({
    isOpen,
    onClose,
    connectors,
    pendingConnectorId,
    isPending,
    onSelect,
}: WalletConnectModalProps) => {
    const { t } = useTranslation()

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={t("wallet.modal.title")}>
            <div className="flex flex-col gap-3">
                <p className="text-center text-xs text-muted-foreground">{t("wallet.modal.choose")}</p>

                <ul className="flex flex-col gap-2">
                    {connectors.map((connector) => {
                        const loading = isPending && pendingConnectorId === connector.id
                        return (
                            <li key={connector.uid}>
                                <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => onSelect(connector)}
                                    className={cn(
                                        "flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left text-sm font-medium transition-colors",
                                        "hover:border-teal-600/60 hover:bg-teal-50/40",
                                        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                                        "disabled:cursor-not-allowed disabled:opacity-60"
                                    )}
                                >
                                    {connector.icon ? (
                                        <img src={connector.icon} alt="" className="size-7 shrink-0 rounded-md" />
                                    ) : (
                                        <span className="flex size-7 shrink-0 items-center justify-center rounded-md bg-teal-100 text-teal-700 dark:text-teal-300">
                                            <Icon name="wallet" size="md" />
                                        </span>
                                    )}
                                    <span className="flex-1">{connector.name}</span>
                                    {loading && (
                                        <span className="flex items-center gap-1.5 text-xs font-normal text-muted-foreground">
                                            <Loading size="sm" className="text-teal-600" />
                                            {t("wallet.modal.waiting")}
                                        </span>
                                    )}
                                </button>
                            </li>
                        )
                    })}
                </ul>

                {isPending && (
                    <p role="status" className="text-center text-xs text-muted-foreground">
                        {t("wallet.modal.openMetaMask")}
                    </p>
                )}

                <p className="text-center text-xs text-muted-foreground">
                    {t("wallet.modal.noWallet")}{" "}
                    <a
                        href="https://metamask.io/download/"
                        target="_blank"
                        rel="noreferrer"
                        className="font-medium text-teal-600 underline underline-offset-2 hover:text-teal-700"
                    >
                        {t("wallet.modal.install")}
                    </a>
                </p>
            </div>
        </Dialog>
    )
}

export { WalletConnectModal }
export default WalletConnectModal
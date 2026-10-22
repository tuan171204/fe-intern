import * as React from "react"
import { useTranslation } from "react-i18next"
import { formatEther } from "viem"

import { getTokenByAddress } from "../../../api/token"
import { Avatar } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { CopyAddress } from "../../../components/ui/copy-address"
import { Dialog } from "../../../components/ui/dialog"
import Icon, { type IconName } from "../../../components/ui/icon"
import { Skeleton } from "../../../components/ui/skeleton"
import { TOKEN_DECIMALS } from "../../../constants/contract"
import type { Token } from "../../../types/tokens"
import { getErrorMessage, getImageUrl } from "../../../utils/api"
import { toBigInt } from "../../../utils/token-math"
import { formatTokenAmount } from "../../../utils/web3-format"

export interface TokenDetailModalProps {
    /** Contract address of the token being viewed; null = popup closed */
    tokenAddress: string | null
    onClose: () => void
}

/* Brand labels are not translated; only "website" is localized at render time */
const LINKS: { key: "websiteUrl" | "telegramUrl" | "discordUrl" | "xUrl"; label: string; icon: IconName }[] = [
    { key: "websiteUrl", label: "Website", icon: "globe" },
    { key: "telegramUrl", label: "Telegram", icon: "telegram" },
    { key: "discordUrl", label: "Discord", icon: "discord" },
    { key: "xUrl", label: "X", icon: "x-twitter" },
]

const toHref = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`)

const TokenDetail = ({ token }: { token: Token }) => {
    const { t } = useTranslation()
    const links = LINKS.filter(({ key }) => !!token[key])

    const stats = [
        { label: t("tokenDetail.maxSupply"), value: formatTokenAmount(toBigInt(token.maxSupply), TOKEN_DECIMALS, 4) },
        {
            label: t("tokenDetail.amountPerMint"),
            value: formatTokenAmount(toBigInt(token.amountPerMint), TOKEN_DECIMALS, 4),
        },
        { label: t("tokenDetail.mintFee"), value: `${formatEther(toBigInt(token.mintFee))} ETH` },
    ]

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
                <Avatar src={getImageUrl(token.image)} fallback={token.name} alt={token.name} size="lg" className="size-12" />
                <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate">
                        <span className="text-base font-semibold">{token.name}</span>{" "}
                        <span className="text-sm text-muted-foreground">{token.symbol}</span>
                    </p>
                    <CopyAddress address={token.tokenAddress} head={8} tail={6} className="text-xs text-foreground" />
                </div>
            </div>

            <dl className="grid grid-cols-3 gap-2 text-center">
                {stats.map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-muted/60 p-2">
                        <dt className="text-[10px] text-muted-foreground">{label}</dt>
                        <dd className="mt-0.5 truncate text-sm font-semibold" title={value}>
                            {value}
                        </dd>
                    </div>
                ))}
            </dl>

            <div>
                <h3 className="text-xs font-medium">{t("tokenDetail.description")}</h3>
                <p className="mt-1 whitespace-pre-line break-words text-xs text-muted-foreground">
                    {token.description || t("common.none")}
                </p>
            </div>

            {links.length > 0 && (
                <ul className="flex items-center gap-3 text-muted-foreground">
                    {links.map(({ key, label, icon }) => (
                        <li key={key}>
                            <a
                                href={toHref(token[key] as string)}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={key === "websiteUrl" ? t("tokenDetail.website") : label}
                                className="transition-colors hover:text-teal-600"
                            >
                                <Icon name={icon} size="md" />
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

const DetailSkeleton = () => (
    <div aria-busy="true" className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
            </div>
        </div>
        <div className="grid grid-cols-3 gap-2">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
        </div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-12 w-full" />
    </div>
)

const TokenDetailModal = ({ tokenAddress, onClose }: TokenDetailModalProps) => {
    const { t } = useTranslation()
    const [token, setToken] = React.useState<Token | null>(null)
    const [loading, setLoading] = React.useState(false)
    const [loadError, setLoadError] = React.useState<string | null>(null)
    const [reloadKey, setReloadKey] = React.useState(0)

    /* Each time the popup opens (or on retry): load the token detail by contract address */
    React.useEffect(() => {
        setToken(null)
        setLoadError(null)

        if (!tokenAddress) {
            setLoading(false)
            return
        }

        let cancelled = false
        setLoading(true)

        getTokenByAddress(tokenAddress)
            .then((res) => {
                if (!cancelled) setToken(res.data)
            })
            .catch((err: unknown) => {
                if (!cancelled) setLoadError(getErrorMessage(err, t("errors.loadTokenDetail")))
            })
            .finally(() => {
                if (!cancelled) setLoading(false)
            })

        return () => {
            cancelled = true
        }
    }, [tokenAddress, reloadKey, t])

    const renderBody = () => {
        if (loading) return <DetailSkeleton />

        if (loadError) {
            return (
                <div className="flex flex-col items-center gap-3 py-4 text-center">
                    <p className="text-sm text-destructive">{loadError}</p>
                    <Button variant="outline" size="sm" onClick={() => setReloadKey((k) => k + 1)}>
                        {t("common.retry")}
                    </Button>
                </div>
            )
        }

        return token ? <TokenDetail token={token} /> : null
    }

    return (
        <Dialog
            isOpen={!!tokenAddress}
            onClose={onClose}
            title={token ? t("tokenDetail.titleNamed", { name: token.name }) : t("tokenDetail.title")}
            className="max-h-[90svh] overflow-y-auto"
        >
            {renderBody()}
        </Dialog>
    )
}

export default TokenDetailModal
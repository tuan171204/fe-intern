import * as React from "react"
import { useTranslation } from "react-i18next"
import { Link, useLocation, useNavigate } from "react-router-dom"
import type { Address } from "viem"

import { useEthBalance } from "../../hooks/useEthBalance"
import { useAuth } from "../../store/AuthContext"
import { useWalletAuth } from "../../store/WalletAuthContext"
import cn from "../../utils/cn"
import { getPageTitleKey } from "../left-menu/nav-config"
import { shortenAddress } from "../ui/copy-address"
import Icon from "../ui/icon"
import { LanguageSwitcher } from "../ui/language-switcher"
import { ThemeToggle } from "../ui/theme-toggle"
import WalletButton from "../wallet/WalletButton"

export interface DashboardHeaderProps {
    onMenuClick: () => void
    address?: string
    balance?: string
}

const DEMO_ADDRESS = "0x4aq1234567890abcdefgfr6j5lda"

const menuItemClass = (active: boolean) =>
    cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors focus-visible:bg-accent focus-visible:outline-none",
        active ? "bg-teal-50 font-medium text-teal-600" : "hover:bg-accent"
    )

const DashboardHeader = ({ onMenuClick, address: addressProp, balance: balanceProp }: DashboardHeaderProps) => {
    const { t } = useTranslation()
    const { pathname } = useLocation()
    const navigate = useNavigate()
    const { user } = useAuth()
    /* Logout = clear the JWT + disconnect the wallet */
    const { logout } = useWalletAuth()
    const address = addressProp ?? user?.address ?? DEMO_ADDRESS

    /* Real Sepolia ETH balance of the signed-in wallet (shares its cache with WalletButton) */
    const { formatted: ethBalance } = useEthBalance(user?.address as Address | undefined)
    const balance = balanceProp ?? ethBalance ?? "-"

    const [menuOpen, setMenuOpen] = React.useState(false)
    const menuRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!menuOpen) return

        const onPointerDown = (e: MouseEvent) => {
            if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
        }
        const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false)

        document.addEventListener("mousedown", onPointerDown)
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("mousedown", onPointerDown)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [menuOpen])

    const handleLogout = () => {
        logout()
        setMenuOpen(false)
        navigate("/")
    }

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label={t("nav.openMenu")}
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:hidden"
                >
                    <Icon name="menu" size="lg" />
                </button>
                <p className="truncate text-lg font-semibold">{t(getPageTitleKey(pathname))}</p>
            </div>

            <div className="flex shrink-0 items-center gap-2">
                {/* On small screens the language switcher lives inside the account menu */}
                <LanguageSwitcher className="hidden sm:inline-flex" />
                <ThemeToggle />
                <WalletButton />

                <div ref={menuRef} className="relative">
                    <button
                        type="button"
                        onClick={() => setMenuOpen((v) => !v)}
                        aria-haspopup="menu"
                        aria-expanded={menuOpen}
                        aria-label={t("nav.accountMenu")}
                        className={cn(
                            "flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                            menuOpen && "bg-accent"
                        )}
                    >
                        <span aria-hidden="true" className="size-8 shrink-0 rounded-full bg-teal-600" />
                        <span className="hidden flex-col text-left leading-tight sm:flex">
                            <span className="text-[11px] text-foreground" title={address}>
                                {shortenAddress(address, 5, 9)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{balance}</span>
                        </span>
                        <Icon
                            name="chevron-down"
                            size="md"
                            aria-hidden="true"
                            className={cn("text-muted-foreground transition-transform", menuOpen && "rotate-180")}
                        />
                    </button>

                    {menuOpen && (
                        <ul
                            role="menu"
                            className="absolute right-0 top-full z-40 mt-2 w-44 rounded-lg border border-border bg-background p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150"
                        >
                            <li role="none" className="px-3 py-2 sm:hidden">
                                <LanguageSwitcher />
                            </li>
                            <li role="none">
                                <Link
                                    role="menuitem"
                                    to="/profile"
                                    aria-current={pathname === "/profile" ? "page" : undefined}
                                    onClick={() => setMenuOpen(false)}
                                    className={menuItemClass(pathname === "/profile")}
                                >
                                    <Icon name="user" size="md" aria-hidden="true" />
                                    {t("nav.profile")}
                                </Link>
                            </li>
                            <li role="none">
                                <button
                                    type="button"
                                    role="menuitem"
                                    onClick={handleLogout}
                                    className={cn(menuItemClass(false), "w-full text-left")}
                                >
                                    <Icon name="logout" size="md" aria-hidden="true" />
                                    {t("nav.logOut")}
                                </button>
                            </li>
                        </ul>
                    )}
                </div>
            </div>
        </header>
    )
}

export { DashboardHeader }
export default DashboardHeader
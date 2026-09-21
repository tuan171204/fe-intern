import * as React from "react"
import { ChevronDown, LogOut, Menu, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import cn from "../../utils/cn"
import { getPageTitle } from "../left-menu/nav-config"
import { shortenAddress } from "../ui/copy-address"

export interface DashboardHeaderProps {
    onMenuClick: () => void
    address?: string
    balance?: string
}

// Dữ liệu tĩnh mẫu -> "0x4aq...gfr6j5lda"
const DEMO_ADDRESS = "0x4aq1234567890abcdefgfr6j5lda"

const menuItemClass = (active: boolean) =>
    cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors focus-visible:bg-accent focus-visible:outline-none",
        active ? "bg-teal-50 font-medium text-teal-600" : "hover:bg-accent"
    )

const DashboardHeader = ({ onMenuClick, address = DEMO_ADDRESS, balance = "200 ZKN" }: DashboardHeaderProps) => {
    const { pathname } = useLocation()
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

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-3 border-b border-border bg-background px-4 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label="Open menu"
                    className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring lg:hidden"
                >
                    <Menu className="size-5" />
                </button>
                <p className="truncate text-lg font-semibold">{getPageTitle(pathname)}</p>
            </div>

            <div ref={menuRef} className="relative">
                <button
                    type="button"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    aria-label="Account menu"
                    className={cn(
                        "flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                        menuOpen && "bg-accent"
                    )}
                >
                    <span aria-hidden="true" className="size-8 shrink-0 rounded-full bg-teal-600" />
                    {/* Ẩn địa chỉ + số dư ở mobile, chỉ giữ avatar */}
                    <span className="hidden flex-col text-left leading-tight sm:flex">
                        <span className="text-[11px] text-foreground" title={address}>
                            {shortenAddress(address, 5, 9)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{balance}</span>
                    </span>
                    <ChevronDown
                        aria-hidden="true"
                        className={cn("size-4 text-muted-foreground transition-transform", menuOpen && "rotate-180")}
                    />
                </button>

                {menuOpen && (
                    <ul
                        role="menu"
                        className="absolute right-0 top-full z-40 mt-2 w-44 rounded-lg border border-border bg-background p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150"
                    >
                        <li role="none">
                            <Link
                                role="menuitem"
                                to="/profile"
                                aria-current={pathname === "/profile" ? "page" : undefined}
                                onClick={() => setMenuOpen(false)}
                                className={menuItemClass(pathname === "/profile")}
                            >
                                <User className="size-4" aria-hidden="true" />
                                Profile
                            </Link>
                        </li>
                        <li role="none">
                            {/* Giả lập đăng xuất: quay về trang chủ chưa đăng nhập */}
                            <Link role="menuitem" to="/" onClick={() => setMenuOpen(false)} className={menuItemClass(false)}>
                                <LogOut className="size-4" aria-hidden="true" />
                                Log out
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </header >
    )
}

export { DashboardHeader }
export default DashboardHeader
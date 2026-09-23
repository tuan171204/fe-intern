import * as React from "react"
import { ChevronDown, X } from "lucide-react"
import { Link, NavLink, useLocation } from "react-router-dom"

import cn from "../../utils/cn"
import { TelegramIcon, XIcon } from "../footer"
import { NAV_ITEMS, type NavItem } from "./nav-config"

export interface SidebarProps {
    isOpen: boolean
    onClose: () => void
}

const focusRing = "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"

const linkClass = ({ isActive }: { isActive: boolean }) =>
    cn(
        "flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors",
        focusRing,
        isActive ? "bg-teal-600 font-medium text-white" : "text-foreground/80 hover:bg-accent hover:text-foreground"
    )

const SOCIALS = [
    { label: "Twitter / X", href: "https://x.com", Icon: XIcon },
    { label: "Telegram", href: "https://t.me", Icon: TelegramIcon },
]

const NavGroup = ({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) => {
    const { pathname } = useLocation()
    const hasActiveChild = !!item.children?.some((child) => child.to === pathname)
    const [open, setOpen] = React.useState(hasActiveChild)
    const Icon = item.icon

    React.useEffect(() => {
        if (hasActiveChild) setOpen(true)
    }, [hasActiveChild])

    /* Thu gọn nhóm đang chứa trang hiện tại -> cha thay child mang trạng thái active */
    const parentActive = hasActiveChild && !open

    return (
        <div>
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                className={cn(
                    "flex w-full items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors",
                    focusRing,
                    parentActive ? "bg-teal-600 font-medium text-white" : "text-foreground hover:bg-accent"
                )}
            >
                <Icon className="size-4" aria-hidden="true" />
                {item.label}
                <ChevronDown
                    aria-hidden="true"
                    className={cn(
                        "ml-auto size-3.5 transition-transform",
                        parentActive ? "text-white/80" : "text-muted-foreground",
                        open && "rotate-180"
                    )}
                />
            </button>

            {open && (
                <ul className="ml-5 mt-1 flex flex-col gap-1 border-l border-border pl-3">
                    {item.children?.map((child) => (
                        <li key={child.to}>
                            <NavLink to={child.to} onClick={onNavigate} className={linkClass}>
                                {child.label}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

const SidebarPanel = ({ onNavigate, onClose }: { onNavigate?: () => void; onClose?: () => void }) => (
    <div className="flex h-full flex-col">
        <div className="relative flex h-16 shrink-0 items-center justify-center border-b border-border">
            <Link to="/" className="text-lg font-bold text-teal-600">
                ACW3
            </Link>
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close menu"
                    className={cn(
                        "absolute right-3 rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground",
                        focusRing
                    )}
                >
                    <X className="size-5" />
                </button>
            )}
        </div>

        <nav aria-label="Main navigation" className="flex-1 overflow-y-auto p-4">
            <ul className="flex flex-col gap-1">
                {NAV_ITEMS.map((item) => (
                    <li key={item.label}>
                        {item.to ? (
                            <NavLink to={item.to} onClick={onNavigate} className={linkClass}>
                                <item.icon className="size-4" aria-hidden="true" />
                                {item.label}
                            </NavLink>
                        ) : (
                            <NavGroup item={item} onNavigate={onNavigate} />
                        )}
                    </li>
                ))}
            </ul>
        </nav>

        <ul className="flex shrink-0 flex-col gap-1 border-t border-border p-4">
            {SOCIALS.map(({ label, href, Icon }) => (
                <li key={label}>
                    <a
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        className={cn(
                            "flex items-center gap-2 rounded-full px-3 py-2 text-xs text-foreground/80 transition-colors hover:bg-accent hover:text-foreground",
                            focusRing
                        )}
                    >
                        <Icon className="size-4" />
                        {label}
                    </a>
                </li>
            ))}
        </ul>
    </div >
)

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    React.useEffect(() => {
        if (!isOpen) return
        const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose()
        document.addEventListener("keydown", onKeyDown)
        return () => document.removeEventListener("keydown", onKeyDown)
    }, [isOpen, onClose])

    return (
        <>
            {/* Desktop (lg+): cố định bên trái. Mobile/tablet: ẩn, dùng drawer bên dưới */}
            <aside className="hidden w-60 shrink-0 border-r border-border bg-background lg:block">
                <div className="sticky top-0 h-svh">
                    <SidebarPanel />
                </div>
            </aside>

            {isOpen && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div
                        aria-hidden="true"
                        onClick={onClose}
                        className="absolute inset-0 bg-black/30 animate-in fade-in-0 duration-200"
                    />
                    <aside
                        role="dialog"
                        aria-modal="true"
                        aria-label="Menu"
                        className="absolute inset-y-0 left-0 w-64 bg-background shadow-xl animate-in slide-in-from-left duration-200"
                    >
                        <SidebarPanel onNavigate={onClose} onClose={onClose} />
                    </aside>
                </div>
            )}
        </>
    )
}

export { Sidebar }
export default Sidebar
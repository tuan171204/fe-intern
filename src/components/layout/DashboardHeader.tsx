import { ChevronDown, Menu } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import { getPageTitle } from "../sidebar/nav-config"
import { shortenAddress } from "../ui/copy-address"

export interface DashboardHeaderProps {
    onMenuClick: () => void
    address?: string
    balance?: string
}

// Dữ liệu tĩnh mẫu -> "0x4aq...gfr6j5lda"
const DEMO_ADDRESS = "0x4aq1234567890abcdefgfr6j5lda"

const DashboardHeader = ({ onMenuClick, address = DEMO_ADDRESS, balance = "200 ZKN" }: DashboardHeaderProps) => {
    const { pathname } = useLocation()

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

            <Link
                to="/profile"
                aria-label="Open profile"
                className="flex items-center gap-2 rounded-full p-1 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
                <span aria-hidden="true" className="size-8 shrink-0 rounded-full bg-teal-600" />
                {/* Ẩn địa chỉ + số dư ở mobile, chỉ giữ avatar */}
                <span className="hidden flex-col leading-tight sm:flex">
                    <span className="text-[11px] text-foreground" title={address}>
                        {shortenAddress(address, 5, 9)}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{balance}</span>
                </span>
                <ChevronDown aria-hidden="true" className="size-4 text-muted-foreground" />
            </Link>
        </header>
    )
}

export { DashboardHeader }
export default DashboardHeader
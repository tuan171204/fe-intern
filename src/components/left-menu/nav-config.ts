import { Coins, Hexagon, Home, type LucideIcon } from "lucide-react"

export interface NavChild {
    label: string
    to: string
    title?: string
}

export interface NavItem {
    label: string
    icon: LucideIcon
    to?: string
    children?: NavChild[]
}

export const NAV_ITEMS: NavItem[] = [
    { label: "Dashboard", icon: Home, to: "/dashboard" },
    {
        label: "Token",
        icon: Coins,
        children: [
            { label: "Token Creator", to: "/token/create" },
            { label: "Token List", to: "/token/list" },
        ],
    },
    {
        label: "NFT",
        icon: Hexagon,
        children: [
            { label: "NFT Collection", to: "/nft/create", title: "NFT Creator" },
            { label: "NFT List", to: "/nft/list" },
        ],
    },
]

// Các trang không nằm trong sidebar nhưng vẫn cần tiêu đề ở header
const EXTRA_TITLES: Record<string, string> = {
    "/profile": "Profile",
    "/leaderboard": "Leaderboard",
}

export const getPageTitle = (pathname: string) => {
    for (const item of NAV_ITEMS) {
        if (item.to === pathname) return item.label
        const child = item.children?.find((c) => c.to === pathname)
        if (child) return child.title ?? child.label
    }
    return EXTRA_TITLES[pathname] ?? "ACW3"
}
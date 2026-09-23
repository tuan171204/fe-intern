import type { IconName } from "../ui/icon"

export interface NavChild {
    label: string
    to: string
    title?: string
}

export interface NavItem {
    label: string
    icon: IconName
    to?: string
    children?: NavChild[]
}

export const NAV_ITEMS: NavItem[] = [
    { label: "Dashboard", icon: "home", to: "/dashboard" },
    {
        label: "Token",
        icon: "coins",
        children: [
            { label: "Token Creator", to: "/token/create" },
            { label: "Token List", to: "/token/list" },
        ],
    },
    {
        label: "NFT",
        icon: "hexagon",
        children: [
            { label: "NFT Collection", to: "/nft/create", title: "NFT Creator" },
            { label: "NFT List", to: "/nft/list" },
        ],
    },
]

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
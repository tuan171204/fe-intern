import type { ParseKeys } from "i18next"

import type { IconName } from "../ui/icon"

export interface NavChild {
    /** i18n key of the menu label */
    labelKey: ParseKeys
    to: string
    /** i18n key of the page title when it differs from the label */
    titleKey?: ParseKeys
}

export interface NavItem {
    labelKey: ParseKeys
    icon: IconName
    to?: string
    children?: NavChild[]
}

export const NAV_ITEMS: NavItem[] = [
    { labelKey: "nav.dashboard", icon: "home", to: "/dashboard" },
    {
        labelKey: "nav.token",
        icon: "coins",
        children: [
            { labelKey: "nav.tokenCreator", to: "/token/create" },
            { labelKey: "nav.tokenList", to: "/token/list" },
        ],
    },
    {
        labelKey: "nav.nft",
        icon: "hexagon",
        children: [
            { labelKey: "nav.nftCollection", to: "/nft/create", titleKey: "nav.nftCreator" },
            { labelKey: "nav.nftList", to: "/nft/list" },
        ],
    },
]

const EXTRA_TITLE_KEYS: Record<string, ParseKeys> = {
    "/profile": "nav.profile",
    "/leaderboard": "nav.leaderboard",
}

/** Returns the i18n key of the page title; translate it at render time with t() */
export const getPageTitleKey = (pathname: string): ParseKeys => {
    for (const item of NAV_ITEMS) {
        if (item.to === pathname) return item.labelKey
        const child = item.children?.find((c) => c.to === pathname)
        if (child) return child.titleKey ?? child.labelKey
    }
    return EXTRA_TITLE_KEYS[pathname] ?? "nav.appName"
}
import * as React from "react"
import { useTranslation } from "react-i18next"

import { Tabs, type TabOption } from "../../../components/ui/tabs"
import NftsTable from "./NftsTable"
import TokensTable, { type TokensTableProps } from "./TokensTable"

type AssetTab = "tokens" | "nfts"

export interface ProfileAssetsProps {
    tokensTable: TokensTableProps
}

const ProfileAssets = ({ tokensTable }: ProfileAssetsProps) => {
    const { t } = useTranslation()
    const [tab, setTab] = React.useState<AssetTab>("tokens")

    const tabs: TabOption<AssetTab>[] = [
        { value: "tokens", label: t("profile.tabs.tokens") },
        { value: "nfts", label: t("profile.tabs.nfts") },
    ]

    return (
        <section aria-label={t("profile.assets")} className="flex flex-col gap-2 rounded-lg bg-background p-4">
            <Tabs options={tabs} value={tab} onChange={setTab} variant="subtle" className="self-start" />
            <div role="tabpanel">{tab === "tokens" ? <TokensTable {...tokensTable} /> : <NftsTable />}</div>
        </section>
    )
}

export default ProfileAssets
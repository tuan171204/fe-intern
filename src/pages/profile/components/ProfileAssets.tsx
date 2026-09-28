// File: src/pages/profile/components/ProfileAssets.tsx
import * as React from "react"

import { Tabs, type TabOption } from "../../../components/ui/tabs"
import NftsTable from "./NftsTable"
import TokensTable, { type TokensTableProps } from "./TokensTable"

type AssetTab = "tokens" | "nfts"

const TABS: TabOption<AssetTab>[] = [
    { value: "tokens", label: "Tokens" },
    { value: "nfts", label: "NFTs" },
]

export interface ProfileAssetsProps {
    tokensTable: TokensTableProps
}

const ProfileAssets = ({ tokensTable }: ProfileAssetsProps) => {
    const [tab, setTab] = React.useState<AssetTab>("tokens")

    return (
        <section aria-label="Assets" className="flex flex-col gap-2 rounded-lg bg-background p-4">
            <Tabs options={TABS} value={tab} onChange={setTab} variant="subtle" className="self-start" />
            <div role="tabpanel">{tab === "tokens" ? <TokensTable {...tokensTable} /> : <NftsTable />}</div>
        </section>
    )
}

export default ProfileAssets
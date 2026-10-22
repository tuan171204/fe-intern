import * as React from "react"
import { useTranslation } from "react-i18next"

import { NFT_LIST, type NftItem } from "../../mocks/nfts"
import MintNftModal from "./components/MintNftModal"
import NftListHeader from "./components/NftListHeader"
import NftRow from "./components/NftRow"

const NftList = () => {
    const { t } = useTranslation()
    const [mintingNft, setMintingNft] = React.useState<NftItem | null>(null)

    return (
        <>
            <div role="table" aria-label={t("nftList.tableLabel")} className="flex w-full flex-col gap-2.5">
                <NftListHeader />
                <div role="rowgroup" className="divide-y divide-border/60 overflow-hidden rounded-lg bg-background">
                    {NFT_LIST.map((nft) => (
                        <NftRow key={nft.id} nft={nft} onMint={setMintingNft} />
                    ))}
                </div>
            </div>

            <MintNftModal nft={mintingNft} onClose={() => setMintingNft(null)} />
        </>
    )
}

export default NftList
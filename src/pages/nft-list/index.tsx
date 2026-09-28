import * as React from "react"

import { NFT_LIST, type NftItem } from "../../mocks/nfts"
import MintNftModal from "./components/MintNftModal"
import NftListHeader from "./components/NftListHeader"
import NftRow from "./components/NftRow"

const NftList = () => {
    const [mintingNft, setMintingNft] = React.useState<NftItem | null>(null)

    return (
        <>
            <div role="table" aria-label="NFT list" className="flex w-full flex-col gap-2.5">
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
export interface ProfileNft {
    id: string
    name: string
    address: string
    avatar?: string
    supplyPercent: number
    totalSupply: number
}

const ADDRESS = "0x4eb697d3c1a85e9f20b7c64d81e3a5f7b9c2A0fB2A"

const nft = { address: ADDRESS, supplyPercent: 100, totalSupply: 200 }

export const PROFILE_NFTS: ProfileNft[] = [
    { ...nft, id: "1", name: "Tropolis Club" },
    { ...nft, id: "2", name: "Lil Pudgy" },
    { ...nft, id: "3", name: "Goodman" },
]
export interface NftItem {
    id: string
    name: string
    address: string
    avatar?: string
    supplyPercent: number
    mintProgress: number
    mintFee: string
}

const ADDRESS = "0x4eb697d3c1a85e9f20b7c64d81e3a5f7b9c2A0fB2A"

const base = { address: ADDRESS, supplyPercent: 100, mintProgress: 100, mintFee: "0.012" }

export const NFT_LIST: NftItem[] = [
    { ...base, id: "1", name: "Tropolis Club" },
    { ...base, id: "2", name: "Lil Pudgy" },
    { ...base, id: "3", name: "Goodman" },
]
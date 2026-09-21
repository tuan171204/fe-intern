export const PROFILE = {
    name: "John",
    address: "0x4aq1234567890abcdefgfr6j5lda",
    balance: "200 ZKN",
    biography: "None",
    level: "2/2",
    totalTokens: 0,
    totalNfts: 0,
}

export interface ProfileToken {
    id: string
    name: string
    symbol: string
    address: string
    avatar?: string
    balance: number
    supplyPercent: number
    totalSupply: number
}

export interface ProfileNft {
    id: string
    name: string
    address: string
    avatar?: string
    supplyPercent: number
    totalSupply: number
}

const ADDRESS = "0x4eb697d3c1a85e9f20b7c64d81e3a5f7b9c2A0fB2A"

const token = { name: "Goodman", symbol: "GM", address: ADDRESS, balance: 200, supplyPercent: 100, totalSupply: 200 }
const nft = { address: ADDRESS, supplyPercent: 100, totalSupply: 200 }

export const PROFILE_TOKENS: ProfileToken[] = [
    { ...token, id: "1" },
    { ...token, id: "2" },
    { ...token, id: "3" },
    { ...token, id: "4" },
]

export const PROFILE_NFTS: ProfileNft[] = [
    { ...nft, id: "1", name: "Tropolis Club" },
    { ...nft, id: "2", name: "Lil Pudgy" },
    { ...nft, id: "3", name: "Goodman" },
]
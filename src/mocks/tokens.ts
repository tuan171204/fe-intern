export interface TokenItem {
    id: string
    name: string
    symbol: string
    address: string
    avatar?: string
    balance: number
    supplyPercent: number
    mintProgress: number
    amountPerMint: number
    mintFee: string
}

const ADDRESS = "0x4eb697d3c1a85e9f20b7c64d81e3a5f7b9c2A0fB2A"

const base = { name: "Goodman", symbol: "GM", address: ADDRESS, balance: 200, supplyPercent: 100, amountPerMint: 10, mintFee: "0.012" }

export const TOKEN_LIST: TokenItem[] = [
    { ...base, id: "1", mintProgress: 100 },
    { ...base, id: "2", mintProgress: 0 },
    { ...base, id: "3", mintProgress: 0 },
    { ...base, id: "4", mintProgress: 100 },
]
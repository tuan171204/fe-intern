export interface Token {
    _id: string
    name: string
    symbol: string
    decimals: number
    supply: number
    image: string
    description: string
    websiteUrl?: string | null
    telegramUrl?: string | null
    discordUrl?: string | null
    xUrl?: string | null
    owner: string
    tokenAddress?: string
    maxSupply?: string
    amountPerMint?: string
    mintFee?: string
}

export interface PaginationMeta {
    total: number
    page: number
    limit: number
}

export interface PaginationParams {
    page?: number
    limit?: number
}

export interface TokenListResponse {
    message: string
    pagination: PaginationMeta
    data: Token[]
}

export interface TokenDetailResponse {
    message: string
    data: Token
}

/** Payload gửi POST /v1/tokens (multipart). Metadata on-chain backend tự đọc từ txHash */
export interface CreateTokenPayload {
    image: File
    txHash: string
    description: string
    websiteUrl?: string
    telegramUrl?: string
    discordUrl?: string
    xUrl?: string
}

export interface CreateTokenResponse {
    message: string
    data: Token
}
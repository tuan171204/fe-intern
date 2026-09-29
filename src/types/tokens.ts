export interface Token {
    _id: string
    name: string
    symbol: string
    decimals: number
    supply: number
    /** Đường dẫn ảnh do server trả về, dùng getImageUrl() để ghép host */
    image: string
    description: string
    websiteUrl?: string | null
    telegramUrl?: string | null
    discordUrl?: string | null
    xUrl?: string | null
    owner: string
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

export interface CreateTokenPayload {
    image: File
    name: string
    symbol: string
    decimals: string | number
    supply: string | number
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
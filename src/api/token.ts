import api from "../utils/api"
import type {
    CreateTokenPayload,
    CreateTokenResponse,
    PaginationParams,
    TokenDetailResponse,
    TokenListResponse,
} from "../types/tokens"

/** Danh sách token công khai */
export const getTokens = async (params: PaginationParams = {}): Promise<TokenListResponse> => {
    const { data } = await api.get<TokenListResponse>("/tokens", { params })
    return data
}

/** Chi tiết token theo địa chỉ contract */
export const getTokenByAddress = async (address: string): Promise<TokenDetailResponse> => {
    const { data } = await api.get<TokenDetailResponse>(`/tokens/${address}`)
    return data
}

/**
 * Lưu metadata token sau khi giao dịch on-chain đã xác nhận (multipart/form-data).
 * Field optional rỗng sẽ không được gửi. 
 */
export const createToken = async ({ image, ...fields }: CreateTokenPayload): Promise<CreateTokenResponse> => {
    const formData = new FormData()
    formData.append("image", image)

    Object.entries(fields).forEach(([key, value]) => {
        if (value === undefined || value === null) return
        const text = String(value).trim()
        if (text) formData.append(key, text)
    })

    const { data } = await api.post<CreateTokenResponse>("/tokens", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 60_000,
    })
    return data
}
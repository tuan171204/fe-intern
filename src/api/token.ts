import api from "../utils/api"
import type { PaginationParams, TokenDetailResponse, TokenListResponse } from "../types/tokens"

/** Danh sách token công khai (có phân trang) */
export const getTokens = async (params: PaginationParams = {}): Promise<TokenListResponse> => {
    const { data } = await api.get<TokenListResponse>("/tokens", { params })
    return data
}

export const getTokenById = async (id: string): Promise<TokenDetailResponse> => {
    const { data } = await api.get<TokenDetailResponse>(`/tokens/${id}`)
    return data
}
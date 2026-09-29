import api from "../utils/api"
import type { ProfileResponse, UpdateProfilePayload, UserProfile } from "../types/profile"
import type { PaginationParams, TokenListResponse } from "../types/tokens"

const toUserProfile = (raw: UserProfile): UserProfile => ({
    walletAddress: raw.walletAddress,
    username: raw.username ?? null,
    bio: raw.bio ?? null,
    telegramUrl: raw.telegramUrl ?? null,
    xUrl: raw.xUrl ?? null,
    githubUrl: raw.githubUrl ?? null,
})

export const getProfile = async (): Promise<UserProfile> => {
    const { data } = await api.get<ProfileResponse>("/users/profile")
    return toUserProfile(data.data)
}

export const updateProfile = async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const { data } = await api.put<ProfileResponse>("/users/profile", payload)
    return toUserProfile(data.data)
}

/** Token do user đang đăng nhập tạo ra (có phân trang) */
export const getUserTokens = async (params: PaginationParams = {}): Promise<TokenListResponse> => {
    const { data } = await api.get<TokenListResponse>("/tokens/user", { params })
    return data
}
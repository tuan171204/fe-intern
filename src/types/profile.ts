export interface UserProfile {
    walletAddress: string
    username: string | null
    bio: string | null
    telegramUrl: string | null
    xUrl: string | null
    githubUrl: string | null
}

export interface UpdateProfilePayload {
    username: string
    bio: string
    telegramUrl: string
    xUrl: string
    githubUrl: string
}

export interface ProfileResponse {
    message: string
    data: UserProfile
}
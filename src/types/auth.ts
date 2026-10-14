export interface RequestMessagePayload {
    walletAddress: string
}

export interface RequestMessageResponse {
    data: string
}

export interface LoginPayload {
    walletAddress: string
    signature: string
    message: string
}

export interface LoginResponse {
    message: string
    /** JWT token */
    data: string
}
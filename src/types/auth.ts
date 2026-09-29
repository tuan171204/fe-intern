export interface SignUpPayload {
    walletAddress: string
    password: string
}

export interface SignUpResponse {
    message: string
}

export interface SignInPayload {
    walletAddress: string
    password: string
}

export interface SignInResponse {
    message: string
    /** JWT token */
    data: string
}
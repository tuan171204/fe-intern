import api from "../utils/api"
import type { SignInPayload, SignInResponse, SignUpPayload, SignUpResponse } from "../types/auth"

export const signUp = async (payload: SignUpPayload): Promise<SignUpResponse> => {
    const { data } = await api.post<SignUpResponse>("/users/sign-up", payload)
    return data
}

export const signIn = async (payload: SignInPayload): Promise<SignInResponse> => {
    const { data } = await api.post<SignInResponse>("/users/sign-in", payload)
    return data
}
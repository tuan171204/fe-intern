// File: src/api/auth.ts
import api from "../utils/api"
import type { SignUpPayload, SignUpResponse } from "../types/auth"

export const signUp = async (payload: SignUpPayload): Promise<SignUpResponse> => {
    const { data } = await api.post<SignUpResponse>("/users/sign-up", payload)
    return data
}
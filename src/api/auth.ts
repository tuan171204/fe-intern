import api from "../utils/api"
import type { LoginPayload, LoginResponse, RequestMessagePayload, RequestMessageResponse } from "../types/auth"

/** SIWE: xin message cần ký cho ví */
export const requestMessage = async (payload: RequestMessagePayload): Promise<string> => {
    const { data } = await api.post<RequestMessageResponse>("/users/request", payload)
    return data.data
}

/** SIWE: gửi chữ ký để đổi lấy JWT */
export const loginWithSignature = async (payload: LoginPayload): Promise<string> => {
    const { data } = await api.post<LoginResponse>("/users/login", payload)
    return data.data
}
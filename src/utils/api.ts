// File: src/utils/api.ts
import axios, { isAxiosError } from "axios"

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5035/v1"

export const AUTH_TOKEN_KEY = "auth_token"
export const UNAUTHORIZED_EVENT = "auth:unauthorized"

export const getToken = (): string | null => {
    try {
        return localStorage.getItem(AUTH_TOKEN_KEY)
    } catch {
        return null
    }
}
export const setToken = (token: string) => localStorage.setItem(AUTH_TOKEN_KEY, token)
export const clearToken = () => localStorage.removeItem(AUTH_TOKEN_KEY)

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config) => {
    const token = getToken()
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

api.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        const status = isAxiosError(error) ? error.response?.status : undefined
        if ((status === 401 || status === 403) && getToken()) {
            clearToken()
            window.dispatchEvent(new Event(UNAUTHORIZED_EVENT))
        }
        return Promise.reject(error)
    }
)

/** Lấy message lỗi từ response backend ({ message }) hoặc lỗi mạng */
export const getErrorMessage = (error: unknown, fallback = "Something went wrong. Please try again.") => {
    if (isAxiosError<{ message?: string }>(error)) {
        if (!error.response) return "Cannot connect to the server. Please try again later."
        return error.response.data?.message ?? fallback
    }
    return fallback
}

export default api
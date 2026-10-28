import axios, { isAxiosError } from "axios"

import i18n from "../i18n"

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5035/v1"
export const ASSET_BASE_URL: string = import.meta.env.VITE_ASSET_BASE_URL ?? "http://localhost:5035"

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

/**
 * Extracts a message from the backend response ({ message }) or a network error.
 * Backend messages are returned as-is (the backend only speaks English);
 * every client-side fallback follows the current UI language.
 */
export const getErrorMessage = (error: unknown, fallback = i18n.t("errors.generic")) => {
    if (isAxiosError<{ message?: string }>(error)) {
        if (!error.response) return i18n.t("errors.network")
        return error.response.data?.message ?? fallback
    }
    return fallback
}

/** Joins the image path returned by the backend ("/uploads/171...png") with the asset server. */
export const getImageUrl = (path?: string | null): string | undefined => {
    if (!path) return undefined
    if (/^https?:\/\//i.test(path)) return path
    return `${ASSET_BASE_URL}/${path.replace(/^\/+/, "")}`
}

export default api
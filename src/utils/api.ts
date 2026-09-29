import axios, { isAxiosError } from "axios"

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:5035/v1"

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: { "Content-Type": "application/json" },
})

/** Lấy message lỗi từ response */
export const getErrorMessage = (error: unknown, fallback = "Something went wrong. Please try again.") => {
    if (isAxiosError<{ message?: string }>(error)) {
        if (!error.response) return "Cannot connect to the server. Please try again later."
        return error.response.data?.message ?? fallback
    }
    return fallback
}

export default api
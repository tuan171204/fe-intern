import * as React from "react"

import { getProfile } from "../api/profile"
import type { UserProfile } from "../types/profile"
import { UNAUTHORIZED_EVENT, clearToken, getErrorMessage, getToken, setToken } from "../utils/api"
import { useToast } from "./ToastContext"

export interface AuthUser {
    address: string
}

interface AuthContextValue {
    isLogged: boolean
    user: AuthUser | null
    /** Nhận JWT từ API sign-in, lưu vào localStorage và cập nhật state */
    login: (token: string) => void
    logout: () => void
    profile: UserProfile | null
    profileLoading: boolean
    profileError: string | null
    fetchProfile: () => Promise<void>
    /** Cập nhật profile trong context (vd: sau khi Edit Profile thành công) */
    setProfile: (profile: UserProfile) => void
}

interface JwtPayload {
    userId?: string
    walletAddress?: string
    exp?: number
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

const decodeJwt = (token: string): JwtPayload | null => {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
        return JSON.parse(atob(base64)) as JwtPayload
    } catch {
        return null
    }
}

/** Trả về user nếu token hợp lệ và chưa hết hạn, ngược lại null */
const parseUser = (token: string): AuthUser | null => {
    const payload = decodeJwt(token)
    if (!payload?.walletAddress) return null
    if (payload.exp && payload.exp * 1000 <= Date.now()) return null
    return { address: payload.walletAddress }
}

const readSession = (): AuthUser | null => {
    const token = getToken()
    if (!token) return null

    const user = parseUser(token)
    if (!user) clearToken()
    return user
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<AuthUser | null>(() => readSession())
    const [profile, setProfile] = React.useState<UserProfile | null>(null)
    const [profileLoading, setProfileLoading] = React.useState(false)
    const [profileError, setProfileError] = React.useState<string | null>(null)
    const { error } = useToast()

    const login = React.useCallback((token: string) => {
        const nextUser = parseUser(token)
        if (!nextUser) throw new Error("Invalid token received from server.")
        setToken(token)
        setUser(nextUser)
    }, [])

    const logout = React.useCallback(() => {
        clearToken()
        setUser(null)
    }, [])

    const fetchProfile = React.useCallback(async () => {
        const requestToken = getToken()
        setProfileLoading(true)
        setProfileError(null)
        try {
            const data = await getProfile()
            if (getToken() === requestToken) setProfile(data)
        } catch (err) {
            if (getToken() === requestToken) setProfileError(getErrorMessage(err, "Failed to load profile"))
        } finally {
            setProfileLoading(false)
        }
    }, [])

    /* Có phiên đăng nhập (khởi chạy app / vừa login) -> tải profile; đăng xuất -> xoá profile */
    const isLogged = !!user
    React.useEffect(() => {
        if (isLogged) {
            void fetchProfile()
        } else {
            setProfile(null)
            setProfileError(null)
        }
    }, [isLogged, fetchProfile])

    /* Token bị server từ chối (hết hạn/không hợp lệ): interceptor đã xoá token, ở đây reset state */
    React.useEffect(() => {
        const onUnauthorized = () => {
            setUser(null)
            error("Your session has expired. Please sign in again.")
        }
        window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
        return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized)
    }, [error])

    const value = React.useMemo<AuthContextValue>(
        () => ({
            isLogged,
            user,
            login,
            logout,
            profile,
            profileLoading,
            profileError,
            fetchProfile,
            setProfile,
        }),
        [isLogged, user, login, logout, profile, profileLoading, profileError, fetchProfile]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
    const ctx = React.useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}

export { AuthProvider, useAuth }
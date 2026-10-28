import * as React from "react"

import { getProfile } from "../api/profile"
import i18n from "../i18n"
import type { UserProfile } from "../types/profile"
import { UNAUTHORIZED_EVENT, clearToken, getErrorMessage, getToken, setToken } from "../utils/api"
import { useToast } from "./ToastContext"

export interface AuthUser {
    address: string
    /** Time at which the JWT expires (ms) */
    expiresAt?: number
}

interface AuthContextValue {
    isLogged: boolean
    user: AuthUser | null
    /** Receives the JWT from the sign-in API, stores it in localStorage and updates the state */
    login: (token: string) => void
    logout: () => void
    profile: UserProfile | null
    profileLoading: boolean
    profileError: string | null
    fetchProfile: () => Promise<void>
    /** Updates the profile held in the context (e.g. after Edit Profile succeeds) */
    setProfile: (profile: UserProfile) => void
}

interface JwtPayload {
    userId?: string
    walletAddress?: string
    exp?: number
}

/* Maximum delay supported by setTimeout (~24.8 days) */
const MAX_TIMEOUT_MS = 2_147_483_647

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

const decodeJwt = (token: string): JwtPayload | null => {
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
        return JSON.parse(atob(base64)) as JwtPayload
    } catch {
        return null
    }
}

/** Returns the user if the token is valid and not expired, otherwise null */
const parseUser = (token: string): AuthUser | null => {
    const payload = decodeJwt(token)
    if (!payload?.walletAddress) return null
    if (payload.exp && payload.exp * 1000 <= Date.now()) return null
    return { address: payload.walletAddress, expiresAt: payload.exp ? payload.exp * 1000 : undefined }
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
        if (!nextUser) throw new Error(i18n.t("auth.invalidToken"))
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
            /* Ignore the response if the session changed while the request was in flight */
            if (getToken() === requestToken) setProfile(data)
        } catch (err) {
            if (getToken() === requestToken) {
                setProfileError(getErrorMessage(err, i18n.t("errors.loadProfile")))
            }
        } finally {
            setProfileLoading(false)
        }
    }, [])

    /* A session exists (app start / just logged in) -> load the profile; logged out -> clear it */
    const isLogged = !!user
    React.useEffect(() => {
        if (isLogged) {
            void fetchProfile()
        } else {
            setProfile(null)
            setProfileError(null)
        }
    }, [isLogged, fetchProfile])

    /* JWT expires while the app is open -> log out exactly on time instead of waiting for a 401 */
    const expiresAt = user?.expiresAt
    React.useEffect(() => {
        if (!expiresAt) return
        const delay = Math.max(expiresAt - Date.now(), 0)
        if (delay > MAX_TIMEOUT_MS) return

        const timer = window.setTimeout(() => {
            clearToken()
            setUser(null)
            error(i18n.t("auth.sessionExpired"))
        }, delay)
        return () => window.clearTimeout(timer)
    }, [expiresAt, error])

    /* Token rejected by the server (expired / invalid): the interceptor already cleared it, so only reset the state here */
    React.useEffect(() => {
        const onUnauthorized = () => {
            setUser(null)
            error(i18n.t("auth.sessionExpired"))
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
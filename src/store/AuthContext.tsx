import * as React from "react"

export interface AuthUser {
    address: string
}

interface AuthContextValue {
    isLogged: boolean
    user: AuthUser | null
    login: (address: string) => void
    logout: () => void
}

const SESSION_KEY = "acw3_session"

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined)

const readSession = (): AuthUser | null => {
    try {
        const raw = localStorage.getItem(SESSION_KEY)
        return raw ? (JSON.parse(raw) as AuthUser) : null
    } catch {
        return null
    }
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = React.useState<AuthUser | null>(() => readSession())

    const login = React.useCallback((address: string) => {
        const nextUser = { address }
        localStorage.setItem(SESSION_KEY, JSON.stringify(nextUser))
        setUser(nextUser)
    }, [])

    const logout = React.useCallback(() => {
        localStorage.removeItem(SESSION_KEY)
        setUser(null)
    }, [])

    const value = React.useMemo<AuthContextValue>(
        () => ({ isLogged: !!user, user, login, logout }),
        [user, login, logout]
    )

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

const useAuth = () => {
    const ctx = React.useContext(AuthContext)
    if (!ctx) throw new Error("useAuth must be used within AuthProvider")
    return ctx
}

export { AuthProvider, useAuth }
export interface MockUser {
    address: string
    password: string
    createdAt: string
}

const USERS_KEY = "acw3_mock_users"

const readUsers = (): MockUser[] => {
    try {
        const raw = localStorage.getItem(USERS_KEY)
        return raw ? (JSON.parse(raw) as MockUser[]) : []
    } catch {
        return []
    }
}

const writeUsers = (users: MockUser[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users))

export const findUserByAddress = (address: string) =>
    readUsers().find((u) => u.address.toLowerCase() === address.toLowerCase())

export interface RegisterResult {
    success: boolean
    error?: string
}

export const registerUser = (address: string, password: string): RegisterResult => {
    const users = readUsers()
    if (users.some((u) => u.address.toLowerCase() === address.toLowerCase())) {
        return { success: false, error: "Wallet address này đã được đăng ký" }
    }
    users.push({ address, password, createdAt: new Date().toISOString() })
    writeUsers(users)
    return { success: true }
}

export const validateCredentials = (address: string, password: string) => {
    const user = findUserByAddress(address)
    return !!user && user.password === password
}
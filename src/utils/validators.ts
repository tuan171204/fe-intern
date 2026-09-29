const EVM_ADDRESS_REGEX = /^0x[a-fA-F0-9]{40}$/

export const isValidWalletAddress = (address: string) => EVM_ADDRESS_REGEX.test(address.trim())

export const isValidUrl = (value: string) => {
    try {
        const url = new URL(value)
        return url.protocol === "http:" || url.protocol === "https:"
    } catch {
        return false
    }
}

export type PasswordStrengthLevel = "empty" | "weak" | "medium" | "strong"

export interface PasswordStrengthResult {
    level: PasswordStrengthLevel
    score: number
    hasValidLength: boolean
    hasUpperCase: boolean
    hasLowerCase: boolean
    hasNumber: boolean
    hasSpecialChar: boolean
}

export const getPasswordStrength = (password: string): PasswordStrengthResult => {
    const hasValidLength = password.length >= 6
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password)

    const score = [hasValidLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar].filter(Boolean).length

    let level: PasswordStrengthLevel = "empty"
    if (password.length > 0) {
        level = score <= 2 ? "weak" : score <= 4 ? "medium" : "strong"
    }

    return { level, score, hasValidLength, hasUpperCase, hasLowerCase, hasNumber, hasSpecialChar }
}

export const IMAGE_ACCEPT = "image/png,image/jpeg,image/svg+xml"
export const IMAGE_MAX_SIZE_MB = 5

/** Trả về message lỗi nếu file ảnh không hợp lệ, ngược lại undefined */
export const validateImageFile = (file: File): string | undefined => {
    if (!IMAGE_ACCEPT.split(",").includes(file.type)) return "Only PNG, JPG or SVG images are allowed"
    if (file.size > IMAGE_MAX_SIZE_MB * 1024 * 1024) return `Image must be smaller than ${IMAGE_MAX_SIZE_MB}MB`
    return undefined
}
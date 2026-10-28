import i18n from "../i18n"

interface ErrorLike {
    name?: unknown
    code?: unknown
    message?: unknown
    shortMessage?: unknown
    cause?: unknown
}

/** Walks the whole `cause` chain (viem / wagmi / MetaMask all wrap errors in nested causes). */
const errorChain = (error: unknown): ErrorLike[] => {
    const chain: ErrorLike[] = []
    let current: unknown = error
    for (let depth = 0; depth < 10 && current && typeof current === "object"; depth++) {
        chain.push(current as ErrorLike)
        current = (current as ErrorLike).cause
    }
    return chain
}

/** The user clicked Reject / closed the MetaMask popup (EIP-1193 code 4001). */
export const isUserRejection = (error: unknown) =>
    errorChain(error).some((e) => e.code === 4001 || e.name === "UserRejectedRequestError")

/** No provider found (MetaMask is not installed or is disabled). */
export const isProviderNotFound = (error: unknown) =>
    errorChain(error).some((e) => e.name === "ProviderNotFoundError")

/** MetaMask already has another request waiting for confirmation (code -32002). */
export const isRequestPending = (error: unknown) =>
    errorChain(error).some((e) => e.code === -32002 || e.name === "ResourceUnavailableRpcError")

/**
 * Builds a user-facing message from a wallet error.
 * `rejectedMessage`: custom (already translated) text used when the user rejects the request.
 * The default is evaluated on every call, so it always follows the current language.
 */
export function getWalletErrorMessage(
    error: unknown,
    rejectedMessage = i18n.t("errors.rejectedRequest")
): string {
    if (isProviderNotFound(error)) return i18n.t("errors.providerNotFound")
    if (isUserRejection(error)) return rejectedMessage
    if (isRequestPending(error)) return i18n.t("errors.requestPending")

    /* Library messages (viem / MetaMask) are English only and cannot be translated here */
    const [first] = errorChain(error)
    if (typeof first?.shortMessage === "string" && first.shortMessage) return first.shortMessage
    if (typeof first?.message === "string" && first.message) return first.message
    return i18n.t("errors.generic")
}
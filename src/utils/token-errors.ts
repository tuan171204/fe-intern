import i18n from "../i18n"
import { getWalletErrorMessage, isUserRejection } from "./web3-errors"

interface ErrorLike {
    name?: unknown
    shortMessage?: unknown
    message?: unknown
    cause?: unknown
}

/** Flattens name/message of the whole `cause` chain into one lowercase string for matching. */
const flatten = (error: unknown): string => {
    const parts: string[] = []
    let current: unknown = error
    for (let depth = 0; depth < 10 && current && typeof current === "object"; depth++) {
        const e = current as ErrorLike
        for (const part of [e.name, e.shortMessage, e.message]) {
            if (typeof part === "string") parts.push(part)
        }
        current = e.cause
    }
    return parts.join(" | ").toLowerCase()
}

/*
 * Messages are resolved through functions (not module-level constants)
 * so they always follow the language selected at the time the error happens.
 */

/** The receipt could not be confirmed (RPC / network error): the transaction MAY still have succeeded. */
export const getReceiptUnconfirmedMessage = () => i18n.t("errors.receiptUnconfirmed")

/** 429 / -32005 (Alchemy, Infura, publicnode...) */
const isRateLimited = (text: string) =>
    text.includes("rate limit") ||
    text.includes("rate-limit") ||
    text.includes("too many requests") ||
    text.includes("status: 429") ||
    text.includes("limit exceeded") ||
    text.includes("exceeded the")

const isNetworkFailure = (text: string) =>
    text.includes("http request failed") || text.includes("failed to fetch") || text.includes("network error")

const isGasProblem = (text: string) =>
    text.includes("intrinsicgastoolow") ||
    text.includes("out of gas") ||
    text.includes("gas required exceeds") ||
    text.includes("exceeds block gas limit")

/** Errors while sending the create-token transaction / waiting for its receipt. */
export function getCreateTokenErrorMessage(error: unknown): string {
    if (isUserRejection(error)) return i18n.t("errors.rejectedTx")

    const text = flatten(error)

    if (isRateLimited(text)) return i18n.t("errors.rateLimit")
    if (text.includes("insufficient funds") || text.includes("insufficientfunds")) {
        return i18n.t("errors.insufficientEthCreate")
    }
    if (isGasProblem(text)) return i18n.t("errors.gasTooLow")
    if (text.includes("chainmismatch")) return i18n.t("errors.chainMismatch")
    if (text.includes("reverted") || text.includes("executionreverted")) {
        return i18n.t("errors.createReverted")
    }
    if (isNetworkFailure(text)) return i18n.t("errors.rpcUnreachable")

    return getWalletErrorMessage(error, i18n.t("errors.rejectedTx"))
}

/** Errors while minting a token: simulate / send transaction / wait for receipt. */
export function getMintTokenErrorMessage(error: unknown): string {
    if (isUserRejection(error)) return i18n.t("errors.rejectedTx")

    const text = flatten(error)

    if (isRateLimited(text)) return i18n.t("errors.rateLimit")
    if (
        text.includes("insufficient funds") ||
        text.includes("insufficientfunds") ||
        text.includes("transaction creation failed")
    ) {
        return i18n.t("errors.insufficientEthMint")
    }
    if (isGasProblem(text)) return i18n.t("errors.gasTooLow")
    if (text.includes("chainmismatch")) return i18n.t("errors.chainMismatch")
    if (text.includes("max supply") || text.includes("maxsupply") || text.includes("exceeds max")) {
        return i18n.t("errors.maxSupplyReached")
    }
    if (text.includes("mint fee") || text.includes("incorrect fee") || text.includes("insufficient fee")) {
        return i18n.t("errors.feeMismatch")
    }
    if (text.includes("reverted") || text.includes("executionreverted")) {
        return i18n.t("errors.mintReverted")
    }
    if (isNetworkFailure(text)) return i18n.t("errors.rpcUnreachable")

    return getWalletErrorMessage(error, i18n.t("errors.rejectedTx"))
}
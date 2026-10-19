import { getWalletErrorMessage, isUserRejection } from "./web3-errors"

interface ErrorLike {
    name?: unknown
    shortMessage?: unknown
    message?: unknown
    cause?: unknown
}

/** Gộp name/message của cả chuỗi `cause` thành 1 chuỗi */
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

export const REJECTED_MESSAGE = "You rejected the transaction in MetaMask."

export const RATE_LIMIT_MESSAGE = "The RPC node is rate-limiting requests. Please wait a few seconds and try again."
export const NETWORK_MESSAGE = "Cannot reach the RPC node. Check your connection and try again."

/** Không xác nhận được receipt (lỗi RPC/mạng) - giao dịch vẫn CÓ THỂ đã thành công */
export const RECEIPT_UNCONFIRMED_MESSAGE =
    "We couldn't confirm the transaction (RPC/network issue). It may still go through. Check the Etherscan link before trying again."

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

/** Lỗi khi gửi giao dịch tạo token / chờ receipt  */
export function getCreateTokenErrorMessage(error: unknown): string {
    if (isUserRejection(error)) return REJECTED_MESSAGE

    const text = flatten(error)

    if (isRateLimited(text)) return RATE_LIMIT_MESSAGE
    if (text.includes("insufficient funds") || text.includes("insufficientfunds")) {
        return "Not enough Sepolia ETH to pay gas. Get some from a faucet and try again."
    }
    if (isGasProblem(text)) {
        return "Gas is too low or the gas estimate failed. Raise the gas limit in MetaMask and try again."
    }
    if (text.includes("chainmismatch")) {
        return "Your wallet is on the wrong network. Please switch to Sepolia."
    }
    if (text.includes("reverted") || text.includes("executionreverted")) {
        return "The contract rejected this transaction. Check name, symbol, supply and mint fee."
    }
    if (isNetworkFailure(text)) return NETWORK_MESSAGE

    return getWalletErrorMessage(error, REJECTED_MESSAGE)
}

/** Lỗi khi mint token: simulate / gửi giao dịch / chờ receipt */
export function getMintTokenErrorMessage(error: unknown): string {
    if (isUserRejection(error)) return REJECTED_MESSAGE

    const text = flatten(error)

    if (isRateLimited(text)) return RATE_LIMIT_MESSAGE
    if (
        text.includes("insufficient funds") ||
        text.includes("insufficientfunds") ||
        text.includes("transaction creation failed")
    ) {
        return "Not enough Sepolia ETH to pay the mint fee and gas. Get some from a faucet and try again."
    }
    if (isGasProblem(text)) {
        return "Gas is too low or the gas estimate failed. Raise the gas limit in MetaMask and try again."
    }
    if (text.includes("chainmismatch")) {
        return "Your wallet is on the wrong network. Please switch to Sepolia."
    }
    if (text.includes("max supply") || text.includes("maxsupply") || text.includes("exceeds max")) {
        return "Max supply reached. This token can't be minted any further."
    }
    if (text.includes("mint fee") || text.includes("incorrect fee") || text.includes("insufficient fee")) {
        return "The mint fee sent doesn't match what the contract requires."
    }
    if (text.includes("reverted") || text.includes("executionreverted")) {
        return "The contract rejected this mint. The max supply may have been reached or the fee is incorrect."
    }
    if (isNetworkFailure(text)) return NETWORK_MESSAGE

    return getWalletErrorMessage(error, REJECTED_MESSAGE)
}
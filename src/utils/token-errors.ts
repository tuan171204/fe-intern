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

/** Lỗi khi gửi giao dịch tạo token / chờ receipt  */
export function getCreateTokenErrorMessage(error: unknown): string {
    if (isUserRejection(error)) return REJECTED_MESSAGE

    const text = flatten(error)

    if (text.includes("insufficient funds") || text.includes("insufficientfunds")) {
        return "Not enough Sepolia ETH to pay gas. Get some from a faucet and try again."
    }
    if (
        text.includes("intrinsicgastoolow") ||
        text.includes("out of gas") ||
        text.includes("gas required exceeds") ||
        text.includes("exceeds block gas limit")
    ) {
        return "Gas is too low or the gas estimate failed. Raise the gas limit in MetaMask and try again."
    }
    if (text.includes("chainmismatch")) {
        return "Your wallet is on the wrong network. Please switch to Sepolia."
    }
    if (text.includes("reverted") || text.includes("executionreverted")) {
        return "The contract rejected this transaction. Check name, symbol, supply and mint fee."
    }

    return getWalletErrorMessage(error, REJECTED_MESSAGE)
}

/** Lỗi khi mint token: simulate / gửi giao dịch / chờ receipt */
export function getMintTokenErrorMessage(error: unknown): string {
    if (isUserRejection(error)) return REJECTED_MESSAGE

    const text = flatten(error)

    if (
        text.includes("insufficient funds") ||
        text.includes("insufficientfunds") ||
        text.includes("transaction creation failed")
    ) {
        return "Not enough Sepolia ETH to pay the mint fee and gas. Get some from a faucet and try again."
    }
    if (
        text.includes("intrinsicgastoolow") ||
        text.includes("out of gas") ||
        text.includes("gas required exceeds") ||
        text.includes("exceeds block gas limit")
    ) {
        return "Gas is too low or the gas estimate failed. Raise the gas limit in MetaMask and try again."
    }
    if (text.includes("chainmismatch")) {
        return "Your wallet is on the wrong network. Please switch to Sepolia."
    }
    if (text.includes("max supply") || text.includes("maxsupply") || text.includes("exceed")) {
        return "Max supply reached. This token can't be minted any further."
    }
    if (text.includes("mint fee") || text.includes("incorrect fee") || text.includes("insufficient fee")) {
        return "The mint fee sent doesn't match what the contract requires."
    }
    if (text.includes("reverted") || text.includes("executionreverted")) {
        return "The contract rejected this mint. The max supply may have been reached or the fee is incorrect."
    }

    return getWalletErrorMessage(error, REJECTED_MESSAGE)
}
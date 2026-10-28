import * as React from "react"
import { isAxiosError } from "axios"
import { parseEther, parseUnits, type Hash } from "viem"
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi"

import { createToken } from "../api/token"
import { EXPLORER_URL, SEPOLIA_CHAIN_ID } from "../config/network"
import { TokenFactoryABI } from "../constants/abi"
import { TOKEN_DECIMALS, TOKEN_FACTORY_ADDRESS } from "../constants/contract"
import i18n from "../i18n"
import { useToast } from "../store/ToastContext"
import { getErrorMessage, getToken } from "../utils/api"
import { getCreateTokenErrorMessage, getReceiptUnconfirmedMessage } from "../utils/token-errors"
import { isUserRejection } from "../utils/web3-errors"

export interface CreateTokenInput {
    name: string
    symbol: string
    /** Amount minted to the owner on deploy. */
    initialSupply: string
    /** Maximum total supply, e.g. "10000000" (token units, not multiplied by decimals yet) */
    maxSupply: string
    amountPerMint: string
    /** Mint fee in ETH, e.g. "0.012" */
    mintFee: string
    description: string
    image: File
    websiteUrl?: string
    telegramUrl?: string
    discordUrl?: string
    xUrl?: string
}

export type CreateTokenStep =
    | "idle"
    | "submitting" // simulate + wait for the user to confirm in MetaMask
    | "confirming" // txHash received, waiting for block confirmation
    | "saving" // POST metadata to the backend
    | "success"
    | "save-failed" // tx is on-chain but saving to the backend failed -> allow retry
    | "error"

const SAVE_MAX_ATTEMPTS = 6
const SAVE_RETRY_DELAY_MS = 5000

/* A receipt lookup failure (rate limit, timeout) does NOT mean the tx failed -> retry a few times before reporting */
const RECEIPT_MAX_RECHECKS = 5
const RECEIPT_RECHECK_DELAY_MS = 5_000

/* The JWT must live long enough to finish: sign tx + wait for the block + save metadata */
const SESSION_MIN_REMAINING_MS = 5 * 60 * 1000

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

/** Only retry on network errors / 5xx (the backend RPC may not see the tx yet) */
const shouldRetry = (err: unknown) => isAxiosError(err) && (!err.response || err.response.status >= 500)

/** 401/403: the interceptor already logged the user out and showed the "session expired" toast */
const isAuthError = (err: unknown) =>
    isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)

/** The backend says the token already exists: on a retry this means the previous request was saved (its response was lost) */
const isAlreadySaved = (err: unknown) =>
    isAxiosError<{ message?: string }>(err) &&
    err.response?.status === 400 &&
    err.response.data?.message === "Token existed."

/** True if the JWT is about to expire (or missing) -> do not start a transaction that costs gas */
const isSessionExpiringSoon = (): boolean => {
    const token = getToken()
    if (!token) return true
    try {
        const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")
        const { exp } = JSON.parse(atob(base64)) as { exp?: number }
        return !!exp && exp * 1000 - Date.now() < SESSION_MIN_REMAINING_MS
    } catch {
        return false
    }
}

/** Form data -> arguments of createStandardToken(name, symbol, initialSupply, maxSupply, amountPerMint, mintFee) */
const buildCreateTokenArgs = (input: CreateTokenInput) =>
    [
        input.name,
        input.symbol,
        parseUnits(input.initialSupply, TOKEN_DECIMALS),
        parseUnits(input.maxSupply, TOKEN_DECIMALS),
        parseUnits(input.amountPerMint, TOKEN_DECIMALS),
        parseEther(input.mintFee),
    ] as const

export function useCreateToken() {
    const { address } = useAccount()
    const publicClient = usePublicClient({ chainId: SEPOLIA_CHAIN_ID })
    const { writeContractAsync } = useWriteContract()
    const { success, error: toastError } = useToast()

    const [step, setStepState] = React.useState<CreateTokenStep>("idle")
    const [txHash, setTxHash] = React.useState<Hash | undefined>(undefined)
    const [error, setError] = React.useState<string | null>(null)

    /* stepRef updates synchronously -> blocks a double submit within the same tick (state only changes after a re-render) */
    const stepRef = React.useRef<CreateTokenStep>("idle")
    const setStep = React.useCallback((next: CreateTokenStep) => {
        stepRef.current = next
        setStepState(next)
    }, [])

    /* Keeps the form data (including the File) so the save / retry step can reuse it without re-entering */
    const inputRef = React.useRef<CreateTokenInput | null>(null)
    /* Prevents overlapping POST /tokens calls (two parallel requests -> the second gets "Token existed.") */
    const savingRef = React.useRef(false)
    const recheckCount = React.useRef(0)

    const receipt = useWaitForTransactionReceipt({ hash: txHash, chainId: SEPOLIA_CHAIN_ID })
    const { refetch: refetchReceipt } = receipt

    const fail = React.useCallback(
        (message: string) => {
            setError(message)
            setStep("error")
            toastError(message)
        },
        [setStep, toastError]
    )

    const saveMetadata = React.useCallback(
        async (hash: Hash, input: CreateTokenInput) => {
            if (savingRef.current) return
            savingRef.current = true
            setStep("saving")
            setError(null)

            try {
                for (let attempt = 1; ; attempt++) {
                    try {
                        await createToken({
                            image: input.image,
                            txHash: hash,
                            description: input.description,
                            websiteUrl: input.websiteUrl,
                            telegramUrl: input.telegramUrl,
                            discordUrl: input.discordUrl,
                            xUrl: input.xUrl,
                        })
                        setStep("success")
                        success(i18n.t("tokenCreator.notices.created"))
                        return
                    } catch (err) {
                        /* The previous attempt was saved but its response was lost -> treat as success */
                        if (attempt > 1 && isAlreadySaved(err)) {
                            setStep("success")
                            success(i18n.t("tokenCreator.notices.created"))
                            return
                        }
                        if (attempt < SAVE_MAX_ATTEMPTS && shouldRetry(err)) {
                            await sleep(SAVE_RETRY_DELAY_MS)
                            continue
                        }
                        const message = getErrorMessage(err, i18n.t("errors.saveMetadata"))
                        setError(i18n.t("tokenCreator.notices.saveFailed", { message }))
                        setStep("save-failed")
                        if (!isAuthError(err)) toastError(message)
                        return
                    }
                }
            } finally {
                savingRef.current = false
            }
        },
        [setStep, success, toastError]
    )

    /* Step 3 -> 4: only call the backend once the receipt is successful */
    React.useEffect(() => {
        if (step !== "confirming" || !txHash || !inputRef.current) return

        if (receipt.isError) {
            if (recheckCount.current < RECEIPT_MAX_RECHECKS) {
                const timer = window.setTimeout(() => {
                    recheckCount.current += 1
                    void refetchReceipt()
                }, RECEIPT_RECHECK_DELAY_MS)
                return () => window.clearTimeout(timer)
            }
            fail(getReceiptUnconfirmedMessage())
            return
        }
        if (!receipt.isSuccess) return

        if (receipt.data.status !== "success") {
            fail(i18n.t("tokenCreator.notices.reverted"))
            return
        }
        void saveMetadata(txHash, inputRef.current)
    }, [step, txHash, receipt.isError, receipt.isSuccess, receipt.error, receipt.data, refetchReceipt, fail, saveMetadata])

    const submit = React.useCallback(
        async (input: CreateTokenInput) => {
            const current = stepRef.current
            if (current === "submitting" || current === "confirming" || current === "saving" || current === "save-failed") {
                return
            }

            if (!address || !publicClient) {
                fail(i18n.t("tokenCreator.notices.connectToast"))
                return
            }

            /* Avoid the case where the tx lands on-chain but the JWT expires and the metadata cannot be saved */
            if (isSessionExpiringSoon()) {
                toastError(i18n.t("auth.sessionExpiring"))
                return
            }

            setError(null)
            setTxHash(undefined)
            recheckCount.current = 0
            setStep("submitting")

            try {
                const args = buildCreateTokenArgs(input)

                /* Simulate: catch reverts before opening MetaMask, so no gas is wasted on a transaction that will certainly fail */
                await publicClient.simulateContract({
                    account: address,
                    address: TOKEN_FACTORY_ADDRESS,
                    abi: TokenFactoryABI,
                    functionName: "createStandardToken",
                    args,
                })

                const hash = await writeContractAsync({
                    address: TOKEN_FACTORY_ADDRESS,
                    abi: TokenFactoryABI,
                    functionName: "createStandardToken",
                    args,
                    chainId: SEPOLIA_CHAIN_ID,
                })
                inputRef.current = input
                setTxHash(hash)
                setStep("confirming")
            } catch (err) {
                const message = getCreateTokenErrorMessage(err)
                if (isUserRejection(err)) {
                    /* The user cancelled on purpose: return the form to its initial state */
                    setStep("idle")
                    toastError(message)
                } else {
                    fail(message)
                }
            }
        },
        [address, publicClient, writeContractAsync, fail, toastError, setStep]
    )

    /** Only calls the save-metadata API again with the existing txHash */
    const retrySave = React.useCallback(() => {
        if (stepRef.current !== "save-failed" || !txHash || !inputRef.current) return
        void saveMetadata(txHash, inputRef.current)
    }, [txHash, saveMetadata])

    const reset = React.useCallback(() => {
        inputRef.current = null
        recheckCount.current = 0
        savingRef.current = false
        setTxHash(undefined)
        setError(null)
        setStep("idle")
    }, [setStep])

    return {
        step,
        txHash,
        error,
        isBusy: step === "submitting" || step === "confirming" || step === "saving",
        txUrl: txHash ? `${EXPLORER_URL}/tx/${txHash}` : undefined,
        submit,
        retrySave,
        reset,
    }
}
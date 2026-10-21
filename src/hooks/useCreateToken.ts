import * as React from "react"
import { isAxiosError } from "axios"
import { parseEther, parseUnits, type Hash } from "viem"
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi"

import { createToken } from "../api/token"
import { EXPLORER_URL, SEPOLIA_CHAIN_ID } from "../config/network"
import { TokenFactoryABI } from "../constants/abi"
import { TOKEN_DECIMALS, TOKEN_FACTORY_ADDRESS } from "../constants/contract"
import { useToast } from "../store/ToastContext"
import { getErrorMessage, getToken } from "../utils/api"
import { RECEIPT_UNCONFIRMED_MESSAGE, getCreateTokenErrorMessage } from "../utils/token-errors"
import { isUserRejection } from "../utils/web3-errors"

export interface CreateTokenInput {
    name: string
    symbol: string
    /** Lượng mint sẵn cho owner lúc deploy. */
    initialSupply: string
    /** Tổng cung tối đa, vd "10000000" (đơn vị token, chưa nhân decimals) */
    maxSupply: string
    amountPerMint: string
    /** Mint fee theo ETH, vd "0.012" */
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
    | "submitting" // simulate + chờ user xác nhận trong MetaMask
    | "confirming" // đã có txHash, chờ block xác nhận
    | "saving" // POST metadata lên backend
    | "success"
    | "save-failed" // tx đã on-chain nhưng lưu backend lỗi -> cho retry
    | "error"

const SAVE_MAX_ATTEMPTS = 3
const SAVE_RETRY_DELAY_MS = 3000

/* Lỗi lấy receipt (rate-limit, timeout) KHÔNG có nghĩa tx thất bại -> thử lại vài lần trước khi báo lỗi */
const RECEIPT_MAX_RECHECKS = 5
const RECEIPT_RECHECK_DELAY_MS = 5_000

/* Phải còn đủ thời gian sống của JWT để hoàn tất: ký tx + chờ block + lưu metadata */
const SESSION_MIN_REMAINING_MS = 5 * 60 * 1000

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

/** Chỉ retry khi lỗi mạng / 5xx (RPC của backend có thể chưa thấy tx) */
const shouldRetry = (err: unknown) => isAxiosError(err) && (!err.response || err.response.status >= 500)

/** 401/403: interceptor đã tự logout + toast "session expired" */
const isAuthError = (err: unknown) =>
    isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)

/** Backend báo token đã tồn tại: nếu xảy ra ở lần retry thì lần gửi trước đã lưu thành công (mất response) */
const isAlreadySaved = (err: unknown) =>
    isAxiosError<{ message?: string }>(err) &&
    err.response?.status === 400 &&
    err.response.data?.message === "Token existed."

/** true nếu JWT sắp hết hạn (hoặc không có) -> không cho bắt đầu giao dịch tốn gas */
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

/** Dữ liệu form -> tham số createStandardToken(name, symbol, initialSupply, maxSupply, amountPerMint, mintFee) */
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

    /* stepRef cập nhật đồng bộ -> chặn double-submit trong cùng 1 tick (state chỉ đổi sau khi re-render) */
    const stepRef = React.useRef<CreateTokenStep>("idle")
    const setStep = React.useCallback((next: CreateTokenStep) => {
        stepRef.current = next
        setStepState(next)
    }, [])

    /* Giữ dữ liệu form (kèm File) để bước lưu / retry dùng lại mà không cần nhập lại */
    const inputRef = React.useRef<CreateTokenInput | null>(null)
    /* Chặn gọi POST /tokens chồng nhau (2 request song song -> request sau nhận "Token existed.") */
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
                        success("Token created successfully")
                        return
                    } catch (err) {
                        /* Lần gửi trước đã lưu xong nhưng response bị mất -> coi như thành công */
                        if (attempt > 1 && isAlreadySaved(err)) {
                            setStep("success")
                            success("Token created successfully")
                            return
                        }
                        if (attempt < SAVE_MAX_ATTEMPTS && shouldRetry(err)) {
                            await sleep(SAVE_RETRY_DELAY_MS)
                            continue
                        }
                        const message = getErrorMessage(err, "Failed to save token metadata")
                        setError(`Transaction confirmed on-chain, but saving metadata failed: ${message}`)
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

    /* Bước 3 -> 4: receipt thành công thì mới gọi backend */
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
            fail(RECEIPT_UNCONFIRMED_MESSAGE)
            return
        }
        if (!receipt.isSuccess) return

        if (receipt.data.status !== "success") {
            fail("The transaction reverted on-chain. No token was created.")
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
                fail("Please connect your wallet on Sepolia to create a token")
                return
            }

            /* Tránh trường hợp tx on-chain xong nhưng JWT hết hạn -> không lưu được metadata */
            if (isSessionExpiringSoon()) {
                toastError("Your session is about to expire. Please sign in again before creating a token.")
                return
            }

            setError(null)
            setTxHash(undefined)
            recheckCount.current = 0
            setStep("submitting")

            try {
                const args = buildCreateTokenArgs(input)

                /* Simulate: bắt revert trước khi mở MetaMask, tránh tốn gas cho giao dịch chắc chắn fail */
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
                    /* User chủ động huỷ: đưa form về trạng thái ban đầu */
                    setStep("idle")
                    toastError(message)
                } else {
                    fail(message)
                }
            }
        },
        [address, publicClient, writeContractAsync, fail, toastError, setStep]
    )

    /** Chỉ gọi lại API lưu metadata với txHash cũ */
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
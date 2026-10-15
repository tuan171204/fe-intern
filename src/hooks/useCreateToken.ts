import * as React from "react"
import { isAxiosError } from "axios"
import { parseEther, parseUnits, type Hash } from "viem"
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi"

import { createToken } from "../api/token"
import { EXPLORER_URL, SEPOLIA_CHAIN_ID } from "../config/network"
import { TokenFactoryABI } from "../constants/abi"
import { TOKEN_DECIMALS, TOKEN_FACTORY_ADDRESS } from "../constants/contract"
import { useToast } from "../store/ToastContext"
import { getErrorMessage } from "../utils/api"
import { getCreateTokenErrorMessage } from "../utils/token-errors"
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
    | "submitting" // chờ user xác nhận trong MetaMask
    | "confirming" // đã có txHash, chờ block xác nhận
    | "saving" // POST metadata lên backend
    | "success"
    | "save-failed" // tx đã on-chain nhưng lưu backend lỗi -> cho retry
    | "error"

const SAVE_MAX_ATTEMPTS = 3
const SAVE_RETRY_DELAY_MS = 3000

const sleep = (ms: number) => new Promise<void>((resolve) => window.setTimeout(resolve, ms))

/** Chỉ retry khi lỗi mạng / 5xx (RPC của backend có thể chưa thấy tx) */
const shouldRetry = (err: unknown) => isAxiosError(err) && (!err.response || err.response.status >= 500)

/** 401/403: interceptor đã tự logout + toast "session expired" */
const isAuthError = (err: unknown) =>
    isAxiosError(err) && (err.response?.status === 401 || err.response?.status === 403)

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
    const { writeContractAsync } = useWriteContract()
    const { success, error: toastError } = useToast()

    const [step, setStep] = React.useState<CreateTokenStep>("idle")
    const [txHash, setTxHash] = React.useState<Hash | undefined>(undefined)
    const [error, setError] = React.useState<string | null>(null)

    /* Giữ dữ liệu form (kèm File) để bước lưu / retry dùng lại mà không cần nhập lại */
    const inputRef = React.useRef<CreateTokenInput | null>(null)

    const receipt = useWaitForTransactionReceipt({ hash: txHash, chainId: SEPOLIA_CHAIN_ID })

    const fail = React.useCallback(
        (message: string) => {
            setError(message)
            setStep("error")
            toastError(message)
        },
        [toastError]
    )

    const saveMetadata = React.useCallback(
        async (hash: Hash, input: CreateTokenInput) => {
            setStep("saving")
            setError(null)

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
        },
        [success, toastError]
    )

    /* Bước 3 -> 4: receipt thành công thì mới gọi backend */
    React.useEffect(() => {
        if (step !== "confirming" || !txHash || !inputRef.current) return

        if (receipt.isError) {
            fail(getCreateTokenErrorMessage(receipt.error))
            return
        }
        if (!receipt.isSuccess) return

        if (receipt.data.status !== "success") {
            fail("The transaction reverted on-chain. No token was created.")
            return
        }
        void saveMetadata(txHash, inputRef.current)
    }, [step, txHash, receipt.isError, receipt.isSuccess, receipt.error, receipt.data, fail, saveMetadata])

    const submit = React.useCallback(
        async (input: CreateTokenInput) => {
            setError(null)
            setTxHash(undefined)
            setStep("submitting")

            try {
                const hash = await writeContractAsync({
                    address: TOKEN_FACTORY_ADDRESS,
                    abi: TokenFactoryABI,
                    functionName: "createStandardToken",
                    args: buildCreateTokenArgs(input),
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
        [writeContractAsync, fail, toastError]
    )

    /** Chỉ gọi lại API lưu metadata với txHash cũ */
    const retrySave = React.useCallback(() => {
        if (step !== "save-failed" || !txHash || !inputRef.current) return
        void saveMetadata(txHash, inputRef.current)
    }, [step, txHash, saveMetadata])

    const reset = React.useCallback(() => {
        inputRef.current = null
        setTxHash(undefined)
        setError(null)
        setStep("idle")
    }, [])

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
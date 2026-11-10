import * as React from "react"
import { formatEther, type Address, type Hash } from "viem"
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi"

import { EXPLORER_URL, SEPOLIA_CHAIN_ID } from "../config/network"
import { StandardERC20ABI } from "../constants/erc20-abi"
import i18n from "../i18n"
import { useToast } from "../store/ToastContext"
import { getMintTokenErrorMessage, getReceiptUnconfirmedMessage } from "../utils/token-errors"
import { isUserRejection } from "../utils/web3-errors"

export type MintTokenStep =
    | "idle"
    | "submitting" // pre-flight checks + waiting for the user to confirm in MetaMask
    | "confirming" // txHash received, waiting for block confirmation
    | "success"
    | "error"

/** Error raised by our own pre-flight checks before sending the tx (not an error from the wallet / RPC) */
class MintPreflightError extends Error { }

/* A receipt lookup failure (rate limit, timeout) does NOT mean the tx failed -> retry a few times before reporting */
const RECEIPT_MAX_RECHECKS = 5
const RECEIPT_RECHECK_DELAY_MS = 5_000

export interface UseMintTokenOptions {
    /** Called once after the mint transaction is confirmed successfully */
    onSuccess?: () => void
}

export function useMintToken({ onSuccess }: UseMintTokenOptions = {}) {
    const { address } = useAccount()
    const publicClient = usePublicClient({ chainId: SEPOLIA_CHAIN_ID })
    const { writeContractAsync } = useWriteContract()
    const { success, error: toastError } = useToast()

    const [step, setStepState] = React.useState<MintTokenStep>("idle")
    const [txHash, setTxHash] = React.useState<Hash | undefined>(undefined)
    const [error, setError] = React.useState<string | null>(null)

    /* stepRef updates synchronously -> blocks a double submit within the same tick (state only changes after a re-render) */
    const stepRef = React.useRef<MintTokenStep>("idle")
    const setStep = React.useCallback((next: MintTokenStep) => {
        stepRef.current = next
        setStepState(next)
    }, [])

    const recheckCount = React.useRef(0)

    const onSuccessRef = React.useRef(onSuccess)
    React.useEffect(() => {
        onSuccessRef.current = onSuccess
    })

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

    /* Successful receipt -> report success + refetch; revert -> report error; RPC error -> retry before reporting */
    React.useEffect(() => {
        if (step !== "confirming" || !txHash) return

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
            fail(i18n.t("mint.reverted"))
            return
        }

        setStep("success")
        success(i18n.t("mint.toastSuccess"))
        onSuccessRef.current?.()
    }, [step, txHash, receipt.isError, receipt.isSuccess, receipt.error, receipt.data, refetchReceipt, fail, success, setStep])

    const submit = React.useCallback(
        async (tokenAddress: string) => {
            if (stepRef.current === "submitting" || stepRef.current === "confirming") return

            if (!address || !publicClient) {
                fail(i18n.t("mint.connectToast"))
                return
            }

            const token = tokenAddress as Address
            setError(null)
            setTxHash(undefined)
            recheckCount.current = 0
            setStep("submitting")

            try {
                /* Re-read the latest on-chain numbers (1 multicall) */
                const [totalSupply, maxSupply, amountPerMint, mintFee] = await publicClient.multicall({
                    allowFailure: false,
                    contracts: [
                        { address: token, abi: StandardERC20ABI, functionName: "totalSupply" },
                        { address: token, abi: StandardERC20ABI, functionName: "maxSupply" },
                        { address: token, abi: StandardERC20ABI, functionName: "amountPerMint" },
                        { address: token, abi: StandardERC20ABI, functionName: "mintFee" },
                    ] as const,
                })

                /* Check the supply limit before calling the contract */
                if (totalSupply >= maxSupply) {
                    throw new MintPreflightError(i18n.t("mint.soldOut"))
                }
                if (totalSupply + amountPerMint > maxSupply) {
                    throw new MintPreflightError(i18n.t("mint.remainingTooLow"))
                }

                /* Check the ETH balance: at least mintFee is needed (gas not included) */
                const balance = await publicClient.getBalance({ address })
                if (balance < mintFee) {
                    throw new MintPreflightError(
                        i18n.t("mint.insufficientEth", {
                            fee: formatEther(mintFee),
                            balance: formatEther(balance),
                        })
                    )
                }

                /* Simulate: catch reverts / insufficient ETH before opening MetaMask */
                await publicClient.simulateContract({
                    account: address,
                    address: token,
                    abi: StandardERC20ABI,
                    functionName: "mint",
                    value: mintFee,
                })

                /* Send the real transaction (mint() takes no arguments, and carries the mintFee) */
                const hash = await writeContractAsync({
                    address: token,
                    abi: StandardERC20ABI,
                    functionName: "mint",
                    value: mintFee,
                    chainId: SEPOLIA_CHAIN_ID,
                })

                setTxHash(hash)
                setStep("confirming")
            } catch (err) {
                if (err instanceof MintPreflightError) {
                    fail(err.message)
                } else if (isUserRejection(err)) {
                    /* The user cancelled on purpose: back to the initial state, not treated as an error */
                    setStep("idle")
                    toastError(getMintTokenErrorMessage(err))
                } else {
                    fail(getMintTokenErrorMessage(err))
                }
            }
        },
        [address, publicClient, writeContractAsync, fail, toastError, setStep]
    )

    const reset = React.useCallback(() => {
        recheckCount.current = 0
        setTxHash(undefined)
        setError(null)
        setStep("idle")
    }, [setStep])

    return {
        step,
        txHash,
        error,
        isBusy: step === "submitting" || step === "confirming",
        txUrl: txHash ? `${EXPLORER_URL}/tx/${txHash}` : undefined,
        submit,
        reset,
    }
}
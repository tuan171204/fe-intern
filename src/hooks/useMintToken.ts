import * as React from "react"
import { formatEther, type Address, type Hash } from "viem"
import { useAccount, usePublicClient, useWaitForTransactionReceipt, useWriteContract } from "wagmi"

import { EXPLORER_URL, SEPOLIA_CHAIN_ID } from "../config/network"
import { StandardERC20ABI } from "../constants/erc20-abi"
import { useToast } from "../store/ToastContext"
import { getMintTokenErrorMessage } from "../utils/token-errors"
import { isUserRejection } from "../utils/web3-errors"

export type MintTokenStep =
    | "idle"
    | "submitting" // pre-flight check + chờ user xác nhận trong MetaMask
    | "confirming" // đã có txHash, chờ block xác nhận
    | "success"
    | "error"

/** Lỗi do mình chủ động chặn trước khi gửi tx (không phải lỗi từ ví/RPC) */
class MintPreflightError extends Error { }

export interface UseMintTokenOptions {
    /** Gọi 1 lần sau khi tx mint được xác nhận thành công (vd: refetch dữ liệu on-chain) */
    onSuccess?: () => void
}

export function useMintToken({ onSuccess }: UseMintTokenOptions = {}) {
    const { address } = useAccount()
    const publicClient = usePublicClient({ chainId: SEPOLIA_CHAIN_ID })
    const { writeContractAsync } = useWriteContract()
    const { success, error: toastError } = useToast()

    const [step, setStep] = React.useState<MintTokenStep>("idle")
    const [txHash, setTxHash] = React.useState<Hash | undefined>(undefined)
    const [error, setError] = React.useState<string | null>(null)

    const onSuccessRef = React.useRef(onSuccess)
    React.useEffect(() => {
        onSuccessRef.current = onSuccess
    })

    const receipt = useWaitForTransactionReceipt({ hash: txHash, chainId: SEPOLIA_CHAIN_ID })

    const fail = React.useCallback(
        (message: string) => {
            setError(message)
            setStep("error")
            toastError(message)
        },
        [toastError]
    )

    /* Receipt thành công -> báo thành công + refetch; revert/lỗi RPC -> báo lỗi */
    React.useEffect(() => {
        if (step !== "confirming" || !txHash) return

        if (receipt.isError) {
            fail(getMintTokenErrorMessage(receipt.error))
            return
        }
        if (!receipt.isSuccess) return

        if (receipt.data.status !== "success") {
            fail("The mint transaction reverted on-chain. No tokens were minted.")
            return
        }

        setStep("success")
        success("Minted successfully")
        onSuccessRef.current?.()
    }, [step, txHash, receipt.isError, receipt.isSuccess, receipt.error, receipt.data, fail, success])

    const submit = React.useCallback(
        async (tokenAddress: string) => {
            if (!address || !publicClient) {
                fail("Please connect your wallet on Sepolia to mint")
                return
            }

            const token = tokenAddress as Address
            setError(null)
            setTxHash(undefined)
            setStep("submitting")

            try {
                /* Đọc lại số liệu mới nhất trên chain (1 multicall) */
                const [totalSupply, maxSupply, amountPerMint, mintFee] = await publicClient.multicall({
                    allowFailure: false,
                    contracts: [
                        { address: token, abi: StandardERC20ABI, functionName: "totalSupply" },
                        { address: token, abi: StandardERC20ABI, functionName: "maxSupply" },
                        { address: token, abi: StandardERC20ABI, functionName: "amountPerMint" },
                        { address: token, abi: StandardERC20ABI, functionName: "mintFee" },
                    ] as const,
                })

                /* Kiểm tra giới hạn supply trước khi gọi contract */
                if (totalSupply >= maxSupply) {
                    throw new MintPreflightError("Max supply reached. This token can't be minted any further.")
                }
                if (totalSupply + amountPerMint > maxSupply) {
                    throw new MintPreflightError("The remaining supply is smaller than the amount per mint.")
                }

                /* Kiểm tra số dư ETH: cần ít nhất mintFee (chưa tính gas) */
                const balance = await publicClient.getBalance({ address })
                if (balance < mintFee) {
                    throw new MintPreflightError(
                        `Not enough Sepolia ETH. Minting needs ${formatEther(mintFee)} ETH plus gas, but your balance is ${formatEther(balance)} ETH.`
                    )
                }

                /* Simulate: bắt revert / thiếu ETH trước khi mở MetaMask */
                await publicClient.simulateContract({
                    account: address,
                    address: token,
                    abi: StandardERC20ABI,
                    functionName: "mint",
                    value: mintFee,
                })

                /* Gửi giao dịch thật (mint() không có tham số, kèm mintFee) */
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
                    /* User chủ động huỷ: về trạng thái ban đầu, không coi là lỗi */
                    setStep("idle")
                    toastError(getMintTokenErrorMessage(err))
                } else {
                    fail(getMintTokenErrorMessage(err))
                }
            }
        },
        [address, publicClient, writeContractAsync, fail, toastError]
    )

    const reset = React.useCallback(() => {
        setTxHash(undefined)
        setError(null)
        setStep("idle")
    }, [])

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
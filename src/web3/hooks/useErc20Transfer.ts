import { useEffect, useState } from 'react'
import { useSimulateContract, useWriteContract } from 'wagmi'
import { isAddress, zeroAddress, type Address } from 'viem'
import { erc20Abi } from '../constants/erc20Abi'
import { SEPOLIA_CHAIN_ID } from '../constants/network'
import { getErrorMessage, parseAmount } from '../lib/format'
import { useTxReceipt } from './useTxReceipt'

interface Params {
  /** Ví đang gửi (account đang chọn trong app) */
  owner: Address
  token: Address | undefined
  decimals: number | undefined
  balance: bigint | undefined
  /** Đọc lại số dư token sau khi giao dịch xong */
  refetchInfo: () => unknown
  canTransact: boolean
}

export function useErc20Transfer({ owner, token, decimals, balance, refetchInfo, canTransact }: Params) {
  // useWriteContract: gọi hàm ghi (transfer) của smart contract.
  const {
    writeContract,
    data: hash,
    isPending: isSigning,
    error: writeError,
    reset,
  } = useWriteContract()

  // Theo dõi giao dịch sau khi có hash (xem hooks/useTxReceipt.ts).
  const tx = useTxReceipt(hash, writeError, isSigning)

  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')

  // Xong (thành công hoặc revert) -> đọc lại số dư token.
  const isFinished = tx.isSuccess || tx.receiptFailure?.kind === 'reverted'
  useEffect(() => {
    if (isFinished) void refetchInfo()
  }, [isFinished, refetchInfo])

  // ---- Validate ----
  const validTo = isAddress(toAddress) ? toAddress : undefined
  const value = decimals !== undefined ? parseAmount(amount, decimals) : null

  let toError: string | null = null
  if (toAddress && !validTo) toError = 'Địa chỉ ví không hợp lệ.'

  let amountError: string | null = null
  if (amount && decimals !== undefined) {
    if (value === null) amountError = `Số lượng không hợp lệ (tối đa ${decimals} chữ số thập phân).`
    else if (value === 0n) amountError = 'Số lượng phải lớn hơn 0.'
    else if (balance !== undefined && value > balance) amountError = 'Số dư token không đủ.'
  }

  const isBusy = isSigning || tx.isConfirming
  const canSubmit =
    canTransact &&
    !isBusy &&
    token !== undefined &&
    validTo !== undefined &&
    value !== null &&
    value > 0n &&
    balance !== undefined &&
    value <= balance // chặn gửi khi vượt số dư

  // ---- Kiểm tra trước khi gửi (cảnh báo, không chặn) ----
  // useSimulateContract: chạy thử transfer() trên RPC. Nếu contract sẽ revert thì báo ngay,
  // trước khi người dùng mất phí gas.
  const { error: simulateError } = useSimulateContract({
    address: token ?? zeroAddress,
    abi: erc20Abi,
    functionName: 'transfer',
    args: [validTo ?? zeroAddress, value ?? 0n],
    account: owner,
    chainId: SEPOLIA_CHAIN_ID,
    query: { enabled: canSubmit, retry: false },
  })

  const warnings: string[] = []
  if (simulateError)
    warnings.push(
      `Mô phỏng trước cho thấy giao dịch có thể thất bại: ${getErrorMessage(simulateError)}`,
    )

  const transfer = () => {
    if (!token || !validTo || value === null) return
    reset()
    // Gọi transfer(address to, uint256 amount) — args được kiểm tra kiểu theo ABI.
    // account: gửi đúng từ account đang chọn trong app.
    // Không tự đặt gas/nonce: để MetaMask xử lý.
    writeContract({
      address: token,
      abi: erc20Abi,
      functionName: 'transfer',
      args: [validTo, value],
      chainId: SEPOLIA_CHAIN_ID,
      account: owner,
    })
  }

  return { toAddress, setToAddress, amount, setAmount, toError, amountError, warnings, canSubmit, isBusy, transfer, tx }
}
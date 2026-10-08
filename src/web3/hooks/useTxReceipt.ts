import { useTransactionReceipt, useWaitForTransactionReceipt } from 'wagmi'
import type { Hash } from 'viem'
import { SEPOLIA_CHAIN_ID } from '../constants/network'
import { isReceiptTimeout } from '../lib/tx'
import type { ReceiptFailure, TxState } from '../types'

const RECEIPT_TIMEOUT_MS = 120_000

export function useTxReceipt(hash: Hash | undefined, sendError: Error | null, isSigning: boolean): TxState {
  const wait = useWaitForTransactionReceipt({
    hash,
    chainId: SEPOLIA_CHAIN_ID,
    timeout: RECEIPT_TIMEOUT_MS,
    query: { retry: false }, // revert là kết quả cuối cùng, không retry
  })

  // Chỉ khi chờ receipt bị lỗi mới đọc trực tiếp receipt để phân loại nguyên nhân.
  const direct = useTransactionReceipt({
    hash,
    chainId: SEPOLIA_CHAIN_ID,
    query: { enabled: Boolean(wait.error), retry: false },
  })

  const isClassifying = Boolean(wait.error) && direct.isLoading
  const directStatus = direct.data?.status

  let receiptFailure: ReceiptFailure | null = null
  if (wait.error && !isClassifying) {
    if (directStatus === 'reverted') receiptFailure = { kind: 'reverted' }
    else if (directStatus === 'success') receiptFailure = null // receipt thực ra thành công
    else if (isReceiptTimeout(wait.error)) receiptFailure = { kind: 'timeout' }
    else receiptFailure = { kind: 'error', message: wait.error.message }
  }

  return {
    hash,
    isSigning,
    isConfirming: wait.isLoading || isClassifying,
    isSuccess: (wait.isSuccess && wait.data?.status === 'success') || directStatus === 'success',
    sendError,
    receiptFailure,
  }
}

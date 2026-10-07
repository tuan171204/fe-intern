// hooks/useEthTransfer.ts
// Tính năng 3: số dư Sepolia ETH + form chuyển ETH (state, validate, gửi giao dịch).
import { useEffect, useState } from 'react'
import { useBalance, useBytecode, useEstimateGas, useSendTransaction } from 'wagmi'
import { isAddress, zeroAddress, type Address } from 'viem'
import { SEPOLIA_CHAIN_ID } from '../constants/network'
import { getErrorMessage, parseAmount } from '../lib/format'
import { useTxReceipt } from './useTxReceipt'

export function useEthTransfer(address: Address, canTransact: boolean) {
  // useBalance: số dư ETH native của ví trên Sepolia (tự cache + refetch).
  const {
    data: balance,
    isLoading: isBalanceLoading,
    refetch,
  } = useBalance({ address, chainId: SEPOLIA_CHAIN_ID })

  // useSendTransaction: gửi giao dịch chuyển ETH (hash trả về ngay khi ví ký xong).
  const {
    sendTransaction,
    data: hash,
    isPending: isSigning,
    error: sendError,
    reset,
  } = useSendTransaction()

  // Theo dõi giao dịch sau khi có hash (xem hooks/useTxReceipt.ts).
  const tx = useTxReceipt(hash, sendError, isSigning)

  const [toAddress, setToAddress] = useState('')
  const [amount, setAmount] = useState('')

  // Giao dịch xong (thành công HOẶC revert — revert vẫn bị trừ gas) -> cập nhật lại số dư.
  const isFinished = tx.isSuccess || tx.receiptFailure?.kind === 'reverted'
  useEffect(() => {
    if (isFinished) void refetch()
  }, [isFinished, refetch])

  // ---- Validate (tính trực tiếp trong render, không cần state phụ) ----
  const validTo = isAddress(toAddress) ? toAddress : undefined
  const value = parseAmount(amount, 18)

  let addressError: string | null = null
  if (toAddress && !validTo) addressError = 'Địa chỉ ví không hợp lệ.'

  let amountError: string | null = null
  if (amount) {
    if (value === null) amountError = 'Số lượng không hợp lệ (tối đa 18 chữ số thập phân).'
    else if (value === 0n) amountError = 'Số lượng phải lớn hơn 0.'
    else if (balance && value > balance.value) amountError = 'Số dư ETH không đủ.'
  }

  // ---- Kiểm tra trước khi gửi (cảnh báo, không chặn) ----
  // useBytecode: địa chỉ nhận có code không? (smart contract, hoặc ví đã nâng cấp smart account).
  // Contract có thể từ chối ETH hoặc cần nhiều hơn 21.000 gas => giao dịch revert, vẫn mất phí.
  const { data: recipientCode } = useBytecode({
    address: validTo ?? zeroAddress,
    chainId: SEPOLIA_CHAIN_ID,
    query: { enabled: validTo !== undefined },
  })
  const recipientHasCode = Boolean(recipientCode && recipientCode !== '0x')

  // useEstimateGas: mô phỏng giao dịch. Nếu mô phỏng đã lỗi thì gửi thật nhiều khả năng cũng lỗi.
  const preflightReady = Boolean(
    canTransact && validTo && value !== null && value > 0n && !amountError,
  )
  const { error: estimateError } = useEstimateGas({
    account: address,
    to: validTo ?? zeroAddress,
    value: value ?? 0n,
    chainId: SEPOLIA_CHAIN_ID,
    query: { enabled: preflightReady, retry: false },
  })

  const warnings: string[] = []
  if (validTo && validTo.toLowerCase() === address.toLowerCase())
    warnings.push('Địa chỉ nhận trùng với ví đang gửi.')
  if (recipientHasCode)
    warnings.push(
      'Địa chỉ nhận có mã chạy trên chain (smart contract hoặc ví smart account). Nó có thể từ chối ETH hoặc cần nhiều gas hơn 21.000; khi đó giao dịch bị revert và bạn vẫn mất phí gas.',
    )
  if (estimateError)
    warnings.push(
      `Mô phỏng trước cho thấy giao dịch có thể thất bại: ${getErrorMessage(estimateError)}`,
    )

  const isBusy = isSigning || tx.isConfirming
  const canSubmit =
    canTransact && !isBusy && validTo !== undefined && value !== null && value > 0n && !amountError

  const send = () => {
    if (!validTo || value === null) return
    reset() // xoá trạng thái của giao dịch trước
    // KHÔNG tự đặt gas/nonce: MetaMask ước tính gas limit và quản lý nonce.
    // chainId giúp wagmi từ chối gửi nếu ví đang ở chain khác (ChainMismatchError).
    sendTransaction({ to: validTo, value, chainId: SEPOLIA_CHAIN_ID })
  }

  return {
    balance,
    isBalanceLoading,
    toAddress,
    setToAddress,
    amount,
    setAmount,
    addressError,
    amountError,
    warnings,
    canSubmit,
    isBusy,
    send,
    tx,
  }
}

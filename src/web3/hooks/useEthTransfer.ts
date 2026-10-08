import { useRef, useState } from 'react'
import { useBalance, useBytecode, useEstimateGas, usePublicClient, useSendTransaction } from 'wagmi'
import { isAddress, zeroAddress, type Address } from 'viem'
import { SEPOLIA_CHAIN_ID } from '../constants/network'
import { getErrorMessage, parseAmount, toError } from '../lib/format'
import { useRefetchWhenFinished } from './useRefetchWhenFinished'
import { useTxReceipt } from './useTxReceipt'

// Gas của một lần chuyển ETH thuần tới ví thường (EOA).
const EOA_GAS_LIMIT = 21_000n
// Người nhận có code (smart contract / smart account): cộng thêm 30% trên gas ước tính thực tế.
// Gas thừa được hoàn lại 
const CONTRACT_GAS_BUFFER_PERCENT = 130n

export function useEthTransfer(address: Address, canTransact: boolean) {
  const publicClient = usePublicClient({ chainId: SEPOLIA_CHAIN_ID })

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

  const [toAddress, setToAddressState] = useState('')
  const [amount, setAmountState] = useState('')
  // Đang chạy kiểm tra "ngay trước khi gửi" (đọc code người nhận, ước tính gas, kiểm tra số dư).
  const [isPreparing, setIsPreparing] = useState(false)
  const [preflightError, setPreflightError] = useState<string | null>(null)
  // Chặn double-click: state chỉ cập nhật ở lần render sau, ref thì có hiệu lực ngay.
  const preparingRef = useRef(false)

  const setToAddress = (value: string) => {
    setToAddressState(value)
    setPreflightError(null)
  }
  const setAmount = (value: string) => {
    setAmountState(value)
    setPreflightError(null)
  }

  // Giao dịch xong (thành công hoặc revert — revert vẫn bị trừ gas) -> cập nhật lại số dư.
  const isFinished = tx.isSuccess || tx.receiptFailure?.kind === 'reverted'
  useRefetchWhenFinished(isFinished, refetch)

  const validTo = isAddress(toAddress) ? toAddress : undefined
  const value = parseAmount(amount, 18)

  let addressError: string | null = null
  if (toAddress && !validTo) addressError = 'Địa chỉ ví không hợp lệ (sai định dạng hoặc sai checksum).'

  let amountError: string | null = null
  if (amount) {
    if (value === null) amountError = 'Số lượng không hợp lệ (tối đa 18 chữ số thập phân).'
    else if (value === 0n) amountError = 'Số lượng phải lớn hơn 0.'
    else if (balance && value > balance.value) amountError = 'Số dư ETH không đủ.'
  }

  // useBytecode: địa chỉ nhận có code không? (smart contract, hoặc ví đã nâng cấp smart account).
  // Kết quả này chỉ dùng để cảnh báo + khóa nút trong lúc đang kiểm tra.
  // Quyết định gas thật được lấy lại từ RPC ngay lúc bấm gửi (xem hàm send bên dưới).
  const {
    data: recipientCode,
    isSuccess: isRecipientCodeLoaded,
    isError: isRecipientCodeError,
  } = useBytecode({
    address: validTo ?? zeroAddress,
    chainId: SEPOLIA_CHAIN_ID,
    query: { enabled: validTo !== undefined },
  })
  // Đã nhập địa chỉ hợp lệ nhưng chưa biết nó là ví thường hay contract -> chưa cho gửi.
  const isCheckingRecipient = validTo !== undefined && !isRecipientCodeLoaded && !isRecipientCodeError
  const recipientHasCode = Boolean(recipientCode && recipientCode !== '0x')

  // useEstimateGas: mô phỏng giao dịch để cảnh báo sớm khi người dùng còn đang nhập.
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
  if (validTo === zeroAddress)
    warnings.push('Địa chỉ nhận là địa chỉ 0x000…000 (địa chỉ đốt). ETH gửi tới đây sẽ mất vĩnh viễn.')
  if (recipientHasCode)
    warnings.push(
      'Địa chỉ nhận có mã chạy trên chain (smart contract hoặc ví smart account). Việc nhận ETH có thể tốn nhiều hơn 21.000 gas. Ứng dụng sẽ ước tính gas thực tế trước khi gửi và sẽ chặn giao dịch nếu contract từ chối ETH.',
    )
  if (estimateError)
    warnings.push(
      `Mô phỏng trước cho thấy giao dịch có thể thất bại: ${getErrorMessage(estimateError)}`,
    )

  const isBusy = isSigning || tx.isConfirming || isPreparing
  const canSubmit =
    canTransact &&
    !isBusy &&
    !isCheckingRecipient && // chưa biết người nhận là gì -> chưa cho gửi
    validTo !== undefined &&
    value !== null &&
    value > 0n &&
    balance !== undefined && // chưa biết số dư -> chưa thể xác nhận đủ tiền
    !amountError

  const send = async () => {
    if (!validTo || value === null || !publicClient || preparingRef.current) return
    preparingRef.current = true
    setIsPreparing(true)
    setPreflightError(null)
    reset() // xoá trạng thái của giao dịch trước

    try {
      // Đọc code của người nhận ngay bây giờ
      const code = await publicClient.getCode({ address: validTo })
      const hasCode = Boolean(code && code !== '0x')

      // Ước tính gas thực tế. Nếu node cho biết giao dịch sẽ revert (contract từ chối ETH...),
      // estimateGas ném lỗi -> rơi vào catch, không gửi
      const estimatedGas = await publicClient.estimateGas({ account: address, to: validTo, value })
      const gas = hasCode
        ? (estimatedGas * CONTRACT_GAS_BUFFER_PERCENT) / 100n
        : estimatedGas > EOA_GAS_LIMIT
          ? estimatedGas
          : EOA_GAS_LIMIT

      // Đủ tiền cho cả số lượng gửi lẫn phí gas?
      const [gasPrice, ethBalance] = await Promise.all([
        publicClient.getGasPrice(),
        publicClient.getBalance({ address }),
      ])
      if (value + gas * gasPrice > ethBalance) {
        setPreflightError('Số dư ETH không đủ để trả cả số tiền gửi lẫn phí gas. Hãy giảm số lượng.')
        return
      }

      // - account: gửi đúng từ account đang chọn trong app (có thể khác account đầu tiên của MetaMask).
      // - gas: đặt tường minh vì MetaMask có thể chọn 21.000 cho giao dịch từ dApp.
      // - chainId giúp wagmi từ chối gửi nếu ví đang ở chain khác (ChainMismatchError).
      sendTransaction({
        to: validTo,
        value,
        chainId: SEPOLIA_CHAIN_ID,
        account: address,
        gas,
      })
    } catch (e) {
      setPreflightError(`Không gửi giao dịch vì bước kiểm tra thất bại: ${getErrorMessage(toError(e))}`)
    } finally {
      preparingRef.current = false
      setIsPreparing(false)
    }
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
    preflightError,
    isCheckingRecipient,
    isPreparing,
    canSubmit,
    isBusy,
    send,
    tx,
  }
}
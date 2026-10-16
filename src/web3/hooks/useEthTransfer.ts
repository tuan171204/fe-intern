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
// Gas thừa được hoàn lại (phí chỉ tính theo gas thực dùng) nên đặt dư không tốn thêm.
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

  // Đang chạy kiểm tra "ngay trước khi gửi" 
  const [isPreparing, setIsPreparing] = useState(false)
  const [preflightError, setPreflightError] = useState<string | null>(null)

  // Chặn double-click
  const preparingRef = useRef(false)

  const isBusy = isSigning || tx.isConfirming || isPreparing
  const hasTxActivity = isBusy || Boolean(hash) || Boolean(sendError)

  // Người dùng sửa form sau một giao dịch -> xoá kết quả cũ (từ chối / lỗi / thành công) để không hiển thị lỗi lạc đề.
  const clearStaleResult = () => {
    setPreflightError(null)
    if (!isBusy && (hash || sendError)) reset()
  }
  const setToAddress = (value: string) => {
    setToAddressState(value)
    clearStaleResult()
  }
  const setAmount = (value: string) => {
    setAmountState(value)
    clearStaleResult()
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
  // Người dùng đã nhập số lượng hợp lệ = đang chuẩn bị gửi thật.
  const amountReady = value !== null && value > 0n && !amountError

  // ---- Kiểm tra trước khi gửi ----
  // useBytecode: địa chỉ nhận có code không? (smart contract, hoặc ví đã nâng cấp smart account).
  // Kết quả này chỉ dùng để cảnh báo + khóa nút trong lúc đang kiểm tra.
  // Quyết định gas thật được lấy lại từ RPC ngay lúc bấm gửi (hàm send bên dưới).
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
  // (Nếu query lỗi hẳn thì không khóa nữa: bước kiểm tra lúc bấm gửi sẽ quyết định.)
  const isCheckingRecipient = validTo !== undefined && !isRecipientCodeLoaded && !isRecipientCodeError
  const recipientHasCode = Boolean(recipientCode && recipientCode !== '0x')

  // useEstimateGas: mô phỏng giao dịch để cảnh báo sớm khi người dùng đã nhập đủ thông tin.
  const preflightReady = Boolean(canTransact && validTo && amountReady)
  const { error: estimateError } = useEstimateGas({
    account: address,
    to: validTo ?? zeroAddress,
    value: value ?? 0n,
    chainId: SEPOLIA_CHAIN_ID,
    query: { enabled: preflightReady, retry: false },
  })

  // Chỉ một cảnh báo, theo độ ưu tiên, và chỉ khi nó liên quan tới hành động hiện tại.
  let warning: string | null = null
  if (!hasTxActivity && !preflightError && validTo) {
    if (amountReady && estimateError) {
      warning = `Mô phỏng trước cho thấy giao dịch có thể thất bại: ${getErrorMessage(estimateError)}`
    } else if (validTo === zeroAddress) {
      warning = 'Địa chỉ nhận là địa chỉ đốt 0x000…000. ETH gửi tới đây sẽ mất vĩnh viễn.'
    } else if (validTo.toLowerCase() === address.toLowerCase()) {
      warning = 'Địa chỉ nhận trùng với ví đang gửi.'
    } else if (amountReady && recipientHasCode) {
      warning =
        'Người nhận là smart contract: có thể tốn hơn 21.000 gas hoặc từ chối ETH. Ứng dụng sẽ ước tính gas thực tế và chặn giao dịch nếu sẽ thất bại.'
    }
  }

  const showRecipientCheck = !hasTxActivity && !preflightError && isCheckingRecipient && amountReady

  const canSubmit =
    canTransact &&
    !isBusy &&
    !isCheckingRecipient && // chưa biết người nhận là gì -> chưa cho gửi
    validTo !== undefined &&
    amountReady &&
    balance !== undefined // chưa biết số dư -> chưa thể xác nhận đủ tiền

  const send = async () => {
    if (!validTo || value === null || !publicClient || preparingRef.current) return
    preparingRef.current = true
    setIsPreparing(true)
    setPreflightError(null)
    reset()

    try {
      // 1) Đọc code của người nhận NGAY BÂY GIỜ, không dựa vào kết quả cache của hook.
      const code = await publicClient.getCode({ address: validTo })
      const hasCode = Boolean(code && code !== '0x')

      // Ước tính gas thực tế. Nếu node cho biết giao dịch sẽ revert (contract từ chối ETH...),
      // estimateGas ném lỗi -> rơi vào catch, không gửi, người dùng không mất phí.
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
    warning,
    preflightError,
    showRecipientCheck,
    recipientHasCode,
    isPreparing,
    canSubmit,
    isBusy,
    send,
    tx,
  }
}
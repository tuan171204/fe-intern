import { useRef, useState } from 'react'
import { useBalance, usePublicClient, useSimulateContract, useWriteContract } from 'wagmi'
import { isAddress, zeroAddress, type Address } from 'viem'
import { erc20Abi } from '../constants/erc20Abi'
import { SEPOLIA_CHAIN_ID } from '../constants/network'
import { getErrorMessage, parseAmount, toError } from '../lib/format'
import { useRefetchWhenFinished } from './useRefetchWhenFinished'
import { useTxReceipt } from './useTxReceipt'

interface Params {
  /** Ví đang gửi (account đang chọn trong app) */
  owner: Address
  token: Address | undefined
  decimals: number | undefined
  balance: bigint | undefined
  refetchInfo: () => unknown
  canTransact: boolean
}

export function useErc20Transfer({ owner, token, decimals, balance, refetchInfo, canTransact }: Params) {
  const publicClient = usePublicClient({ chainId: SEPOLIA_CHAIN_ID })

  // Cùng query key với WalletCard / EthCard. Dùng để cập nhật số dư ETH
  // sau khi giao dịch (phí gas trả bằng ETH).
  const { refetch: refetchEthBalance } = useBalance({ address: owner, chainId: SEPOLIA_CHAIN_ID })

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

  const [toAddress, setToAddressState] = useState('')
  const [amount, setAmountState] = useState('')
  const [isPreparing, setIsPreparing] = useState(false)
  const [preflightError, setPreflightError] = useState<string | null>(null)
  const preparingRef = useRef(false)

  const setToAddress = (value: string) => {
    setToAddressState(value)
    setPreflightError(null)
  }
  const setAmount = (value: string) => {
    setAmountState(value)
    setPreflightError(null)
  }

  /** Xoá số lượng + trạng thái giao dịch (gọi khi đổi token để không hiện kết quả của token cũ). */
  const clear = () => {
    reset()
    setAmountState('')
    setPreflightError(null)
  }

  // Xong (thành công hoặc revert) -> đọc lại số dư token và số dư ETH (đã trừ gas).
  const isFinished = tx.isSuccess || tx.receiptFailure?.kind === 'reverted'
  useRefetchWhenFinished(isFinished, refetchInfo)
  useRefetchWhenFinished(isFinished, refetchEthBalance)

  // ---- Validate ----
  const validTo = isAddress(toAddress) ? toAddress : undefined
  const value = decimals !== undefined ? parseAmount(amount, decimals) : null

  let toError_: string | null = null
  if (toAddress && !validTo) toError_ = 'Địa chỉ ví không hợp lệ (sai định dạng hoặc sai checksum).'

  let amountError: string | null = null
  if (amount && decimals !== undefined) {
    if (value === null) amountError = `Số lượng không hợp lệ (tối đa ${decimals} chữ số thập phân).`
    else if (value === 0n) amountError = 'Số lượng phải lớn hơn 0.'
    else if (balance !== undefined && value > balance) amountError = 'Số dư token không đủ.'
  }

  const isBusy = isSigning || tx.isConfirming || isPreparing
  const canSubmit =
    canTransact &&
    !isBusy &&
    token !== undefined &&
    validTo !== undefined &&
    value !== null &&
    value > 0n &&
    balance !== undefined &&
    value <= balance // chặn gửi khi vượt số dư

  // ---- Cảnh báo sớm khi người dùng còn đang nhập (không chặn) ----
  // useSimulateContract: chạy thử transfer() trên RPC. Nếu contract sẽ revert thì báo ngay.
  // Việc chặn gửi được thực hiện lại ở hàm transfer() bên dưới bằng một lần kiểm tra mới.
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
  if (validTo && validTo.toLowerCase() === owner.toLowerCase())
    warnings.push('Địa chỉ nhận trùng với ví đang gửi.')
  if (validTo === zeroAddress)
    warnings.push('Địa chỉ nhận là địa chỉ 0x000…000 (địa chỉ đốt). Token gửi tới đây sẽ mất vĩnh viễn.')
  if (validTo && token && validTo.toLowerCase() === token.toLowerCase())
    warnings.push('Địa chỉ nhận chính là contract của token. Token gửi vào đây thường không thể lấy lại.')
  if (simulateError)
    warnings.push(
      `Mô phỏng trước cho thấy giao dịch có thể thất bại: ${getErrorMessage(simulateError)}`,
    )

  const transfer = async () => {
    if (!token || !validTo || value === null || !publicClient || preparingRef.current) return
    preparingRef.current = true
    setIsPreparing(true)
    setPreflightError(null)
    reset()

    try {
      // Ước tính gas của transfer() ngay bây giờ. Nếu contract sẽ revert (số dư không đủ,
      // token bị chặn, không phải ERC-20...) thì ném lỗi -> không gửi, người dùng không mất phí.
      const gasEstimate = await publicClient.estimateContractGas({
        address: token,
        abi: erc20Abi,
        functionName: 'transfer',
        args: [validTo, value],
        account: owner,
      })

      // Phí gas trả bằng ETH: ví phải còn đủ ETH.
      const [gasPrice, ethBalance] = await Promise.all([
        publicClient.getGasPrice(),
        publicClient.getBalance({ address: owner }),
      ])
      if (gasEstimate * gasPrice > ethBalance) {
        setPreflightError('Ví không đủ Sepolia ETH để trả phí gas cho giao dịch này.')
        return
      }

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
    } catch (e) {
      setPreflightError(`Không gửi giao dịch vì bước kiểm tra thất bại: ${getErrorMessage(toError(e))}`)
    } finally {
      preparingRef.current = false
      setIsPreparing(false)
    }
  }

  return {
    toAddress,
    setToAddress,
    amount,
    setAmount,
    toError: toError_,
    amountError,
    warnings,
    preflightError,
    canSubmit,
    isBusy,
    transfer,
    clear,
    tx,
  }
}
import { BaseError, InsufficientFundsError, UserRejectedRequestError, WaitForTransactionReceiptTimeoutError } from 'viem'

/** Duyệt toàn bộ chuỗi `cause` của lỗi (viem/wagmi/provider đều bọc lỗi lồng nhau). */
function someInCauseChain(error: unknown, predicate: (e: unknown) => boolean): boolean {
  let current: unknown = error
  for (let depth = 0; depth < 10 && current; depth++) {
    if (predicate(current)) return true
    current = typeof current === 'object' ? (current as { cause?: unknown }).cause : undefined
  }
  return false
}

/** Lỗi hết thời gian chờ receipt của viem  */
export function isReceiptTimeout(error: Error): boolean {
  return error instanceof BaseError && Boolean(error.walk((e) => e instanceof WaitForTransactionReceiptTimeoutError))
}

/** Người dùng bấm Reject / đóng popup MetaMask (EIP-1193 code 4001). */
export function isUserRejection(error: unknown): boolean {
  return someInCauseChain(
    error,
    (e) =>
      e instanceof UserRejectedRequestError ||
      (typeof e === 'object' && e !== null && (e as { code?: unknown }).code === 4001),
  )
}

/** Không đủ ETH để trả (số tiền + phí gas). */
export function isInsufficientFunds(error: unknown): boolean {
  return someInCauseChain(error, (e) => {
    if (e instanceof InsufficientFundsError) return true
    const message = typeof e === 'object' && e !== null ? (e as { message?: unknown }).message : undefined
    return typeof message === 'string' && /insufficient funds|exceeds the balance of the account/i.test(message)
  })
}
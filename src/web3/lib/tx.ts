// lib/tx.ts
import { BaseError, WaitForTransactionReceiptTimeoutError } from 'viem'

/** Lỗi hết thời gian chờ receipt của viem (có thể bị bọc trong chuỗi `cause`) */
export function isReceiptTimeout(error: Error): boolean {
  return error instanceof BaseError && Boolean(error.walk((e) => e instanceof WaitForTransactionReceiptTimeoutError))
}

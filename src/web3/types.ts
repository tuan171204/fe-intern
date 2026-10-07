// types.ts
// Kiểu dùng chung giữa các hook và component.
import type { Hash } from 'viem'

/** Lý do một giao dịch ĐÃ có hash nhưng không xác nhận thành công */
export type ReceiptFailure =
  | { kind: 'reverted' } // đã vào block nhưng thực thi thất bại (vẫn mất phí gas)
  | { kind: 'timeout' } // quá thời gian chờ mà chưa thấy receipt
  | { kind: 'error'; message: string } // lỗi khác (RPC...)

/** Trạng thái một giao dịch (dùng chung cho ETH và ERC-20) */
export interface TxState {
  hash?: Hash
  isSigning: boolean // đang chờ người dùng bấm Confirm trong MetaMask
  isConfirming: boolean // đã broadcast, đang chờ block xác nhận
  isSuccess: boolean // receipt.status === 'success'
  sendError: Error | null // lỗi TRƯỚC khi có hash (người dùng từ chối, sai mạng...)
  receiptFailure: ReceiptFailure | null // lỗi SAU khi có hash
}

import { formatUnits, parseUnits } from 'viem'
import { isInsufficientFunds, isUserRejection } from './tx'

/** 0x1234...5678 */
export const shortenAddress = (addr: string): string => `${addr.slice(0, 6)}...${addr.slice(-4)}`

/** Chuẩn hoá giá trị bắt được trong `catch` (có thể không phải Error) thành Error. */
export const toError = (e: unknown): Error => (e instanceof Error ? e : new Error(String(e)))

/**
 * Chuyển chuỗi người dùng nhập ("0.5") thành bigint theo `decimals` (ETH = 18).
 * Trả về null nếu sai định dạng hoặc nhập quá nhiều chữ số thập phân.
 * Chấp nhận "0,01" (dấu phẩy), ".5" và "5.".
 */
export function parseAmount(value: string, decimals: number): bigint | null {
  const v = value.trim().replace(',', '.').replace(/^\./, '0.').replace(/\.$/, '')
  if (!/^\d+(\.\d+)?$/.test(v)) return null
  const fraction = v.split('.')[1] ?? ''
  if (fraction.length > decimals) return null
  return parseUnits(v, decimals)
}

/** Hiển thị số dư gọn gọn: có dấu phân cách hàng nghìn, tối đa 6 chữ số thập phân */
export function formatDisplay(value: bigint, decimals: number, maxFraction = 6): string {
  const places = Math.max(1, maxFraction)
  const [int = '0', frac = ''] = formatUnits(value, decimals).split('.')
  const grouped = BigInt(int).toLocaleString('en-US')
  const trimmed = frac.slice(0, places).replace(/0+$/, '')
  // Số dương rất nhỏ (< 0.000001) -> hiển thị "<0.000001" thay vì "0" gây hiểu nhầm.
  if (value > 0n && grouped === '0' && !trimmed) return `<0.${'0'.repeat(places - 1)}1`
  return trimmed ? `${grouped}.${trimmed}` : grouped
}

/** Thông báo ngắn gọn, thân thiện từ lỗi của viem / wagmi / MetaMask */
export function getErrorMessage(error: Error): string {
  if (isUserRejection(error)) return 'Bạn đã từ chối yêu cầu trong MetaMask.'
  if (isInsufficientFunds(error))
    return 'Số dư ETH không đủ để trả phí gas (hoặc số tiền gửi + phí gas vượt quá số dư).'
  // Cả viem và wagmi đều gắn `shortMessage` (không phải mọi lỗi wagmi là viem.BaseError).
  const short = (error as { shortMessage?: unknown }).shortMessage
  return typeof short === 'string' && short ? short : error.message
}
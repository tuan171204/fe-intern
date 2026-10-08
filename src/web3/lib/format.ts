// lib/format.ts
// Hàm thuần (không phụ thuộc React) để format / parse dữ liệu.
import { BaseError, formatUnits, parseUnits } from 'viem'

/** 0x1234...5678 */
export const shortenAddress = (addr: string): string => `${addr.slice(0, 6)}...${addr.slice(-4)}`

/**
 * Chuyển chuỗi người dùng nhập ("0.5") thành bigint theo `decimals` (ETH = 18).
 * Trả về null nếu sai định dạng hoặc nhập quá nhiều chữ số thập phân.
 */
export function parseAmount(value: string, decimals: number): bigint | null {
  const v = value.trim().replace(',', '.') // "0,01" -> "0.01"
  if (!/^\d+(\.\d+)?$/.test(v)) return null
  const fraction = v.split('.')[1] ?? ''
  if (fraction.length > decimals) return null
  return parseUnits(v, decimals)
}

/** Hiển thị số dư gọn gọn: có dấu phân cách hàng nghìn, tối đa 6 chữ số thập phân */
export function formatDisplay(value: bigint, decimals: number, maxFraction = 6): string {
  const [int = '0', frac = ''] = formatUnits(value, decimals).split('.')
  const grouped = BigInt(int).toLocaleString('en-US')
  const trimmed = frac.slice(0, maxFraction).replace(/0+$/, '')
  // Số dương rất nhỏ (< 0.000001) -> hiển thị "<0.000001" thay vì "0" gây hiểu nhầm.
  if (value > 0n && grouped === '0' && !trimmed) return `<0.${'0'.repeat(maxFraction - 1)}1`
  return trimmed ? `${grouped}.${trimmed}` : grouped
}

/** Lấy message ngắn gọn từ lỗi của viem/wagmi */
export const getErrorMessage = (error: Error): string =>
  error instanceof BaseError ? error.shortMessage : error.message

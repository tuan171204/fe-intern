import { formatUnits } from "viem"

/**
 * Hiển thị số dư gọn: có dấu phân cách hàng nghìn, tối đa `maxFraction` chữ số thập phân.
 * Vd: formatTokenAmount(60285000000000000n, 18) -> "0.060285"
 */
export function formatTokenAmount(value: bigint, decimals: number, maxFraction = 6): string {
    const places = Math.max(1, maxFraction)
    const [int = "0", frac = ""] = formatUnits(value, decimals).split(".")
    const grouped = BigInt(int).toLocaleString("en-US")
    const trimmed = frac.slice(0, places).replace(/0+$/, "")

    // Số dương rất nhỏ -> hiển thị "<0.000001" thay vì "0" gây hiểu nhầm
    if (value > 0n && grouped === "0" && !trimmed) return `<0.${"0".repeat(places - 1)}1`
    return trimmed ? `${grouped}.${trimmed}` : grouped
}
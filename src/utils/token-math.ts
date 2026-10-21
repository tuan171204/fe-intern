export const toBigInt = (value?: string | null): bigint => {
    try {
        return value ? BigInt(value) : 0n
    } catch {
        return 0n
    }
}

/**
 * Tỉ lệ phần trăm của value so với total, bigint với độ chính xác 0.01%
 */
export const percentOf = (value: bigint, total: bigint): number => {
    if (total <= 0n || value <= 0n) return 0
    const basisPoints = (value * 10_000n) / total
    return Math.min(100, Number(basisPoints) / 100)
}

/** 0 -> "0%", 12.5 -> "12.5%", 0.004 -> "<0.01%"  */
export const formatPercent = (percent: number): string => {
    if (percent > 0 && percent < 0.01) return "<0.01%"
    return `${Number(percent.toFixed(2))}%`
}
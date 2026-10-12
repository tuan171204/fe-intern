import { useBalance } from "wagmi"
import type { Address } from "viem"

import { SEPOLIA_CHAIN_ID } from "../config/network"
import { formatTokenAmount } from "../utils/web3-format"

/** Sepolia ~12s / block */
const BALANCE_REFETCH_MS = 12_000

export function useEthBalance(address: Address | undefined) {
    const { data, isLoading, isError, refetch } = useBalance({
        address,
        chainId: SEPOLIA_CHAIN_ID,
        query: {
            enabled: Boolean(address),
            refetchInterval: BALANCE_REFETCH_MS,
        },
    })

    /** Ví dụ: "0.060285 ETH" */
    const formatted = data ? `${formatTokenAmount(data.value, data.decimals)} ${data.symbol}` : undefined

    return { balance: data, formatted, isLoading, isError, refetch }
}
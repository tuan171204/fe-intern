import * as React from "react"
import { zeroAddress, type Address } from "viem"
import { useAccount, useReadContracts } from "wagmi"

import { SEPOLIA_CHAIN_ID } from "../config/network"
import { StandardERC20ABI } from "../constants/erc20-abi"
import type { Token } from "../types/tokens"

/** Sepolia ~12s / block */
const REFETCH_MS = 12_000
const STALE_MS = 6_000

export interface TokenOnchainInfo {
    /** undefined = chưa có dữ liệu (đang tải / call lỗi) */
    totalSupply?: bigint
    /** undefined = chưa connect ví / đang tải / call lỗi */
    balance?: bigint
}

/**
 * Đọc dữ liệu on-chain cho CẢ trang token bằng 2 multicall (mỗi `useReadContracts` = 1 eth_call
 * tới Multicall3):
 *  - totalSupply(): công khai, không phụ thuộc ví
 *  - balanceOf(user): chỉ chạy khi đã connect ví
 */
export function useTokenOnchainData(tokens: Token[]) {
    const { address, isConnecting, isReconnecting } = useAccount()

    const supplyContracts = React.useMemo(
        () =>
            tokens.map(
                (token) =>
                    ({
                        address: token.tokenAddress as Address,
                        abi: StandardERC20ABI,
                        functionName: "totalSupply",
                        chainId: SEPOLIA_CHAIN_ID,
                    }) as const
            ),
        [tokens]
    )

    const balanceContracts = React.useMemo(
        () =>
            tokens.map(
                (token) =>
                    ({
                        address: token.tokenAddress as Address,
                        abi: StandardERC20ABI,
                        functionName: "balanceOf",
                        args: [address ?? zeroAddress],
                        chainId: SEPOLIA_CHAIN_ID,
                    }) as const
            ),
        [tokens, address]
    )

    /* chainId cố định: đọc dữ liệu luôn qua RPC Sepolia */
    const supplyQuery = useReadContracts({
        contracts: supplyContracts,
        query: { enabled: tokens.length > 0, refetchInterval: REFETCH_MS, staleTime: STALE_MS },
    })

    const balanceQuery = useReadContracts({
        contracts: balanceContracts,
        query: { enabled: tokens.length > 0 && !!address, refetchInterval: REFETCH_MS, staleTime: STALE_MS },
    })

    const byAddress = React.useMemo(() => {
        const map: Record<string, TokenOnchainInfo> = {}

        tokens.forEach((token, index) => {
            const supply = supplyQuery.data?.[index]
            const balance = balanceQuery.data?.[index]

            map[token.tokenAddress.toLowerCase()] = {
                totalSupply: supply?.status === "success" ? (supply.result as bigint) : undefined,
                balance: address && balance?.status === "success" ? (balance.result as bigint) : undefined,
            }
        })

        return map
    }, [tokens, supplyQuery.data, balanceQuery.data, address])

    const { refetch: refetchSupply } = supplyQuery
    const { refetch: refetchBalance } = balanceQuery

    const refetch = React.useCallback(async () => {
        await Promise.all([refetchSupply(), address ? refetchBalance() : Promise.resolve()])
    }, [refetchSupply, refetchBalance, address])

    return {
        byAddress,
        isConnected: !!address,
        /** Lần tải đầu của totalSupply  */
        supplyLoading: supplyQuery.isLoading,
        /** Đang khôi phục kết nối ví khi tải trang, hoặc lần tải đầu của balanceOf */
        balanceLoading: isConnecting || isReconnecting || balanceQuery.isLoading,
        isError: supplyQuery.isError || balanceQuery.isError,
        refetch,
    }
}
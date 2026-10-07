// hooks/useErc20Info.ts
// Tính năng 4 (phần đọc): symbol, decimals, balanceOf của một token ERC-20.
import { useReadContracts } from 'wagmi'
import { isAddress, zeroAddress, type Address } from 'viem'
import { erc20Abi } from '../constants/erc20Abi'
import { SEPOLIA_CHAIN_ID } from '../constants/network'

export function useErc20Info(tokenAddress: string, owner: Address) {
  // isAddress là type guard => validToken có kiểu Address (hoặc undefined).
  const validToken = isAddress(tokenAddress) ? tokenAddress : undefined
  const target = validToken ?? zeroAddress // chỉ là giá trị tạm khi query bị tắt

  // useReadContracts: gộp 3 lời gọi đọc thành 1 request (multicall).
  // allowFailure: false -> nếu 1 lời gọi lỗi (vd. địa chỉ không phải ERC-20) cả hook báo lỗi,
  // và kết quả là tuple đã có kiểu: [string, number, bigint].
  const { data, isLoading, isError, refetch } = useReadContracts({
    allowFailure: false,
    contracts: [
      { address: target, abi: erc20Abi, functionName: 'symbol', chainId: SEPOLIA_CHAIN_ID },
      { address: target, abi: erc20Abi, functionName: 'decimals', chainId: SEPOLIA_CHAIN_ID },
      {
        address: target,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [owner],
        chainId: SEPOLIA_CHAIN_ID,
      },
    ],
    // Chỉ gọi khi đã nhập địa chỉ token hợp lệ.
    query: { enabled: validToken !== undefined },
  })

  let tokenError: string | null = null
  if (tokenAddress && !validToken) tokenError = 'Địa chỉ contract không hợp lệ.'
  else if (validToken && isError)
    tokenError = 'Không đọc được token. Contract này có phải ERC-20 trên Sepolia không?'

  return {
    validToken,
    symbol: data?.[0],
    decimals: data?.[1],
    balance: data?.[2],
    isLoading: validToken !== undefined && isLoading,
    tokenError,
    refetch,
  }
}

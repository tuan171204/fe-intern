// constants/network.ts
import { sepolia } from 'wagmi/chains'

/** Chain bắt buộc của dApp (11155111) — giữ kiểu literal để wagmi kiểm tra chặt */
export const SEPOLIA_CHAIN_ID = sepolia.id

/** Etherscan của Sepolia, dùng để tạo link xem giao dịch */
export const EXPLORER_URL = sepolia.blockExplorers.default.url
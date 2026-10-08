import { sepolia } from 'wagmi/chains'

/** Chain bắt buộc của dApp (11155111) */
export const SEPOLIA_CHAIN_ID = sepolia.id

/** Etherscan của Sepolia, dùng để tạo link xem giao dịch */
export const EXPLORER_URL = sepolia.blockExplorers.default.url
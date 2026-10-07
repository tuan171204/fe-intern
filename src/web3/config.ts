// config.ts
// Cấu hình Wagmi: chỉ hỗ trợ Sepolia Testnet (chainId = 11155111) + ví MetaMask.
import { createConfig, fallback, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// RPC riêng (Alchemy/Infura) đặt trong .env.local:
//   VITE_SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/<KEY>
const customRpc = import.meta.env.VITE_SEPOLIA_RPC as string | undefined

export const config = createConfig({
    // Danh sách chain app hỗ trợ. switchChain() chỉ chuyển được sang chain nằm trong danh sách này.
    chains: [sepolia],

    // Connector "injected" nhắm tới MetaMask (window.ethereum).
    connectors: [injected({ target: 'metaMask' })],

    // Transport = cách app đọc dữ liệu on-chain (balance, readContract, receipt...).
    transports: {
        [sepolia.id]: fallback([
            ...(customRpc ? [http(customRpc)] : []),
            http('https://ethereum-sepolia-rpc.publicnode.com'),
            http(),
        ]),
    },
})

// kiểu chainId hợp lệ (chỉ còn 11155111) và các kiểu liên quan.
declare module 'wagmi' {
    interface Register {
        config: typeof config
    }
}
// Config wagmi: chỉ hỗ trợ Sepolia Testnet (chainId = 11155111) + ví MetaMask.
import { createConfig, fallback, http } from "wagmi"
import { sepolia } from "wagmi/chains"
import { injected } from "wagmi/connectors"

// RPC riêng (Alchemy/Infura) đặt trong .env.local: VITE_SEPOLIA_RPC=https://eth-sepolia.g.alchemy.com/v2/<KEY>
const rawRpc = import.meta.env.VITE_SEPOLIA_RPC?.trim()
const customRpc =
    rawRpc && /^https?:\/\//.test(rawRpc) && !rawRpc.includes("YOUR_ALCHEMY_API_KEY") ? rawRpc : undefined

export const wagmiConfig = createConfig({
    // switchChain() chỉ chuyển được sang chain nằm trong danh sách này
    chains: [sepolia],

    // Connector "injected" nhắm tới MetaMask (window.ethereum)
    connectors: [injected({ target: "metaMask" })],

    // Transport = cách app đọc dữ liệu on-chain. Thử lần lượt: RPC riêng -> RPC công khai -> RPC mặc định của chain
    transports: {
        [sepolia.id]: fallback([
            ...(customRpc ? [http(customRpc)] : []),
            http("https://ethereum-sepolia-rpc.publicnode.com"),
            http(),
        ]),
    },
})

// Để mọi hook của wagmi biết chainId hợp lệ (chỉ còn 11155111) và type liên quan
declare module "wagmi" {
    interface Register {
        config: typeof wagmiConfig
    }
}
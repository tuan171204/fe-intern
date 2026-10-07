// config.ts
// Cấu hình Wagmi: chỉ hỗ trợ Sepolia Testnet (chainId = 11155111) + ví MetaMask.
import { createConfig, fallback, http } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

export const config = createConfig({
  // Danh sách chain app hỗ trợ. switchChain() chỉ chuyển được sang chain nằm trong danh sách này.
  chains: [sepolia],

  // Connector "injected" nhắm tới MetaMask (window.ethereum).
  connectors: [injected({ target: 'metaMask' })],

  // Transport = cách app đọc dữ liệu on-chain (balance, readContract, receipt...).
  // RPC public hay bị chậm/rate-limit => không lấy được receipt => UI "load mãi".
  // fallback() tự chuyển sang RPC kế tiếp khi RPC đầu lỗi. Production nên đặt RPC riêng
  // (Alchemy/Infura) lên ĐẦU danh sách: http('https://sepolia.infura.io/v3/<KEY>').
  transports: {
    [sepolia.id]: fallback([http(), http('https://ethereum-sepolia-rpc.publicnode.com')]),
  },
})

// Type safety tuyệt đối: đăng ký config với wagmi để mọi hook tự suy ra
// kiểu chainId hợp lệ (chỉ còn 11155111) và các kiểu liên quan.
declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}

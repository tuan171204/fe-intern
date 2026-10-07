// Providers.tsx
// Bọc toàn bộ app bằng WagmiProvider + QueryClientProvider.
// Wagmi v2 dùng TanStack Query bên dưới để cache/refetch dữ liệu on-chain,
// nên bắt buộc phải có QueryClientProvider nằm trong WagmiProvider.
import type { ReactNode } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { config } from './config'

// Tạo QueryClient ở ngoài component để không bị tạo lại mỗi lần render.
const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
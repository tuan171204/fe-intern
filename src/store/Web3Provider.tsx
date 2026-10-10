import * as React from "react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import NetworkGuard from "../components/web3/NetworkGuard"
import { wagmiConfig } from "../config/web3"

const queryClient = new QueryClient()

const Web3Provider = ({ children }: { children: React.ReactNode }) => (
    <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
            <NetworkGuard />
            {children}
        </QueryClientProvider>
    </WagmiProvider>
)

export { Web3Provider }
export default Web3Provider
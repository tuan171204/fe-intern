/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Sepolia RPC URL riêng (Alchemy/Infura) */
    readonly VITE_SEPOLIA_RPC?: string
    /** Địa chỉ contract TokenFactory trên Sepolia */
    readonly VITE_TOKEN_FACTORY_ADDRESS?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
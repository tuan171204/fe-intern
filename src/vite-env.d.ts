/// <reference types="vite/client" />

interface ImportMetaEnv {
    /** Sepolia RPC URL riêng (Alchemy/Infura) */
    readonly VITE_SEPOLIA_RPC?: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
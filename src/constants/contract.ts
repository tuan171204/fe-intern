import { isAddress, type Address } from "viem"

const rawFactory = import.meta.env.VITE_TOKEN_FACTORY_ADDRESS?.trim()

if (!rawFactory || !isAddress(rawFactory)) {
    throw new Error("Missing or invalid VITE_TOKEN_FACTORY_ADDRESS in .env.local")
}

export const TOKEN_FACTORY_ADDRESS: Address = rawFactory

export const TOKEN_DECIMALS = 18
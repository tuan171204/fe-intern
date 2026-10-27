import { formatEther, formatUnits } from "viem"

import { TOKEN_DECIMALS } from "../../../constants/contract"
import type { TokenOnchainInfo } from "../../../hooks/useTokenOnchainData"
import type { Token } from "../../../types/tokens"
import type { ExportTable } from "../../../utils/export-data"
import { percentOf, toBigInt } from "../../../utils/token-math"

/* Column headers are intentionally English: exported files are data, not UI */
const HEADERS = [
    "Name",
    "Symbol",
    "Token Address",
    "Max Supply",
    "Amount Per Mint",
    "Mint Fee (ETH)",
    "Total Minted",
    "Mint Progress (%)",
    "My Balance",
    "My % of Supply",
]

/** Builds the export table. On-chain values that are not available (e.g. wallet not connected) are left empty. */
export function buildTokenExportTable(tokens: Token[], byAddress: Record<string, TokenOnchainInfo>): ExportTable {
    const rows = tokens.map((token) => {
        const maxSupply = toBigInt(token.maxSupply)
        const info = byAddress[token.tokenAddress.toLowerCase()]
        const totalSupply = info?.totalSupply
        const balance = info?.balance

        return [
            token.name,
            token.symbol,
            token.tokenAddress,
            formatUnits(maxSupply, TOKEN_DECIMALS),
            formatUnits(toBigInt(token.amountPerMint), TOKEN_DECIMALS),
            formatEther(toBigInt(token.mintFee)),
            totalSupply !== undefined ? formatUnits(totalSupply, TOKEN_DECIMALS) : "",
            totalSupply !== undefined ? percentOf(totalSupply, maxSupply) : "",
            balance !== undefined ? formatUnits(balance, TOKEN_DECIMALS) : "",
            balance !== undefined ? percentOf(balance, maxSupply) : "",
        ]
    })

    return { headers: HEADERS, rows }
}
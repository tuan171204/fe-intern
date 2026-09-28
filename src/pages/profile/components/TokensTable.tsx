import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { PROFILE_TOKENS } from "../../../mocks/profile"
import AssetIdentity from "./AssetIdentity"

const TokensTable = () => (
    <Table className="min-w-[560px]">
        <TableHeader>
            <TableRow className="hover:bg-transparent">
                <TableHead className="text-sm text-foreground">Token</TableHead>
                <TableHead className="text-center text-sm">Balance</TableHead>
                <TableHead className="text-center text-sm">% of Supply</TableHead>
                <TableHead className="text-right text-sm">Total of Supply</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {PROFILE_TOKENS.map((token) => (
                <TableRow key={token.id}>
                    <TableCell>
                        <AssetIdentity {...token} />
                    </TableCell>
                    <TableCell className="text-center font-semibold">{token.balance}</TableCell>
                    <TableCell className="text-center font-semibold">{token.supplyPercent}%</TableCell>
                    <TableCell className="text-right font-semibold">{token.totalSupply}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

export default TokensTable      
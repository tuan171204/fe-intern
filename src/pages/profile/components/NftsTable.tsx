import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { PROFILE_NFTS } from "../../../mocks/profile"
import AssetIdentity from "./AssetIdentity"

const NftsTable = () => (
    <Table className="min-w-[480px]">
        <TableHeader>
            <TableRow className="hover:bg-transparent">
                <TableHead className="text-sm text-foreground">NFT</TableHead>
                <TableHead className="text-center text-sm">% of Supply</TableHead>
                <TableHead className="text-right text-sm">Total of Supply</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            {PROFILE_NFTS.map((nft) => (
                <TableRow key={nft.id}>
                    <TableCell>
                        <AssetIdentity {...nft} />
                    </TableCell>
                    <TableCell className="text-center font-semibold">{nft.supplyPercent}%</TableCell>
                    <TableCell className="text-right font-semibold">{nft.totalSupply}</TableCell>
                </TableRow>
            ))}
        </TableBody>
    </Table>
)

export default NftsTable
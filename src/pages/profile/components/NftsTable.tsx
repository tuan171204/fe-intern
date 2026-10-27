import { useTranslation } from "react-i18next"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { PROFILE_NFTS } from "../../../mocks/profile"
import AssetIdentity from "./AssetIdentity"

const NftsTable = () => {
    const { t } = useTranslation()

    return (
        <Table className="min-w-[480px]">
            <TableHeader>
                <TableRow className="hover:bg-transparent">
                    <TableHead className="text-sm text-foreground">{t("profile.nftsTable.nft")}</TableHead>
                    <TableHead className="text-center text-sm">{t("profile.nftsTable.supplyPercent")}</TableHead>
                    <TableHead className="text-right text-sm">{t("profile.nftsTable.totalSupply")}</TableHead>
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
}

export default NftsTable
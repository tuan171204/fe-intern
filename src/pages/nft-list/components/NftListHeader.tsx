import { useTranslation } from "react-i18next"

import cn from "../../../utils/cn"
import { NFT_GRID_COLS } from "./grid"

const CENTERED_KEYS = ["nftList.supplyPercent", "nftList.mintProgress", "nftList.action"] as const

/* Only shown from Tablet up; on mobile each cell has its own label */
const NftListHeader = () => {
    const { t } = useTranslation()

    return (
        <div role="rowgroup" className="hidden md:block">
            <div
                role="row"
                className={cn("grid items-center gap-4 rounded-lg bg-background px-4 py-4 text-sm", NFT_GRID_COLS)}
            >
                <span role="columnheader">{t("nftList.nft")}</span>
                {CENTERED_KEYS.map((key) => (
                    <span key={key} role="columnheader" className="text-center">
                        {t(key)}
                    </span>
                ))}
            </div>
        </div>
    )
}

export default NftListHeader
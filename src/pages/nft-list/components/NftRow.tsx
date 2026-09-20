import { Avatar } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { CopyAddress } from "../../../components/ui/copy-address"
import { Progress } from "../../../components/ui/progress"
import type { NftItem } from "../../../mocks/nfts"
import cn from "../../../utils/cn"
import { NFT_GRID_COLS } from "./grid"

const MobileLabel = ({ children }: { children: string }) => (
    <span className="text-xs text-muted-foreground md:hidden">{children}</span>
)

const NftRow = ({ nft, onMint }: { nft: NftItem; onMint: (nft: NftItem) => void }) => (
    <div role="row" className={cn("grid grid-cols-2 items-center gap-3 p-4 md:gap-4", NFT_GRID_COLS)}>
        <div role="cell" className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
            <Avatar src={nft.avatar} fallback={nft.name} alt={nft.name} size="lg" className="size-10" />
            <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate text-sm font-semibold">{nft.name}</p>
                <CopyAddress address={nft.address} head={8} tail={6} className="text-xs text-foreground" />
            </div>
        </div>

        <div role="cell" className="col-span-2 flex flex-col gap-0.5 md:col-span-1 md:items-center">
            <MobileLabel>% of Supply</MobileLabel>
            <span className="text-sm font-semibold">{nft.supplyPercent}%</span>
        </div>

        <div role="cell" className="col-span-2 flex flex-col gap-1.5 md:col-span-1">
            <MobileLabel>Mint Progress</MobileLabel>
            <Progress value={nft.mintProgress} aria-label={`Mint progress of ${nft.name}`} className="h-2 bg-teal-50" />
        </div>

        <div role="cell" className="col-span-2 md:col-span-1 md:flex md:justify-center">
            <Button
                variant="outline"
                aria-label={`Mint ${nft.name}`}
                onClick={() => onMint(nft)}
                className="h-9 w-full rounded-full border-teal-600 px-8 text-teal-600 shadow-none hover:bg-teal-50 hover:text-teal-700 md:w-auto"
            >
                Mint
            </Button>
        </div>
    </div>
)

export default NftRow
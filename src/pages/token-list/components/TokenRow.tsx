// File: src/pages/token-list/components/TokenRow.tsx
import { Avatar } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { CopyAddress } from "../../../components/ui/copy-address"
import { Progress } from "../../../components/ui/progress"
import type { Token } from "../../../types/tokens"
import cn from "../../../utils/cn"
import { getImageUrl } from "../../../utils/api"
import { TOKEN_GRID_COLS } from "./grid"
import { MINT_PROGRESS } from "./mint-config"

const MobileLabel = ({ children }: { children: string }) => (
    <span className="text-xs text-muted-foreground md:hidden">{children}</span>
)

const formatNumber = (value: number) => value.toLocaleString("en-US")

export interface TokenRowProps {
    token: Token
    /** Click vào row: mở popup chi tiết token (GET /tokens/:id) */
    onSelect: (tokenId: string) => void
    /** Click nút Mint: mở popup mint */
    onMint: (token: Token) => void
}

const TokenRow = ({ token, onSelect, onMint }: TokenRowProps) => {
    const fullyMinted = MINT_PROGRESS >= 100

    return (
        <div
            role="row"
            onClick={() => onSelect(token._id)}
            className={cn("grid cursor-pointer grid-cols-2 items-center gap-3 p-4 md:gap-4", TOKEN_GRID_COLS)}
        >
            <div role="cell" className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
                <Avatar src={getImageUrl(token.image)} fallback={token.name} alt={token.name} size="lg" className="size-12" />
                <div className="flex min-w-0 flex-col gap-0.5">
                    <p className="truncate">
                        <span className="text-base font-semibold">{token.name}</span>{" "}
                        <span className="text-sm text-muted-foreground">{token.symbol}</span>
                    </p>
                    {/* Tránh click vào nút copy làm mở popup */}
                    <div onClick={(e) => e.stopPropagation()} className="w-fit max-w-full">
                        <CopyAddress address={token._id} head={8} tail={6} className="text-xs text-foreground" />
                    </div>
                </div>
            </div>

            <div role="cell" className="flex flex-col gap-0.5 md:items-center">
                <MobileLabel>Balance</MobileLabel>
                <span className="text-base font-semibold">{formatNumber(token.supply)}</span>
            </div>

            <div role="cell" className="flex flex-col gap-0.5 md:items-center">
                <MobileLabel>% of Supply</MobileLabel>
                <span className="text-base font-semibold">100%</span>
            </div>

            <div role="cell" className="col-span-2 flex flex-col gap-1.5 md:col-span-1">
                <MobileLabel>Mint Progress</MobileLabel>
                <Progress value={MINT_PROGRESS} aria-label={`Mint progress of ${token.name}`} className="h-2 bg-teal-50" />
            </div>

            <div role="cell" className="col-span-2 md:col-span-1 md:flex md:justify-center">
                <Button
                    variant="outline"
                    disabled={fullyMinted}
                    aria-label={fullyMinted ? `${token.name} is fully minted` : `Mint ${token.name}`}
                    onClick={(e) => {
                        e.stopPropagation()
                        onMint(token)
                    }}
                    className="h-9 w-full rounded-full border-teal-600 px-8 text-teal-600 shadow-none hover:bg-teal-50 hover:text-teal-700 md:w-auto"
                >
                    {fullyMinted ? "Minted" : "Mint"}
                </Button>
            </div>
        </div>
    )
}

export default TokenRow
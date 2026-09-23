import { Avatar } from "../../../components/ui/avatar"
import { Button } from "../../../components/ui/button"
import { CopyAddress } from "../../../components/ui/copy-address"
import { Progress } from "../../../components/ui/progress"
import type { TokenItem } from "../../../mocks/tokens"
import cn from "../../../utils/cn"
import { TOKEN_GRID_COLS } from "./grid"

const MobileLabel = ({ children }: { children: string }) => (
    <span className="text-xs text-muted-foreground md:hidden">{children}</span>
)

const TokenRow = ({ token, onMint }: { token: TokenItem; onMint: (token: TokenItem) => void }) => (
    <div role="row" className={cn("grid grid-cols-2 items-center gap-3 p-4 md:gap-4", TOKEN_GRID_COLS)}>
        <div role="cell" className="col-span-2 flex min-w-0 items-center gap-3 md:col-span-1">
            <Avatar src={token.avatar} fallback={token.name} alt={token.name} size="lg" className="size-12" />
            <div className="flex min-w-0 flex-col gap-0.5">
                <p className="truncate">
                    <span className="text-base font-semibold">{token.name}</span>{" "}
                    <span className="text-sm text-muted-foreground">{token.symbol}</span>
                </p>
                <CopyAddress address={token.address} head={8} tail={6} className="text-xs text-foreground" />
            </div>
        </div>

        <div role="cell" className="flex flex-col gap-0.5 md:items-center">
            <MobileLabel>Balance</MobileLabel>
            <span className="text-base font-semibold">{token.balance}</span>
        </div>

        <div role="cell" className="flex flex-col gap-0.5 md:items-center">
            <MobileLabel>% of Supply</MobileLabel>
            <span className="text-base font-semibold">{token.supplyPercent}%</span>
        </div>

        <div role="cell" className="col-span-2 flex flex-col gap-1.5 md:col-span-1">
            <MobileLabel>Mint Progress</MobileLabel>
            <Progress
                value={token.mintProgress}
                aria-label={`Mint progress of ${token.name}`}
                className="h-2 bg-teal-50"
            />
        </div>

        <div role="cell" className="col-span-2 md:col-span-1 md:flex md:justify-center">
            <Button
                variant="outline"
                aria-label={`Mint ${token.name}`}
                onClick={() => onMint(token)}
                className="h-9 w-full rounded-full border-teal-600 px-8 text-teal-600 shadow-none hover:bg-teal-50 hover:text-teal-700 md:w-auto"
            >
                Mint
            </Button>
        </div>
    </div>
)

export default TokenRow
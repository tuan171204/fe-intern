import { Skeleton } from "../../../components/ui/skeleton"
import cn from "../../../utils/cn"
import { TOKEN_GRID_COLS } from "./grid"

/** Placeholder khi đang tải danh sách token, cùng grid với TokenRow */
const TokenRowSkeleton = () => (
    <div
        role="row"
        aria-busy="true"
        className={cn("grid grid-cols-2 items-center gap-3 p-4 md:gap-4", TOKEN_GRID_COLS)}
    >
        <div role="cell" className="col-span-2 flex items-center gap-3 md:col-span-1">
            <Skeleton className="size-12 rounded-full" />
            <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-3 w-36" />
            </div>
        </div>
        <div role="cell" className="flex flex-col gap-1.5 md:items-center">
            <Skeleton className="h-5 w-14" />
        </div>
        <div role="cell" className="flex flex-col gap-1.5 md:items-center">
            <Skeleton className="h-5 w-10" />
        </div>
        <div role="cell" className="col-span-2 md:col-span-1">
            <Skeleton className="h-2 w-full rounded-full" />
        </div>
        <div role="cell" className="col-span-2 md:col-span-1 md:flex md:justify-center">
            <Skeleton className="h-9 w-full rounded-full md:w-28" />
        </div>
    </div>
)

export default TokenRowSkeleton
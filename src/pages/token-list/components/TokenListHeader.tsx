import cn from "../../../utils/cn"
import { TOKEN_GRID_COLS } from "./grid"

const CENTERED = ["Balance", "% of Supply", "Mint Progress", "Action"]

/* Chỉ hiện từ Tablet; mobile mỗi ô tự có nhãn riêng */
const TokenListHeader = () => (
    <div role="rowgroup" className="hidden md:block">
        <div
            role="row"
            className={cn("grid items-center gap-4 rounded-lg bg-background px-4 py-4 text-sm", TOKEN_GRID_COLS)}
        >
            <span role="columnheader">Tokens</span>
            {CENTERED.map((label) => (
                <span key={label} role="columnheader" className="text-center">
                    {label}
                </span>
            ))}
        </div>
    </div>
)

export default TokenListHeader
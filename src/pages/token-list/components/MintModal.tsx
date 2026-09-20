import { Button } from "../../../components/ui/button"
import { Dialog } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import type { TokenItem } from "../../../mocks/tokens"

export interface MintModalProps {
    token: TokenItem | null
    onClose: () => void
}

const readOnlyField = "text-muted-foreground read-only:hover:border-transparent"

const MintModal = ({ token, onClose }: MintModalProps) => (
    <Dialog isOpen={!!token} onClose={onClose} title={token ? `${token.name} Token` : undefined}>
        {token && (
            <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                <Input label="Amount Per Mint" readOnly value={token.amountPerMint} className={readOnlyField} />
                <Input
                    label="Mint Fee"
                    readOnly
                    value={token.mintFee}
                    className={readOnlyField}
                    endAdornment={<span className="text-xs text-muted-foreground">ZKN</span>}
                />
                <Button type="submit" className="mt-2 h-12 w-full rounded-full bg-teal-600 font-normal text-white hover:bg-teal-700">
                    Mint
                </Button>
            </form>
        )}
    </Dialog>
)

export default MintModal
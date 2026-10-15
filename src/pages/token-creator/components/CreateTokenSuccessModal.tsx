import { Button } from "../../../components/ui/button"
import { Dialog } from "../../../components/ui/dialog"

export interface CreateTokenSuccessModalProps {
    isOpen: boolean
    tokenName: string
    tokenSymbol: string
    txUrl?: string
    onViewTokens: () => void
    /** Đóng modal / tạo token khác */
    onClose: () => void
}

const CreateTokenSuccessModal = ({
    isOpen,
    tokenName,
    tokenSymbol,
    txUrl,
    onViewTokens,
    onClose,
}: CreateTokenSuccessModalProps) => (
    <Dialog isOpen={isOpen} onClose={onClose} title="Token Created">
        <div className="flex flex-col gap-4 text-center">
            <p className="text-sm">
                <span className="font-semibold">{tokenName}</span>{" "}
                <span className="text-muted-foreground">({tokenSymbol})</span> has been deployed and saved successfully.
            </p>

            {txUrl && (
                <a
                    href={txUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-medium text-teal-600 underline underline-offset-2 hover:text-teal-700"
                >
                    View transaction on Etherscan
                </a>
            )}

            <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" onClick={onClose} className="h-10 flex-1 rounded-full">
                    Create another
                </Button>
                <Button onClick={onViewTokens} className="h-10 flex-1 rounded-full bg-teal-600 text-white hover:bg-teal-700">
                    View my tokens
                </Button>
            </div>
        </div>
    </Dialog>
)

export default CreateTokenSuccessModal
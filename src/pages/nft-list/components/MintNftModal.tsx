import * as React from "react"

import { Dialog } from "../../../components/ui/dialog"
import { Dropzone } from "../../../components/ui/dropzone"
import { Input } from "../../../components/ui/input"
import { SubmitButton } from "../../../components/ui/submit-button"
import type { NftItem } from "../../../mocks/nfts"

export interface MintNftModalProps {
    nft: NftItem | null
    onClose: () => void
}

const MintNftModal = ({ nft, onClose }: MintNftModalProps) => {
    const [file, setFile] = React.useState<File | null>(null)
    const [touched, setTouched] = React.useState(false)
    const [feeWarning, setFeeWarning] = React.useState<string | undefined>(undefined)

    const handleClose = () => {
        setFile(null)
        setTouched(false)
        setFeeWarning(undefined)
        onClose()
    }

    const fileError = touched && !file ? "Please select a .csv file containing the mint list" : undefined

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setTouched(true)
        if (!file) return

        handleClose()
    }

    return (
        <Dialog isOpen={!!nft} onClose={handleClose} title={nft ? `${nft.name} NFT` : undefined}>
            {nft && (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                    <Dropzone
                        accept=".csv,text/csv"
                        label={file?.name ?? "Drag and drop your files to upload"}
                        hint=".csv"
                        error={fileError}
                        onFilesSelected={([selected]) => {
                            setFile(selected)
                            setTouched(true)
                        }}
                        className="py-8"
                    />
                    <Input
                        label="Mint Fee"
                        readOnly
                        value={nft.mintFee}
                        className="text-muted-foreground read-only:hover:border-transparent cursor-not-allowed"
                        endAdornment={<span className="text-xs text-muted-foreground">ZKN</span>}
                        onClick={() => setFeeWarning("You are not allowed to change the mint fee")}
                        onFocus={() => setFeeWarning("You are not allowed to change the mint fee")}
                        error={feeWarning}
                    />
                    <SubmitButton className="mt-2">Mint</SubmitButton>
                </form>
            )}
        </Dialog>
    )
}

export default MintNftModal
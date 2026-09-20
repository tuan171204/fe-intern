import * as React from "react"

import { Button } from "../../../components/ui/button"
import { Dialog } from "../../../components/ui/dialog"
import { Dropzone } from "../../../components/ui/dropzone"
import { Input } from "../../../components/ui/input"
import type { NftItem } from "../../../mocks/nfts"

export interface MintNftModalProps {
    nft: NftItem | null
    onClose: () => void
}

const MintNftModal = ({ nft, onClose }: MintNftModalProps) => {
    const [file, setFile] = React.useState<File | null>(null)

    const handleClose = () => {
        setFile(null)
        onClose()
    }

    return (
        <Dialog isOpen={!!nft} onClose={handleClose} title={nft ? `${nft.name} NFT` : undefined}>
            {nft && (
                <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
                    <Dropzone
                        accept=".csv,text/csv"
                        label={file?.name ?? "Drag and drop your files to upload"}
                        hint=".csv"
                        onFilesSelected={([selected]) => setFile(selected)}
                        className="py-8"
                    />
                    <Input
                        label="Mint Fee"
                        readOnly
                        value={nft.mintFee}
                        className="text-muted-foreground read-only:hover:border-transparent"
                        endAdornment={<span className="text-xs text-muted-foreground">ZKN</span>}
                    />
                    <Button type="submit" className="mt-2 h-12 w-full rounded-full bg-teal-600 font-normal text-white hover:bg-teal-700">
                        Mint
                    </Button>
                </form>
            )}
        </Dialog>
    )
}

export default MintNftModal
import * as React from "react"
import { useTranslation } from "react-i18next"

import { Dialog } from "../../../components/ui/dialog"
import { Dropzone } from "../../../components/ui/dropzone"
import { Input } from "../../../components/ui/input"
import { SubmitButton } from "../../../components/ui/submit-button"
import type { NftItem } from "../../../mocks/nfts"
import { useToast } from "../../../store/ToastContext"

export interface MintNftModalProps {
    nft: NftItem | null
    onClose: () => void
}

const MintNftModal = ({ nft, onClose }: MintNftModalProps) => {
    const { t } = useTranslation()
    const [file, setFile] = React.useState<File | null>(null)
    const [touched, setTouched] = React.useState(false)
    /* Flag instead of a message so the warning follows the language switch */
    const [feeLocked, setFeeLocked] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)
    const { success } = useToast()

    const handleClose = () => {
        setFile(null)
        setTouched(false)
        setFeeLocked(false)
        setSubmitting(false)
        onClose()
    }

    const fileError = touched && !file ? t("nftList.modal.fileRequired") : undefined

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setTouched(true)
        if (!file || !nft) return

        setSubmitting(true)
        // Simulated mint call (real API not connected yet)
        window.setTimeout(() => {
            setSubmitting(false)
            success(t("nftList.modal.success", { name: nft.name }))
            handleClose()
        }, 600)
    }

    return (
        <Dialog
            isOpen={!!nft}
            onClose={handleClose}
            title={nft ? t("nftList.modal.title", { name: nft.name }) : undefined}
        >
            {nft && (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                    <Dropzone
                        accept=".csv,text/csv"
                        label={file?.name ?? t("nftList.modal.dropLabel")}
                        hint=".csv"
                        error={fileError}
                        onFilesSelected={([selected]) => {
                            setFile(selected)
                            setTouched(true)
                        }}
                        className="py-8"
                    />
                    <Input
                        label={t("nftList.modal.mintFee")}
                        readOnly
                        value={nft.mintFee}
                        className="text-muted-foreground read-only:hover:border-transparent cursor-not-allowed"
                        endAdornment={<span className="text-xs text-muted-foreground">ZKN</span>}
                        onClick={() => setFeeLocked(true)}
                        onFocus={() => setFeeLocked(true)}
                        error={feeLocked ? t("nftList.modal.feeLocked") : undefined}
                    />
                    <SubmitButton loading={submitting} disabled={submitting} className="mt-2">
                        {t("nftList.modal.button")}
                    </SubmitButton>
                </form>
            )}
        </Dialog>
    )
}

export default MintNftModal
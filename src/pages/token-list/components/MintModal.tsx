import * as React from "react"

import { Dialog } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { SubmitButton } from "../../../components/ui/submit-button"
import type { TokenItem } from "../../../mocks/tokens"
import { useToast } from "../../../store/ToastContext"

export interface MintModalProps {
    token: TokenItem | null
    onClose: () => void
}

const readOnlyField = "text-muted-foreground read-only:hover:border-transparent cursor-not-allowed"

const MintModal = ({ token, onClose }: MintModalProps) => {
    const [quantity, setQuantity] = React.useState("1")
    const [touched, setTouched] = React.useState(false)
    const [feeWarning, setFeeWarning] = React.useState<string | undefined>(undefined)
    const [amountWarning, setAmountWarning] = React.useState<string | undefined>(undefined)
    const [submitting, setSubmitting] = React.useState(false)
    const { success } = useToast()

    React.useEffect(() => {
        setQuantity("1")
        setTouched(false)
        setFeeWarning(undefined)
        setAmountWarning(undefined)
        setSubmitting(false)
    }, [token])

    const handleClose = () => {
        setFeeWarning(undefined)
        setAmountWarning(undefined)
        onClose()
    }

    const quantityNum = Number(quantity)
    const isQuantityValid = quantity.trim() !== "" && Number.isInteger(quantityNum) && quantityNum > 0
    const error = touched && !isQuantityValid ? "Quantity must be a positive integer" : undefined

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setTouched(true)
        if (!isQuantityValid || !token) return

        setSubmitting(true)
        // Giả lập gọi API mint (chưa nối API thật)
        window.setTimeout(() => {
            setSubmitting(false)
            success(`Minted ${quantityNum} ${token.name} successfully`)
            handleClose()
        }, 600)
    }

    const totalFee = token && isQuantityValid ? (Number(token.mintFee) * quantityNum).toFixed(3) : token?.mintFee ?? "0"

    return (
        <Dialog isOpen={!!token} onClose={handleClose} title={token ? `${token.name} Token` : undefined}>
            {token && (
                <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
                    <Input
                        label="Quantity"
                        required
                        type="number"
                        inputMode="numeric"
                        min={1}
                        value={quantity}
                        onChange={(e) => {
                            setQuantity(e.target.value)
                            setTouched(true)
                        }}
                        error={error}
                    />
                    <Input
                        label="Amount Per Mint"
                        readOnly
                        value={token.amountPerMint}
                        className={readOnlyField}
                        onClick={() => setAmountWarning("You are not allowed to change the amount per mint")}
                        onFocus={() => setAmountWarning("You are not allowed to change the amount per mint")}
                        error={amountWarning}
                    />
                    <Input
                        label="Total Mint Fee"
                        readOnly
                        value={totalFee}
                        className={readOnlyField}
                        endAdornment={<span className="text-xs text-muted-foreground">ZKN</span>}
                        onClick={() => setFeeWarning("You are not allowed to change the mint fee")}
                        onFocus={() => setFeeWarning("You are not allowed to change the mint fee")}
                        error={feeWarning}
                    />
                    <SubmitButton loading={submitting} disabled={submitting} className="mt-2">
                        Mint
                    </SubmitButton>
                </form>
            )}
        </Dialog>
    )
}

export default MintModal
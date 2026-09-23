import type { FormEvent } from "react"

import { Input } from "../../../components/ui/input"
import { SubmitButton } from "../../../components/ui/submit-button"
import { useFormValidation } from "../../../hooks/useFormValidation"

const NAME_MAX = 32
const SYMBOL_MAX = 8

type NftFormValues = {
    name: string
    symbol: string
    totalSupply: string
}

const INITIAL_VALUES: NftFormValues = { name: "", symbol: "", totalSupply: "" }

const validate = (values: NftFormValues) => {
    const errors: Partial<Record<keyof NftFormValues, string>> = {}

    if (!values.name.trim()) errors.name = "Collection name is required"
    else if (values.name.length > NAME_MAX) errors.name = `Maximum ${NAME_MAX} characters allowed`

    if (!values.symbol.trim()) errors.symbol = "Symbol is required"
    else if (values.symbol.length > SYMBOL_MAX) errors.symbol = `Maximum ${SYMBOL_MAX} characters allowed`

    const supplyNum = Number(values.totalSupply)
    if (!values.totalSupply.trim()) errors.totalSupply = "Total supply is required"
    else if (!Number.isInteger(supplyNum) || supplyNum <= 0) errors.totalSupply = "Total supply must be a positive integer"

    return errors
}

const NftCollectionForm = () => {
    const { values, setField, fieldError, errors, touchAll, reset } = useFormValidation(INITIAL_VALUES, validate)

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        touchAll()
        if (Object.keys(errors).length > 0) return

        reset()
    }

    return (
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 [&_label]:text-xs [&_label]:font-medium">
            <div className="grid gap-5 sm:grid-cols-2">
                <Input
                    label="Name"
                    required
                    maxLength={NAME_MAX}
                    placeholder="Ex: Zoken"
                    hint="Max 32 characters in your name"
                    value={values.name}
                    onChange={(e) => setField("name", e.target.value)}
                    error={fieldError("name")}
                />
                <Input
                    label="Symbol"
                    required
                    maxLength={SYMBOL_MAX}
                    placeholder="Ex: ZKN"
                    hint="Max 8 characters in your symbol"
                    value={values.symbol}
                    onChange={(e) => setField("symbol", e.target.value)}
                    error={fieldError("symbol")}
                />
            </div>

            <Input
                label="Total Supply"
                required
                type="number"
                inputMode="numeric"
                placeholder="1"
                hint="Most token use 10B"
                value={values.totalSupply}
                onChange={(e) => setField("totalSupply", e.target.value)}
                error={fieldError("totalSupply")}
            />

            <SubmitButton className="h-11">Create</SubmitButton>
        </form>
    )
}

export default NftCollectionForm
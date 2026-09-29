// File: src/pages/token-creator/components/TokenForm.tsx
import * as React from "react"
import { useNavigate } from "react-router-dom"

import { createToken } from "../../../api/token"
import { Dropzone } from "../../../components/ui/dropzone"
import { Input } from "../../../components/ui/input"
import { SubmitButton } from "../../../components/ui/submit-button"
import { Textarea } from "../../../components/ui/textarea"
import { useFormValidation } from "../../../hooks/useFormValidation"
import { useToast } from "../../../store/ToastContext"
import { getErrorMessage } from "../../../utils/api"
import { IMAGE_ACCEPT, IMAGE_MAX_SIZE_MB, validateImageFile } from "../../../utils/validators"
import SocialLinksSection, {
    EMPTY_SOCIAL_LINKS,
    validateSocialLinks,
    type SocialLinksValues,
} from "./SocialLinksSection"

const DESCRIPTION_MAX = 500
const NAME_MAX = 32
const SYMBOL_MAX = 8
const DECIMAL_MIN = 1
const DECIMAL_MAX = 18

type TokenFormValues = {
    name: string
    symbol: string
    decimal: string
    supply: string
    amountPerMint: string
    description: string
}

const INITIAL_VALUES: TokenFormValues = {
    name: "",
    symbol: "",
    decimal: "",
    supply: "",
    amountPerMint: "",
    description: "",
}

const validate = (values: TokenFormValues) => {
    const errors: Partial<Record<keyof TokenFormValues, string>> = {}

    if (!values.name.trim()) errors.name = "Token name is required"
    else if (values.name.length > NAME_MAX) errors.name = `Maximum ${NAME_MAX} characters allowed`

    if (!values.symbol.trim()) errors.symbol = "Symbol is required"
    else if (values.symbol.length > SYMBOL_MAX) errors.symbol = `Maximum ${SYMBOL_MAX} characters allowed`

    const decimalNum = Number(values.decimal)
    if (!values.decimal.trim()) errors.decimal = "Decimal is required"
    else if (!Number.isInteger(decimalNum) || decimalNum < DECIMAL_MIN || decimalNum > DECIMAL_MAX)
        /* Backend: decimals phải nằm trong khoảng 1 - 18 */
        errors.decimal = `Decimal must be an integer between ${DECIMAL_MIN} and ${DECIMAL_MAX}`

    const supplyNum = Number(values.supply)
    if (!values.supply.trim()) errors.supply = "Supply is required"
    else if (!(supplyNum > 0)) errors.supply = "Supply must be a positive number"
    else if (supplyNum > Number.MAX_SAFE_INTEGER) errors.supply = "Supply is too large"

    const amountNum = Number(values.amountPerMint)
    if (!values.amountPerMint.trim()) errors.amountPerMint = "Amount per mint is required"
    else if (!(amountNum > 0)) errors.amountPerMint = "Amount per mint must be a positive number"
    else if (values.supply.trim() && amountNum > supplyNum) errors.amountPerMint = "Cannot exceed total Supply"

    if (!values.description.trim()) errors.description = "Description is required"
    else if (values.description.length > DESCRIPTION_MAX) errors.description = `Maximum ${DESCRIPTION_MAX} characters allowed`

    return errors
}

const TokenForm = () => {
    const { values, setField, fieldError, errors, touchAll } = useFormValidation(INITIAL_VALUES, validate)
    const [image, setImage] = React.useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = React.useState<string | undefined>(undefined)
    const [imageTouched, setImageTouched] = React.useState(false)
    const [imageFileError, setImageFileError] = React.useState<string | undefined>(undefined)
    const [submitting, setSubmitting] = React.useState(false)
    const { success, error: toastError } = useToast()
    const navigate = useNavigate()

    const [socialEnabled, setSocialEnabled] = React.useState(true)
    const [socialValues, setSocialValues] = React.useState<SocialLinksValues>(EMPTY_SOCIAL_LINKS)
    const [submitAttempted, setSubmitAttempted] = React.useState(false)

    React.useEffect(() => {
        if (!image) {
            setPreviewUrl(undefined)
            return
        }
        const url = URL.createObjectURL(image)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [image])

    const imageError = imageFileError ?? (imageTouched && !image ? "Please select an image" : undefined)
    const socialLinksValid = !socialEnabled || validateSocialLinks(socialValues)

    const handleImageSelected = ([file]: File[]) => {
        setImageTouched(true)

        /* Drag-drop có thể bypass thuộc tính accept nên phải validate */
        const fileError = validateImageFile(file)
        if (fileError) {
            setImageFileError(fileError)
            toastError(fileError)
            return
        }

        setImageFileError(undefined)
        setImage(file)
        success("Token image uploaded successfully")
    }

    const handleRemoveImage = () => {
        setImage(null)
        setImageFileError(undefined)
        setImageTouched(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        touchAll()
        setImageTouched(true)
        setSubmitAttempted(true)

        if (submitting) return
        if (Object.keys(errors).length > 0 || !image || !socialLinksValid) return

        setSubmitting(true)
        try {
            await createToken({
                image,
                name: values.name.trim(),
                symbol: values.symbol.trim(),
                decimals: values.decimal.trim(),
                supply: values.supply.trim(),
                description: values.description.trim(),
                websiteUrl: socialEnabled ? socialValues.website : undefined,
                telegramUrl: socialEnabled ? socialValues.telegram : undefined,
                discordUrl: socialEnabled ? socialValues.discord : undefined,
                xUrl: socialEnabled ? socialValues.twitter : undefined,
            })
            success("Token created successfully")
            navigate("/profile")
        } catch (err) {
            toastError(getErrorMessage(err, "Failed to create token"))
        } finally {
            setSubmitting(false)
        }
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
                <Input
                    label="Decimal"
                    required
                    type="number"
                    inputMode="numeric"
                    min={DECIMAL_MIN}
                    max={DECIMAL_MAX}
                    placeholder="6"
                    hint="Most token use 6 decimals"
                    value={values.decimal}
                    onChange={(e) => setField("decimal", e.target.value)}
                    error={fieldError("decimal")}
                />
                <Input
                    label="Supply"
                    required
                    type="number"
                    inputMode="numeric"
                    placeholder="1"
                    hint="Most token use 10B"
                    value={values.supply}
                    onChange={(e) => setField("supply", e.target.value)}
                    error={fieldError("supply")}
                />
            </div>

            <Input
                label="Amount per mint"
                required
                type="number"
                inputMode="numeric"
                placeholder="6"
                value={values.amountPerMint}
                onChange={(e) => setField("amountPerMint", e.target.value)}
                error={fieldError("amountPerMint")}
            />

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium">
                        <span className="mr-0.5 text-destructive">*</span>Image
                    </span>
                    <Dropzone
                        accept={IMAGE_ACCEPT}
                        hint={`png, .jpg, .svg, max ${IMAGE_MAX_SIZE_MB}MB`}
                        onFilesSelected={handleImageSelected}
                        previewUrl={previewUrl}
                        onRemove={previewUrl ? handleRemoveImage : undefined}
                        error={imageError}
                        className="min-h-28"
                    />
                </div>

                <Textarea
                    label="Description"
                    required
                    value={values.description}
                    maxLength={DESCRIPTION_MAX}
                    onChange={(e) => setField("description", e.target.value)}
                    placeholder="Ex: First community token on Zoken..."
                    error={fieldError("description")}
                    className="min-h-28 bg-[#F5FBFB] focus-visible:bg-background"
                />
            </div>

            <SocialLinksSection
                enabled={socialEnabled}
                onEnabledChange={setSocialEnabled}
                values={socialValues}
                onChange={(id, value) => setSocialValues((prev) => ({ ...prev, [id]: value }))}
                submitted={submitAttempted}
            />

            <SubmitButton loading={submitting} disabled={submitting} className="h-11">
                Create
            </SubmitButton>
        </form>
    )
}

export default TokenForm
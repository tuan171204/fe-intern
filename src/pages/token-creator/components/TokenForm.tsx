import * as React from "react"
import type { ParseKeys } from "i18next"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { parseUnits } from "viem"

import { Button } from "../../../components/ui/button"
import { Dropzone } from "../../../components/ui/dropzone"
import { Input } from "../../../components/ui/input"
import { SubmitButton } from "../../../components/ui/submit-button"
import { Textarea } from "../../../components/ui/textarea"
import { TOKEN_DECIMALS } from "../../../constants/contract"
import { useCreateToken, type CreateTokenStep } from "../../../hooks/useCreateToken"
import { useFormValidation } from "../../../hooks/useFormValidation"
import { useNetworkGuard } from "../../../hooks/useNetworkGuard"
import { useToast } from "../../../store/ToastContext"
import {
    IMAGE_ACCEPT,
    IMAGE_MAX_SIZE_MB,
    validateImageFile,
    type ImageFileError,
} from "../../../utils/validators"
import CreateTokenProgress from "./CreateTokenProgress"
import CreateTokenSuccessModal from "./CreateTokenSuccessModal"
import SocialLinksSection, {
    EMPTY_SOCIAL_LINKS,
    validateSocialLinks,
    type SocialLinksValues,
} from "./SocialLinksSection"

const DESCRIPTION_MAX = 500
const NAME_MAX = 32
const SYMBOL_MAX = 8

/* Plain decimals only (no "1e3", no sign) because the value goes into parseUnits */
const AMOUNT_REGEX = new RegExp(`^\\d+(\\.\\d{1,${TOKEN_DECIMALS}})?$`)

type TFn = ReturnType<typeof useTranslation>["t"]

type TokenFormValues = {
    name: string
    symbol: string
    initialSupply: string
    maxSupply: string
    amountPerMint: string
    mintFee: string
    description: string
}

const INITIAL_VALUES: TokenFormValues = {
    name: "",
    symbol: "",
    initialSupply: "",
    maxSupply: "",
    amountPerMint: "",
    mintFee: "",
    description: "",
}

/** null if the string is not a valid amount */
const parseAmount = (value: string): bigint | null =>
    AMOUNT_REGEX.test(value.trim()) ? parseUnits(value.trim(), TOKEN_DECIMALS) : null

const createValidator = (t: TFn) => (values: TokenFormValues) => {
    const errors: Partial<Record<keyof TokenFormValues, string>> = {}
    const amountFormatError = t("tokenCreator.errors.amountFormat", { decimals: TOKEN_DECIMALS })

    if (!values.name.trim()) errors.name = t("tokenCreator.errors.nameRequired")
    else if (values.name.length > NAME_MAX) errors.name = t("validation.maxChars", { max: NAME_MAX })

    if (!values.symbol.trim()) errors.symbol = t("tokenCreator.errors.symbolRequired")
    else if (values.symbol.length > SYMBOL_MAX) errors.symbol = t("validation.maxChars", { max: SYMBOL_MAX })

    const maxSupply = parseAmount(values.maxSupply)
    if (!values.maxSupply.trim()) errors.maxSupply = t("tokenCreator.errors.maxSupplyRequired")
    else if (maxSupply === null) errors.maxSupply = amountFormatError
    else if (maxSupply <= 0n) errors.maxSupply = t("tokenCreator.errors.maxSupplyPositive")

    const initialSupply = parseAmount(values.initialSupply)
    if (!values.initialSupply.trim()) errors.initialSupply = t("tokenCreator.errors.initialSupplyRequired")
    else if (initialSupply === null) errors.initialSupply = amountFormatError
    else if (maxSupply !== null && initialSupply > maxSupply) {
        errors.initialSupply = t("tokenCreator.errors.exceedsMaxSupply")
    }

    const amount = parseAmount(values.amountPerMint)
    if (!values.amountPerMint.trim()) errors.amountPerMint = t("tokenCreator.errors.amountPerMintRequired")
    else if (amount === null) errors.amountPerMint = amountFormatError
    else if (amount <= 0n) errors.amountPerMint = t("tokenCreator.errors.amountPerMintPositive")
    else if (maxSupply !== null && amount > maxSupply) errors.amountPerMint = t("tokenCreator.errors.exceedsMaxSupply")

    if (!values.mintFee.trim()) errors.mintFee = t("tokenCreator.errors.mintFeeRequired")
    else if (parseAmount(values.mintFee) === null) errors.mintFee = amountFormatError

    if (!values.description.trim()) errors.description = t("tokenCreator.errors.descriptionRequired")
    else if (values.description.length > DESCRIPTION_MAX) {
        errors.description = t("validation.maxChars", { max: DESCRIPTION_MAX })
    }

    return errors
}

const SUBMIT_LABEL_KEYS: Partial<Record<CreateTokenStep, ParseKeys>> = {
    submitting: "tokenCreator.submit.submitting",
    confirming: "tokenCreator.submit.confirming",
    saving: "tokenCreator.submit.saving",
}

const TokenForm = () => {
    const { t } = useTranslation()
    const { values, setField, fieldError, errors, touchAll, reset: resetValues } = useFormValidation(
        INITIAL_VALUES,
        createValidator(t)
    )
    const [image, setImage] = React.useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = React.useState<string | undefined>(undefined)
    const [imageTouched, setImageTouched] = React.useState(false)
    /* Stored as a code (not a message) so it follows the language switch */
    const [imageFileError, setImageFileError] = React.useState<ImageFileError | undefined>(undefined)
    const { success, error: toastError } = useToast()
    const navigate = useNavigate()

    const [socialEnabled, setSocialEnabled] = React.useState(true)
    const [socialValues, setSocialValues] = React.useState<SocialLinksValues>(EMPTY_SOCIAL_LINKS)
    const [submitAttempted, setSubmitAttempted] = React.useState(false)

    const { canTransact } = useNetworkGuard()
    const { step, error, isBusy, txUrl, submit, retrySave, reset: resetFlow } = useCreateToken()

    /* Snapshot of name/symbol for the success modal, since the form is reset on success */
    const [created, setCreated] = React.useState({ name: "", symbol: "" })

    React.useEffect(() => {
        if (!image) {
            setPreviewUrl(undefined)
            return
        }
        const url = URL.createObjectURL(image)
        setPreviewUrl(url)
        return () => URL.revokeObjectURL(url)
    }, [image])

    const imageFileErrorMessage = imageFileError
        ? imageFileError === "invalidType"
            ? t("validation.invalidImageType")
            : t("validation.imageTooLarge", { size: IMAGE_MAX_SIZE_MB })
        : undefined
    const imageError =
        imageFileErrorMessage ?? (imageTouched && !image ? t("tokenCreator.errors.imageRequired") : undefined)
    const socialLinksValid = !socialEnabled || validateSocialLinks(socialValues)

    const handleImageSelected = ([file]: File[]) => {
        if (isBusy) return
        setImageTouched(true)

        /* Drag-and-drop can bypass the accept attribute, so validate again */
        const fileError = validateImageFile(file)
        if (fileError) {
            setImageFileError(fileError)
            toastError(
                fileError === "invalidType"
                    ? t("validation.invalidImageType")
                    : t("validation.imageTooLarge", { size: IMAGE_MAX_SIZE_MB })
            )
            return
        }

        setImageFileError(undefined)
        setImage(file)
        success(t("tokenCreator.notices.imageUploaded"))
    }

    const handleRemoveImage = () => {
        setImage(null)
        setImageFileError(undefined)
        setImageTouched(true)
    }

    const resetAll = () => {
        resetValues()
        setImage(null)
        setImageTouched(false)
        setImageFileError(undefined)
        setSocialValues(EMPTY_SOCIAL_LINKS)
        setSubmitAttempted(false)
        resetFlow()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        touchAll()
        setImageTouched(true)
        setSubmitAttempted(true)

        /* Block double-submit, and re-creation when the tx is on-chain but metadata is not saved yet */
        if (isBusy || step === "save-failed") return
        if (Object.keys(errors).length > 0 || !image || !socialLinksValid) return
        if (!canTransact) {
            toastError(t("tokenCreator.notices.connectToast"))
            return
        }

        setCreated({ name: values.name.trim(), symbol: values.symbol.trim() })

        await submit({
            image,
            name: values.name.trim(),
            symbol: values.symbol.trim(),
            initialSupply: values.initialSupply.trim(),
            maxSupply: values.maxSupply.trim(),
            amountPerMint: values.amountPerMint.trim(),
            mintFee: values.mintFee.trim(),
            description: values.description.trim(),
            websiteUrl: socialEnabled ? socialValues.website : undefined,
            telegramUrl: socialEnabled ? socialValues.telegram : undefined,
            discordUrl: socialEnabled ? socialValues.discord : undefined,
            xUrl: socialEnabled ? socialValues.twitter : undefined,
        })
    }

    const submitLabelKey = SUBMIT_LABEL_KEYS[step]

    return (
        <>
            <form onSubmit={handleSubmit} noValidate className="[&_label]:text-xs [&_label]:font-medium">
                {/* Disabling the whole fieldset locks every input and button while a transaction runs */}
                <fieldset disabled={isBusy} className="flex min-w-0 flex-col gap-5">
                    <div className="grid gap-5 sm:grid-cols-2">
                        <Input
                            label={t("tokenCreator.form.name")}
                            required
                            maxLength={NAME_MAX}
                            placeholder={t("tokenCreator.form.namePlaceholder")}
                            hint={t("tokenCreator.form.nameHint")}
                            value={values.name}
                            onChange={(e) => setField("name", e.target.value)}
                            error={fieldError("name")}
                        />
                        <Input
                            label={t("tokenCreator.form.symbol")}
                            required
                            maxLength={SYMBOL_MAX}
                            placeholder={t("tokenCreator.form.symbolPlaceholder")}
                            hint={t("tokenCreator.form.symbolHint")}
                            value={values.symbol}
                            onChange={(e) => setField("symbol", e.target.value)}
                            error={fieldError("symbol")}
                        />
                        <Input
                            label={t("tokenCreator.form.maxSupply")}
                            required
                            inputMode="decimal"
                            placeholder="10000000000"
                            hint={t("tokenCreator.form.maxSupplyHint")}
                            value={values.maxSupply}
                            onChange={(e) => setField("maxSupply", e.target.value)}
                            error={fieldError("maxSupply")}
                        />
                        <Input
                            label={t("tokenCreator.form.initialSupply")}
                            required
                            inputMode="decimal"
                            placeholder="0"
                            hint={t("tokenCreator.form.initialSupplyHint")}
                            value={values.initialSupply}
                            onChange={(e) => setField("initialSupply", e.target.value)}
                            error={fieldError("initialSupply")}
                        />
                        <Input
                            label={t("tokenCreator.form.amountPerMint")}
                            required
                            inputMode="decimal"
                            placeholder="100"
                            value={values.amountPerMint}
                            onChange={(e) => setField("amountPerMint", e.target.value)}
                            error={fieldError("amountPerMint")}
                        />
                        <Input
                            label={t("tokenCreator.form.mintFee")}
                            required
                            inputMode="decimal"
                            placeholder="0.012"
                            hint={t("tokenCreator.form.mintFeeHint")}
                            value={values.mintFee}
                            onChange={(e) => setField("mintFee", e.target.value)}
                            error={fieldError("mintFee")}
                        />
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium">
                                <span className="mr-0.5 text-destructive">*</span>
                                {t("tokenCreator.form.image")}
                            </span>
                            <Dropzone
                                accept={IMAGE_ACCEPT}
                                hint={t("tokenCreator.form.imageHint", { size: IMAGE_MAX_SIZE_MB })}
                                onFilesSelected={handleImageSelected}
                                previewUrl={previewUrl}
                                onRemove={previewUrl ? handleRemoveImage : undefined}
                                error={imageError}
                                className="min-h-28"
                            />
                        </div>

                        <Textarea
                            label={t("tokenCreator.form.description")}
                            required
                            value={values.description}
                            maxLength={DESCRIPTION_MAX}
                            onChange={(e) => setField("description", e.target.value)}
                            placeholder={t("tokenCreator.form.descriptionPlaceholder")}
                            error={fieldError("description")}
                            className="min-h-28"
                        />
                    </div>

                    <SocialLinksSection
                        enabled={socialEnabled}
                        onEnabledChange={setSocialEnabled}
                        values={socialValues}
                        onChange={(id, value) => setSocialValues((prev) => ({ ...prev, [id]: value }))}
                        submitted={submitAttempted}
                    />

                    {!canTransact && (
                        <p
                            role="alert"
                            className="rounded-md bg-amber-50 p-3 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-300"
                        >
                            {t("tokenCreator.notices.connect")}
                        </p>
                    )}

                    <CreateTokenProgress step={step} txUrl={txUrl} />

                    {step === "save-failed" && (
                        <div
                            role="alert"
                            className="flex flex-col gap-3 rounded-md border border-destructive/40 bg-red-50 p-3 dark:bg-red-950/40"
                        >
                            <p className="text-xs text-destructive">{error}</p>
                            <p className="text-xs text-muted-foreground">{t("tokenCreator.notices.onChainSaved")}</p>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={retrySave}
                                    className="rounded-full bg-teal-600 text-white hover:bg-teal-700"
                                >
                                    {t("tokenCreator.notices.retrySaving")}
                                </Button>
                                <Button type="button" size="sm" variant="outline" onClick={resetAll} className="rounded-full">
                                    {t("tokenCreator.notices.discard")}
                                </Button>
                            </div>
                        </div>
                    )}

                    <SubmitButton
                        loading={isBusy}
                        disabled={isBusy || !canTransact || step === "save-failed"}
                        className="h-11"
                    >
                        {submitLabelKey ? t(submitLabelKey) : t("tokenCreator.form.create")}
                    </SubmitButton>
                </fieldset>
            </form>

            <CreateTokenSuccessModal
                isOpen={step === "success"}
                tokenName={created.name}
                tokenSymbol={created.symbol}
                txUrl={txUrl}
                onViewTokens={() => navigate("/profile")}
                onClose={resetAll}
            />
        </>
    )
}

export default TokenForm
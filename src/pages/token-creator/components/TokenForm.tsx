import * as React from "react"
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
import { IMAGE_ACCEPT, IMAGE_MAX_SIZE_MB, validateImageFile } from "../../../utils/validators"
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

/* Số thập phân thuần (không cho "1e3", dấu âm...) vì sẽ đưa vào parseUnits */
const AMOUNT_REGEX = new RegExp(`^\\d+(\\.\\d{1,${TOKEN_DECIMALS}})?$`)
const AMOUNT_FORMAT_ERROR = `Use plain digits, up to ${TOKEN_DECIMALS} decimals (e.g. 1000000)`

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

/** null nếu chuỗi không phải số hợp lệ */
const parseAmount = (value: string): bigint | null =>
    AMOUNT_REGEX.test(value.trim()) ? parseUnits(value.trim(), TOKEN_DECIMALS) : null

const validate = (values: TokenFormValues) => {
    const errors: Partial<Record<keyof TokenFormValues, string>> = {}

    if (!values.name.trim()) errors.name = "Token name is required"
    else if (values.name.length > NAME_MAX) errors.name = `Maximum ${NAME_MAX} characters allowed`

    if (!values.symbol.trim()) errors.symbol = "Symbol is required"
    else if (values.symbol.length > SYMBOL_MAX) errors.symbol = `Maximum ${SYMBOL_MAX} characters allowed`

    const maxSupply = parseAmount(values.maxSupply)
    if (!values.maxSupply.trim()) errors.maxSupply = "Max supply is required"
    else if (maxSupply === null) errors.maxSupply = AMOUNT_FORMAT_ERROR
    else if (maxSupply <= 0n) errors.maxSupply = "Max supply must be greater than 0"

    const initialSupply = parseAmount(values.initialSupply)
    if (!values.initialSupply.trim()) errors.initialSupply = "Initial supply is required (enter 0 for none)"
    else if (initialSupply === null) errors.initialSupply = AMOUNT_FORMAT_ERROR
    else if (maxSupply !== null && initialSupply > maxSupply) errors.initialSupply = "Cannot exceed Max Supply"

    const amount = parseAmount(values.amountPerMint)
    if (!values.amountPerMint.trim()) errors.amountPerMint = "Amount per mint is required"
    else if (amount === null) errors.amountPerMint = AMOUNT_FORMAT_ERROR
    else if (amount <= 0n) errors.amountPerMint = "Amount per mint must be greater than 0"
    else if (maxSupply !== null && amount > maxSupply) errors.amountPerMint = "Cannot exceed Max Supply"

    if (!values.mintFee.trim()) errors.mintFee = "Mint fee is required (enter 0 for free)"
    else if (parseAmount(values.mintFee) === null) errors.mintFee = AMOUNT_FORMAT_ERROR

    if (!values.description.trim()) errors.description = "Description is required"
    else if (values.description.length > DESCRIPTION_MAX) errors.description = `Maximum ${DESCRIPTION_MAX} characters allowed`

    return errors
}

const SUBMIT_LABELS: Partial<Record<CreateTokenStep, string>> = {
    submitting: "Submitting Transaction...",
    confirming: "Confirming on Chain...",
    saving: "Saving Metadata...",
}

const TokenForm = () => {
    const { values, setField, fieldError, errors, touchAll, reset: resetValues } = useFormValidation(
        INITIAL_VALUES,
        validate
    )
    const [image, setImage] = React.useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = React.useState<string | undefined>(undefined)
    const [imageTouched, setImageTouched] = React.useState(false)
    const [imageFileError, setImageFileError] = React.useState<string | undefined>(undefined)
    const { success, error: toastError } = useToast()
    const navigate = useNavigate()

    const [socialEnabled, setSocialEnabled] = React.useState(true)
    const [socialValues, setSocialValues] = React.useState<SocialLinksValues>(EMPTY_SOCIAL_LINKS)
    const [submitAttempted, setSubmitAttempted] = React.useState(false)

    const { canTransact } = useNetworkGuard()
    const { step, error, isBusy, txUrl, submit, retrySave, reset: resetFlow } = useCreateToken()

    /* Tên/symbol hiển thị ở modal thành công: chụp lại lúc submit vì form sẽ bị reset */
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

    const imageError = imageFileError ?? (imageTouched && !image ? "Please select an image" : undefined)
    const socialLinksValid = !socialEnabled || validateSocialLinks(socialValues)

    const handleImageSelected = ([file]: File[]) => {
        if (isBusy) return
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

        /* Chặn double-submit và chặn tạo lại khi tx đã on-chain mà chưa lưu được metadata */
        if (isBusy || step === "save-failed") return
        if (Object.keys(errors).length > 0 || !image || !socialLinksValid) return
        if (!canTransact) {
            toastError("Please connect your wallet on Sepolia to create a token")
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

    return (
        <>
            <form onSubmit={handleSubmit} noValidate className="[&_label]:text-xs [&_label]:font-medium">
                {/* disabled cả fieldset: khoá toàn bộ input/nút trong lúc giao dịch đang chạy */}
                <fieldset disabled={isBusy} className="flex min-w-0 flex-col gap-5">
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
                            label="Max Supply"
                            required
                            inputMode="decimal"
                            placeholder="10000000000"
                            hint="Hard cap of the token (18 decimals)"
                            value={values.maxSupply}
                            onChange={(e) => setField("maxSupply", e.target.value)}
                            error={fieldError("maxSupply")}
                        />
                        <Input
                            label="Initial Supply"
                            required
                            inputMode="decimal"
                            placeholder="0"
                            hint="Minted to your wallet on deploy (0 allowed)"
                            value={values.initialSupply}
                            onChange={(e) => setField("initialSupply", e.target.value)}
                            error={fieldError("initialSupply")}
                        />
                        <Input
                            label="Amount per mint"
                            required
                            inputMode="decimal"
                            placeholder="100"
                            value={values.amountPerMint}
                            onChange={(e) => setField("amountPerMint", e.target.value)}
                            error={fieldError("amountPerMint")}
                        />
                        <Input
                            label="Mint Fee (ETH)"
                            required
                            inputMode="decimal"
                            placeholder="0.012"
                            hint="Fee a minter pays per mint, in Sepolia ETH"
                            value={values.mintFee}
                            onChange={(e) => setField("mintFee", e.target.value)}
                            error={fieldError("mintFee")}
                        />
                    </div>

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

                    {!canTransact && (
                        <p role="alert" className="rounded-md bg-amber-50 p-3 text-xs text-amber-800">
                            Connect your wallet on Sepolia Testnet to create a token.
                        </p>
                    )}

                    <CreateTokenProgress step={step} txUrl={txUrl} />

                    {step === "save-failed" && (
                        <div role="alert" className="flex flex-col gap-3 rounded-md border border-destructive/40 bg-red-50 p-3">
                            <p className="text-xs text-destructive">{error}</p>
                            <p className="text-xs text-muted-foreground">
                                Your token is already deployed on-chain. Retry saving instead of creating it again.
                            </p>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={retrySave}
                                    className="rounded-full bg-teal-600 text-white hover:bg-teal-700"
                                >
                                    Retry saving
                                </Button>
                                <Button type="button" size="sm" variant="outline" onClick={resetAll} className="rounded-full">
                                    Discard
                                </Button>
                            </div>
                        </div>
                    )}

                    <SubmitButton
                        loading={isBusy}
                        disabled={isBusy || !canTransact || step === "save-failed"}
                        className="h-11"
                    >
                        {SUBMIT_LABELS[step] ?? "Create"}
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
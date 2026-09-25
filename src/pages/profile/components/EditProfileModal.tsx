import * as React from "react"

import { Dialog } from "../../../components/ui/dialog"
import Icon from "../../../components/ui/icon"
import { Input } from "../../../components/ui/input"
import { SubmitButton } from "../../../components/ui/submit-button"
import { Textarea } from "../../../components/ui/textarea"
import { useFormValidation } from "../../../hooks/useFormValidation"
import { PROFILE } from "../../../mocks/profile"
import { useToast } from "../../../store/ToastContext"
import { isValidUrl } from "../../../utils/validators"
import { SOCIAL_LINKS } from "./social-links"

export interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
}

const NAME_MAX = 32
const BIO_MAX = 280

type EditProfileValues = {
    name: string
    biography: string
    x: string
    telegram: string
    discord: string
}

const INITIAL_VALUES: EditProfileValues = {
    name: PROFILE.name,
    biography: PROFILE.biography === "None" ? "" : PROFILE.biography,
    x: "",
    telegram: "",
    discord: "",
}

const validate = (values: EditProfileValues) => {
    const errors: Partial<Record<keyof EditProfileValues, string>> = {}

    if (!values.name.trim()) errors.name = "Name is required"
    else if (values.name.length > NAME_MAX) errors.name = `Maximum ${NAME_MAX} characters allowed`

    if (values.biography.length > BIO_MAX) errors.biography = `Maximum ${BIO_MAX} characters allowed`

    SOCIAL_LINKS.forEach(({ key, label }) => {
        const value = values[key]
        if (value.trim() && !isValidUrl(value)) {
            errors[key] = `Invalid ${label} link (must start with http:// or https://)`
        }
    })

    return errors
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const { values, setField, fieldError, errors, touchAll, reset } = useFormValidation(INITIAL_VALUES, validate)
    const [submitting, setSubmitting] = React.useState(false)
    const { success } = useToast()

    const handleClose = () => {
        if (submitting) return
        reset()
        onClose()
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        touchAll()
        if (Object.keys(errors).length > 0) return

        setSubmitting(true)
        // Giả lập gọi API cập nhật hồ sơ (chưa nối API thật)
        window.setTimeout(() => {
            setSubmitting(false)
            success("Profile updated successfully")
            onClose()
        }, 600)
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} title="Edit Profile" className="max-h-[90svh] overflow-y-auto">
            <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-4 [&_label]:text-base [&_label]:font-normal"
            >
                <Input
                    label="Name"
                    required
                    maxLength={NAME_MAX}
                    placeholder="John"
                    value={values.name}
                    onChange={(e) => setField("name", e.target.value)}
                    error={fieldError("name")}
                />

                <Textarea
                    label="Biography"
                    placeholder="Write your biography here!"
                    maxLength={BIO_MAX}
                    value={values.biography}
                    onChange={(e) => setField("biography", e.target.value)}
                    error={fieldError("biography")}
                    className="bg-[#F5FBFB] focus-visible:bg-background"
                />

                <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 text-base">Social Links</legend>
                    {SOCIAL_LINKS.map(({ key, label, icon }) => (
                        <Input
                            key={key}
                            type="url"
                            aria-label={`${label} link`}
                            placeholder="https://..."
                            startAdornment={<Icon name={icon} size="sm" aria-hidden="true" />}
                            className="h-10 py-0"
                            value={values[key]}
                            onChange={(e) => setField(key, e.target.value)}
                            error={fieldError(key)}
                        />
                    ))}
                </fieldset>

                <SubmitButton loading={submitting} disabled={submitting} className="text-lg font-light tracking-wide">
                    Save
                </SubmitButton>
            </form>
        </Dialog>
    )
}

export default EditProfileModal
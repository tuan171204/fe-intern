import * as React from "react"
import { useTranslation } from "react-i18next"

import { updateProfile } from "../../../api/profile"
import { Dialog } from "../../../components/ui/dialog"
import Icon from "../../../components/ui/icon"
import { Input } from "../../../components/ui/input"
import { SubmitButton } from "../../../components/ui/submit-button"
import { Textarea } from "../../../components/ui/textarea"
import { useFormValidation } from "../../../hooks/useFormValidation"
import { useToast } from "../../../store/ToastContext"
import type { UserProfile } from "../../../types/profile"
import { getErrorMessage } from "../../../utils/api"
import { isValidUrl } from "../../../utils/validators"
import { SOCIAL_LINKS } from "./social-links"

export interface EditProfileModalProps {
    isOpen: boolean
    profile: UserProfile
    onSave: (profile: UserProfile) => void
    onClose: () => void
}

const NAME_MAX = 32
const BIO_MAX = 280

type TFn = ReturnType<typeof useTranslation>["t"]

type EditProfileValues = {
    name: string
    biography: string
    xUrl: string
    telegramUrl: string
    githubUrl: string
}

const createValidator = (t: TFn) => (values: EditProfileValues) => {
    const errors: Partial<Record<keyof EditProfileValues, string>> = {}

    if (!values.name.trim()) errors.name = t("profile.edit.nameRequired")
    else if (values.name.length > NAME_MAX) errors.name = t("validation.maxChars", { max: NAME_MAX })

    if (values.biography.length > BIO_MAX) errors.biography = t("validation.maxChars", { max: BIO_MAX })

    SOCIAL_LINKS.forEach(({ key, label }) => {
        const value = values[key]
        if (value.trim() && !isValidUrl(value)) {
            errors[key] = t("profile.edit.invalidLink", { label })
        }
    })

    return errors
}

const EditProfileModal = ({ isOpen, profile, onSave, onClose }: EditProfileModalProps) => {
    const { t } = useTranslation()
    const initialValues = React.useMemo<EditProfileValues>(
        () => ({
            name: profile.username ?? "",
            biography: profile.bio ?? "",
            xUrl: profile.xUrl ?? "",
            telegramUrl: profile.telegramUrl ?? "",
            githubUrl: profile.githubUrl ?? "",
        }),
        [profile]
    )

    const { values, setField, fieldError, errors, touchAll, reset } = useFormValidation(
        initialValues,
        createValidator(t)
    )
    const [submitting, setSubmitting] = React.useState(false)
    const { success, error } = useToast()

    /* Reload the form from the latest saved profile every time the modal opens */
    React.useEffect(() => {
        if (isOpen) reset()
    }, [isOpen, reset])

    const handleClose = () => {
        if (submitting) return
        reset()
        onClose()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        touchAll()
        if (Object.keys(errors).length > 0 || submitting) return

        setSubmitting(true)
        try {
            /* Send all 5 fields; an empty string clears the value */
            const updated = await updateProfile({
                username: values.name.trim(),
                bio: values.biography.trim(),
                telegramUrl: values.telegramUrl.trim(),
                xUrl: values.xUrl.trim(),
                githubUrl: values.githubUrl.trim(),
            })
            onSave(updated)
            success(t("profile.edit.updated"))
            onClose()
        } catch (err) {
            error(getErrorMessage(err, t("errors.updateProfile")))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            title={t("profile.edit.title")}
            className="max-h-[90svh] overflow-y-auto"
        >
            <form
                onSubmit={handleSubmit}
                noValidate
                className="flex flex-col gap-4 [&_label]:text-base [&_label]:font-normal"
            >
                <Input
                    label={t("profile.edit.name")}
                    required
                    maxLength={NAME_MAX}
                    placeholder={t("profile.edit.namePlaceholder")}
                    value={values.name}
                    onChange={(e) => setField("name", e.target.value)}
                    error={fieldError("name")}
                />

                <Textarea
                    label={t("profile.edit.bio")}
                    placeholder={t("profile.edit.bioPlaceholder")}
                    maxLength={BIO_MAX}
                    value={values.biography}
                    onChange={(e) => setField("biography", e.target.value)}
                    error={fieldError("biography")}
                />

                <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 text-base">{t("profile.edit.socialLinks")}</legend>
                    {SOCIAL_LINKS.map(({ key, label, icon }) => (
                        <Input
                            key={key}
                            type="url"
                            aria-label={t("profile.edit.linkAria", { label })}
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
                    {t("profile.edit.save")}
                </SubmitButton>
            </form>
        </Dialog>
    )
}

export default EditProfileModal
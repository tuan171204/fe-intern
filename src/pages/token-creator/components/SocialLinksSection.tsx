import * as React from "react"

import Icon, { type IconName } from "../../../components/ui/icon"
import { Input } from "../../../components/ui/input"
import { Switch } from "../../../components/ui/switch"
import { isValidUrl } from "../../../utils/validators"

export const SOCIAL_FIELDS: { id: "website" | "telegram" | "discord" | "twitter"; label: string; placeholder: string; icon: IconName }[] = [
    { id: "website", label: "Website", placeholder: "https://", icon: "globe" },
    { id: "telegram", label: "Telegram", placeholder: "https://t.me/", icon: "send" },
    { id: "discord", label: "Discord", placeholder: "https://discord.com/", icon: "discord" },
    { id: "twitter", label: "Twitter", placeholder: "https://twitter.com/", icon: "x-twitter" },
]

export type SocialFieldId = (typeof SOCIAL_FIELDS)[number]["id"]
export type SocialLinksValues = Record<SocialFieldId, string>

export const EMPTY_SOCIAL_LINKS: SocialLinksValues = { website: "", telegram: "", discord: "", twitter: "" }

/** Link để trống luôn hợp lệ, chỉ báo sai khi có nhập mà không đúng định dạng URL */
export const validateSocialLinks = (values: SocialLinksValues) =>
    SOCIAL_FIELDS.every(({ id }) => !values[id].trim() || isValidUrl(values[id]))

export interface SocialLinksSectionProps {
    enabled: boolean
    onEnabledChange: (enabled: boolean) => void
    values: SocialLinksValues
    onChange: (id: SocialFieldId, value: string) => void
    /** Form cha đã bấm submit lần nào chưa - dùng để lộ hết lỗi còn thiếu (giống touchAll) */
    submitted?: boolean
}

const SocialLinksSection = ({ enabled, onEnabledChange, values, onChange, submitted = false }: SocialLinksSectionProps) => {
    const [touched, setTouched] = React.useState<Partial<Record<SocialFieldId, boolean>>>({})
    const titleId = React.useId()

    const errorFor = (id: SocialFieldId) => {
        const value = values[id]
        if ((!touched[id] && !submitted) || !value.trim()) return undefined
        return isValidUrl(value) ? undefined : "Invalid URL (must start with http:// or https://)"
    }

    return (
        <section aria-labelledby={titleId} className="flex flex-col gap-4 border-t border-border pt-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 id={titleId} className="text-sm font-semibold">
                        Add Social Links &amp; Tags
                    </h2>
                    <p className="mt-1 text-[10px] text-muted-foreground">Max 32 characters in your name</p>
                </div>
                <Switch checked={enabled} onCheckedChange={onEnabledChange} aria-labelledby={titleId} />
            </div>

            {enabled &&
                SOCIAL_FIELDS.map(({ id, label, placeholder, icon }) => (
                    <div key={id} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
                        <label htmlFor={`social-${id}`} className="text-xs font-medium sm:mt-3 sm:w-20 sm:shrink-0">
                            {label}:
                        </label>
                        <div className="flex-1">
                            <Input
                                id={`social-${id}`}
                                type="url"
                                placeholder={placeholder}
                                startAdornment={<Icon name={icon} size="sm" aria-hidden="true" />}
                                className="h-10 py-0"
                                value={values[id]}
                                onChange={(e) => onChange(id, e.target.value)}
                                onBlur={() => setTouched((prev) => ({ ...prev, [id]: true }))}
                                error={errorFor(id)}
                            />
                        </div>
                    </div>
                ))}
        </section>
    )
}

export default SocialLinksSection
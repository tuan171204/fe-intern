import * as React from "react"
import { Globe, MessageCircle, Send } from "lucide-react"

import { Input } from "../../../components/ui/input"
import { Switch } from "../../../components/ui/switch"
import { isValidUrl } from "../../../utils/validators"

const SOCIAL_FIELDS = [
    { id: "website", label: "Website", placeholder: "https://", Icon: Globe },
    { id: "telegram", label: "Telegram", placeholder: "https://t.me/", Icon: Send },
    { id: "discord", label: "Discord", placeholder: "https://discord.com/", Icon: MessageCircle },
    { id: "twitter", label: "Twitter", placeholder: "https://twitter.com/", Icon: Globe },
] as const

type FieldId = (typeof SOCIAL_FIELDS)[number]["id"]

const SocialLinksSection = () => {
    const [enabled, setEnabled] = React.useState(true)
    const [values, setValues] = React.useState<Record<FieldId, string>>({
        website: "",
        telegram: "",
        discord: "",
        twitter: "",
    })
    const [touched, setTouched] = React.useState<Partial<Record<FieldId, boolean>>>({})
    const titleId = React.useId()

    /* Social links là optional, chỉ báo lỗi format khi người dùng đã nhập gì đó */
    const errorFor = (id: FieldId) => {
        const value = values[id]
        if (!touched[id] || !value.trim()) return undefined
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
                <Switch checked={enabled} onCheckedChange={setEnabled} aria-labelledby={titleId} />
            </div>

            {enabled &&
                SOCIAL_FIELDS.map(({ id, label, placeholder, Icon }) => (
                    <div key={id} className="flex flex-col gap-1.5 sm:flex-row sm:items-start sm:gap-3">
                        <label htmlFor={`social-${id}`} className="text-xs font-medium sm:mt-3 sm:w-20 sm:shrink-0">
                            {label}:
                        </label>
                        <div className="flex-1">
                            <Input
                                id={`social-${id}`}
                                type="url"
                                placeholder={placeholder}
                                startAdornment={<Icon className="size-3.5" aria-hidden="true" />}
                                className="h-10 py-0"
                                value={values[id]}
                                onChange={(e) => setValues((prev) => ({ ...prev, [id]: e.target.value }))}
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
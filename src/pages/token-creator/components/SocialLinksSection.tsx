import * as React from "react"
import { Globe, MessageCircle, Send } from "lucide-react"

import { Input } from "../../../components/ui/input"
import { Switch } from "../../../components/ui/switch"

const SOCIAL_FIELDS = [
    { id: "website", label: "Website", placeholder: "https://", Icon: Globe },
    { id: "telegram", label: "Telegram", placeholder: "https://t.me/", Icon: Send },
    { id: "discord", label: "Discord", placeholder: "https://discord.com/", Icon: MessageCircle },
    { id: "twitter", label: "Twitter", placeholder: "https://twitter.com/", Icon: Globe },
]

const SocialLinksSection = () => {
    const [enabled, setEnabled] = React.useState(true)
    const titleId = React.useId()

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
                    /* Mobile: label nằm trên input. Từ Tablet: label cố định 5rem bên trái */
                    <div key={id} className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
                        <label htmlFor={`social-${id}`} className="text-xs font-medium sm:w-20 sm:shrink-0">
                            {label}:
                        </label>
                        <Input
                            id={`social-${id}`}
                            type="url"
                            placeholder={placeholder}
                            startAdornment={<Icon className="size-3.5" aria-hidden="true" />}
                            className="h-10 py-0"
                        />
                    </div>
                ))}
        </section>
    )
}

export default SocialLinksSection
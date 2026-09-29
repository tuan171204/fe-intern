import type { IconName } from "../../../components/ui/icon"

export const SOCIAL_LINKS: { key: "xUrl" | "telegramUrl" | "githubUrl"; label: string; icon: IconName }[] = [
    { key: "xUrl", label: "X", icon: "x-twitter" },
    { key: "telegramUrl", label: "Telegram", icon: "telegram" },
    { key: "githubUrl", label: "GitHub", icon: "github" },
]
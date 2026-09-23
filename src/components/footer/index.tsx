import { Link } from "react-router-dom"

import Icon, { type IconName } from "../ui/icon"

const LINKS = [
    { label: "Feature Request", to: "/feature-request" },
    { label: "Contact Us", to: "/contact" },
]

const SOCIAL_ICONS: { label: string; href: string; icon: IconName }[] = [
    { label: "Twitter / X", href: "https://x.com", icon: "x-twitter" },
    { label: "Telegram", href: "https://t.me", icon: "telegram" },
    { label: "Docs", href: "#", icon: "docs" },
]

const Footer = () => (
    <footer className="border-t border-border bg-background">
        <div className="flex h-14 items-center justify-between px-4 text-xs text-muted-foreground sm:px-6">
            <nav className="flex items-center gap-6">
                {LINKS.map(({ label, to }) => (
                    <Link key={to} to={to} className="transition-colors hover:text-foreground">
                        {label}
                    </Link>
                ))}
            </nav>

            <div className="flex items-center gap-6">
                {SOCIAL_ICONS.map(({ label, href, icon }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        className="transition-colors hover:text-foreground"
                    >
                        <Icon name={icon} size="lg" />
                    </a>
                ))}
            </div>
        </div>
    </footer>
)

export { Footer }
export default Footer
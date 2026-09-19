import * as React from "react"
import { FileText } from "lucide-react"
import { Link } from "react-router-dom"

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
)

const TelegramIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
)

const LINKS = [
    { label: "Feature Request", to: "/feature-request" },
    { label: "Contact Us", to: "/contact" },
]

const ICONS = [
    { label: "Twitter / X", href: "https://x.com", Icon: XIcon },
    { label: "Telegram", href: "https://t.me", Icon: TelegramIcon },
    { label: "Docs", href: "#", Icon: FileText },
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
                {ICONS.map(({ label, href, Icon }) => (
                    <a
                        key={label}
                        href={href}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={label}
                        className="transition-colors hover:text-foreground"
                    >
                        <Icon className="size-5" />
                    </a>
                ))}
            </div>
        </div>
    </footer>
)

export { Footer }
export default Footer
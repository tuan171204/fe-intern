import * as React from "react"
import {
    BarChart3,
    Check,
    ChevronDown,
    Coins,
    Copy,
    Eye,
    EyeOff,
    FileText,
    Globe,
    Hexagon,
    Home,
    LogOut,
    Menu,
    MessageCircle,
    Send,
    TrendingDown,
    Upload,
    User,
    X,
    type LucideProps,
} from "lucide-react"

import cn from "../../utils/cn"

/** Logo X (Twitter) */
const XTwitterGlyph = (props: LucideProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
)

/** Logo Telegram  */
const TelegramGlyph = (props: LucideProps) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
)

/** Bảng tra icon dùng chung toàn dự án - mọi nơi cần icon chỉ dùng component Icon này */
const ICONS = {
    eye: Eye,
    "eye-off": EyeOff,
    upload: Upload,
    check: Check,
    copy: Copy,
    close: X,
    "chevron-down": ChevronDown,
    "bar-chart": BarChart3,
    "trend-down": TrendingDown,
    menu: Menu,
    logout: LogOut,
    user: User,
    globe: Globe,
    discord: MessageCircle,
    send: Send,
    docs: FileText,
    home: Home,
    coins: Coins,
    hexagon: Hexagon,
    "x-twitter": XTwitterGlyph,
    telegram: TelegramGlyph,
} as const

export type IconName = keyof typeof ICONS

const SIZES = {
    xs: "size-3",
    sm: "size-3.5",
    md: "size-4",
    lg: "size-5",
    xl: "size-6",
} as const

export interface IconProps extends Omit<React.SVGProps<SVGSVGElement>, "name"> {
    name: IconName
    size?: keyof typeof SIZES
}

const Icon = ({ name, size = "md", className, ...props }: IconProps) => {
    const Glyph = ICONS[name]
    return (
        <Glyph
            className={cn(SIZES[size], className)}
            aria-hidden={props["aria-label"] ? undefined : true}
            {...props}
        />
    )
}

export { Icon, ICONS }
export default Icon
import { useTranslation } from "react-i18next"

import { useTheme } from "../../store/ThemeContext"
import cn from "../../utils/cn"
import Icon from "./icon"

export interface ThemeToggleProps {
    className?: string
}

/** Icon button that switches between light and dark mode */
const ThemeToggle = ({ className }: ThemeToggleProps) => {
    const { t } = useTranslation()
    const { theme, toggleTheme } = useTheme()

    const isDark = theme === "dark"
    const label = isDark ? t("theme.switchToLight") : t("theme.switchToDark")

    return (
        <button
            type="button"
            onClick={toggleTheme}
            aria-label={label}
            title={label}
            className={cn(
                "inline-flex size-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors",
                "hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
                className
            )}
        >
            <Icon name={isDark ? "sun" : "moon"} size="lg" />
        </button>
    )
}

export { ThemeToggle }
export default ThemeToggle
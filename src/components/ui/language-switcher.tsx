import { useTranslation } from "react-i18next"

import type { Language } from "../../i18n"
import cn from "../../utils/cn"
import { Tabs, type TabOption } from "./tabs"

const OPTIONS: TabOption<Language>[] = [
    { value: "en", label: "EN" },
    { value: "vi", label: "VI" },
]

export interface LanguageSwitcherProps {
    className?: string
}

/** Compact EN | VI segmented control; the choice is cached in localStorage by i18next */
const LanguageSwitcher = ({ className }: LanguageSwitcherProps) => {
    const { t, i18n } = useTranslation()
    const current: Language = i18n.resolvedLanguage === "vi" ? "vi" : "en"

    return (
        <div title={t("language.label")} className={cn("inline-flex", className)}>
            <Tabs options={OPTIONS} value={current} onChange={(lng) => void i18n.changeLanguage(lng)} />
        </div>
    )
}

export { LanguageSwitcher }
export default LanguageSwitcher
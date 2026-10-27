import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"

import { LanguageSwitcher } from "../ui/language-switcher"
import { ThemeToggle } from "../ui/theme-toggle"
import ConnectWalletButton from "../wallet/ConnectWalletButton"

const Header = () => {
    const { t } = useTranslation()

    return (
        <header className="border-b border-border bg-background">
            <div className="flex h-16 items-center justify-between gap-2 px-4 sm:px-6">
                <Link to="/" className="text-lg font-bold text-teal-600">
                    {t("nav.appName")}
                </Link>

                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeToggle />
                    <ConnectWalletButton
                        className="h-9 rounded-full bg-teal-600 px-4 text-white hover:bg-teal-700"
                        secondaryClassName="h-9 rounded-full border-teal-600 px-4 text-teal-600 shadow-none hover:bg-teal-50 hover:text-teal-700"
                    />
                </div>
            </div>
        </header>
    )
}

export { Header }
export default Header
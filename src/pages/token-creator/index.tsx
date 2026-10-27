import { useTranslation } from "react-i18next"

import TokenForm from "./components/TokenForm"

const TokenCreator = () => {
    const { t } = useTranslation()

    return (
        <section className="mx-auto w-full max-w-4xl rounded-xl bg-background p-4 shadow-sm sm:p-8">
            <header className="mb-8 text-center">
                <h1 className="text-xl font-semibold">{t("tokenCreator.title")}</h1>
                <p className="mt-1 text-xs text-muted-foreground">{t("tokenCreator.subtitle")}</p>
            </header>

            <TokenForm />
        </section>
    )
}

export default TokenCreator
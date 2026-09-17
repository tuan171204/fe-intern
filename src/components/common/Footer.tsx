import { useTranslation } from "react-i18next";

export function Footer() {
    const { t } = useTranslation();
    return (
        <footer className="border-t py-6 mt-8">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                {t("footer.copyright")}
            </div>
        </footer>
    );
}
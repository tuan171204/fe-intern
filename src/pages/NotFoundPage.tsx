import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                <FileQuestion className="h-10 w-10 text-muted-foreground" />
            </div>
            <h1 className="text-4xl font-bold mb-2">404</h1>
            <h2 className="text-xl font-semibold mb-2">{t("app.notFound")}</h2>
            <p className="text-muted-foreground mb-6 max-w-md">{t("app.notFoundDesc")}</p>
            <Button onClick={() => navigate("/")}>{t("app.backToList")}</Button>
        </div>
    );
}
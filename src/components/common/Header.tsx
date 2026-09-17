import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { ListTodo, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { TaskFormModal } from "@/components/task/TaskFormModal";

export function Header() {
    const { t } = useTranslation();
    const [createOpen, setCreateOpen] = useState(false);

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                        <ListTodo className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-lg font-bold leading-tight">{t("app.title")}</span>
                        <span className="text-xs text-muted-foreground leading-tight hidden sm:inline">
                            {t("app.subtitle")}
                        </span>
                    </div>
                </Link>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <Button onClick={() => setCreateOpen(true)}>
                        <Plus className="h-4 w-4" />
                        <span className="hidden sm:inline">{t("app.addTask")}</span>
                    </Button>
                </div>
                <TaskFormModal open={createOpen} onOpenChange={setCreateOpen} />
            </div>
        </header>
    );
}
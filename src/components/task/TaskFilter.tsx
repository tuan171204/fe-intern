import { useTranslation } from "react-i18next";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
    setSearchFilter,
    setStatusFilter,
    setPriorityFilter,
    setSortBy,
    setSortOrder,
    resetFilters,
} from "@/features/task/taskSlice";
import type { TaskStatus, TaskPriority } from "@/types/task";

export function TaskFilter() {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const filters = useAppSelector((state) => state.task.filters);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3 mb-6 p-4 rounded-lg border bg-card">
            <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    placeholder={t("filter.search")}
                    value={filters.search || ""}
                    onChange={(e) => dispatch(setSearchFilter(e.target.value))}
                    className="pl-9"
                />
            </div>

            <Select
                value={filters.status || "ALL"}
                onValueChange={(v) => dispatch(setStatusFilter(v as TaskStatus | "ALL"))}
            >
                <SelectTrigger>
                    <SelectValue placeholder={t("filter.status")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">{t("status.ALL")}</SelectItem>
                    <SelectItem value="TODO">{t("status.TODO")}</SelectItem>
                    <SelectItem value="IN_PROGRESS">{t("status.IN_PROGRESS")}</SelectItem>
                    <SelectItem value="DONE">{t("status.DONE")}</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.priority || "ALL"}
                onValueChange={(v) => dispatch(setPriorityFilter(v as TaskPriority | "ALL"))}
            >
                <SelectTrigger>
                    <SelectValue placeholder={t("filter.priority")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">{t("priority.ALL")}</SelectItem>
                    <SelectItem value="LOW">{t("priority.LOW")}</SelectItem>
                    <SelectItem value="MEDIUM">{t("priority.MEDIUM")}</SelectItem>
                    <SelectItem value="HIGH">{t("priority.HIGH")}</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.sortBy || "createdAt"}
                onValueChange={(v) =>
                    dispatch(setSortBy(v as "createdAt" | "dueDate" | "priority"))
                }
            >
                <SelectTrigger>
                    <SelectValue placeholder={t("filter.sortBy")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="createdAt">{t("sort.createdAt")}</SelectItem>
                    <SelectItem value="dueDate">{t("sort.dueDate")}</SelectItem>
                    <SelectItem value="priority">{t("sort.priority")}</SelectItem>
                </SelectContent>
            </Select>

            <Select
                value={filters.sortOrder || "desc"}
                onValueChange={(v) => dispatch(setSortOrder(v as "asc" | "desc"))}
            >
                <SelectTrigger>
                    <SelectValue placeholder={t("filter.sortOrder")} />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="asc">{t("filter.asc")}</SelectItem>
                    <SelectItem value="desc">{t("filter.desc")}</SelectItem>
                </SelectContent>
            </Select>

            <Button
                variant="outline"
                onClick={() => dispatch(resetFilters())}
                className="lg:col-span-5"
            >
                <RotateCcw className="h-4 w-4" />
                {t("filter.reset")}
            </Button>
        </div>
    );
}
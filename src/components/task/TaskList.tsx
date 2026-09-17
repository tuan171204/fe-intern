import { useTranslation } from "react-i18next";
import { FileX } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { TaskCard } from "./TaskCard";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import type { Task, TaskPriority } from "@/types/task";

const priorityWeight: Record<TaskPriority, number> = {
    HIGH: 3,
    MEDIUM: 2,
    LOW: 1,
};

function applyFilterAndSort(tasks: Task[], filters: any): Task[] {
    let filtered = [...tasks];

    if (filters.search) {
        const q = filters.search.toLowerCase();
        filtered = filtered.filter(
            (t) =>
                t.title.toLowerCase().includes(q) ||
                t.description.toLowerCase().includes(q)
        );
    }
    if (filters.status && filters.status !== "ALL") {
        filtered = filtered.filter((t) => t.status === filters.status);
    }
    if (filters.priority && filters.priority !== "ALL") {
        filtered = filtered.filter((t) => t.priority === filters.priority);
    }

    const { sortBy = "createdAt", sortOrder = "desc" } = filters;
    filtered.sort((a, b) => {
        let cmp = 0;
        if (sortBy === "priority") {
            cmp = priorityWeight[a.priority] - priorityWeight[b.priority];
        } else if (sortBy === "dueDate") {
            cmp = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        } else {
            cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sortOrder === "asc" ? cmp : -cmp;
    });

    return filtered;
}

export function TaskList() {
    const { t } = useTranslation();
    const { items, filters, loading } = useAppSelector((state) => state.task);
    const filtered = applyFilterAndSort(items, filters);

    if (loading && items.length === 0) {
        return <LoadingSpinner text={t("task.loading")} />;
    }

    if (filtered.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                    <FileX className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold">{t("task.noTasks")}</h3>
                <p className="text-sm text-muted-foreground mt-1">{t("task.noTasksDesc")}</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((task) => (
                <TaskCard key={task.id} task={task} />
            ))}
        </div>
    );
}
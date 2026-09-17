import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, Pencil, Trash2, CheckCircle2, Clock, Circle as CircleIcon } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TaskFormModal } from "./TaskFormModal";
import { useAppDispatch } from "@/store/hooks";
import { removeTask, editTask } from "@/features/task/taskThunks";
import { formatDate, isOverdue } from "@/lib/utils";
import type { Task, TaskStatus } from "@/types/task";

interface TaskCardProps {
    task: Task;
}

const statusIcons = {
    TODO: CircleIcon,
    IN_PROGRESS: Clock,
    DONE: CheckCircle2,
};

const statusVariant: Record<TaskStatus, "todo" | "inProgress" | "done"> = {
    TODO: "todo",
    IN_PROGRESS: "inProgress",
    DONE: "done",
};

const priorityVariant: Record<string, "low" | "medium" | "high"> = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
};

export function TaskCard({ task }: TaskCardProps) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    const overdue = isOverdue(task.dueDate, task.status);
    const StatusIcon = statusIcons[task.status];

    const handleToggleStatus = () => {
        const next: TaskStatus = task.status === "DONE" ? "TODO" : "DONE";
        dispatch(editTask({ id: task.id, data: { status: next } })).unwrap().then(() => {
            toast.success(next === "DONE" ? t("task.updated") : t("task.updated"));
        });
    };

    const handleDelete = () => {
        dispatch(removeTask(task.id)).unwrap().then(() => {
            toast.success(t("task.deleted"));
        });
    };

    return (
        <>
            <Card className="flex flex-col transition-all hover:shadow-md">
                <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                        <CardTitle className="text-base line-clamp-2 flex-1">{task.title}</CardTitle>
                        {task.status === "DONE" && (
                            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
                        )}
                    </div>
                </CardHeader>

                <CardContent className="flex-1 space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-3 min-h-[3rem]">
                        {task.description || "—"}
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                        <Badge variant={statusVariant[task.status]} className="flex items-center gap-1">
                            <StatusIcon className="h-3 w-3" />
                            {t(`status.${task.status}`)}
                        </Badge>
                        <Badge variant={priorityVariant[task.priority]}>
                            {t(`priority.${task.priority}`)}
                        </Badge>
                        {overdue && <Badge variant="overdue">⚠ {t("task.overdue")}</Badge>}
                    </div>
                </CardContent>

                <CardFooter className="flex flex-col gap-2 border-t pt-3">
                    <div className="w-full text-xs text-muted-foreground flex justify-between">
                        <span>{t("task.dueDate")}: {formatDate(task.dueDate)}</span>
                    </div>
                    <div className="w-full flex items-center justify-between gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/task/${task.id}`)}
                            title={t("task.view")}
                        >
                            <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditOpen(true)}
                            title={t("task.edit")}
                        >
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleToggleStatus}
                            title={task.status === "DONE" ? t("task.markTodo") : t("task.markDone")}
                        >
                            <CheckCircle2 className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setDeleteOpen(true)}
                            title={t("task.delete")}
                            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </CardFooter>
            </Card>

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title={t("task.confirmDeleteTitle")}
                description={t("task.confirmDeleteDesc")}
                onConfirm={handleDelete}
            />

            <TaskFormModal open={editOpen} onOpenChange={setEditOpen} task={task} />
        </>
    );
}
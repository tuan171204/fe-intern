import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash2, Clock, CheckCircle2, Circle as CircleIcon, Calendar, Tag } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTaskById, removeTask } from "@/features/task/taskThunks";
import { clearSelectedTask } from "@/features/task/taskSlice";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TaskFormModal } from "@/components/task/TaskFormModal";
import { formatDate, isOverdue } from "@/lib/utils";
import type { TaskStatus } from "@/types/task";

const statusIcons = {
    TODO: CircleIcon,
    IN_PROGRESS: Clock,
    DONE: CheckCircle2,
};

export function TaskDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { selectedTask, loading } = useAppSelector((state) => state.task);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [editOpen, setEditOpen] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchTaskById(id));
        }
        return () => {
            dispatch(clearSelectedTask());
        };
    }, [id, dispatch]);

    if (loading) {
        return <LoadingSpinner text={t("task.loading")} />;
    }

    if (!selectedTask) {
        return (
            <div className="flex flex-col items-center justify-center py-16">
                <h3 className="text-lg font-semibold">{t("task.error")}</h3>
                <Button variant="outline" className="mt-4" onClick={() => navigate("/")}>
                    {t("app.backToList")}
                </Button>
            </div>
        );
    }

    const overdue = isOverdue(selectedTask.dueDate, selectedTask.status);
    const StatusIcon = statusIcons[selectedTask.status];

    const handleDelete = async () => {
        await dispatch(removeTask(selectedTask.id)).unwrap();
        toast.success(t("task.deleted"));
        navigate("/");
    };

    return (
        <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" onClick={() => navigate("/")}>
                    <ArrowLeft className="h-4 w-4" />
                    {t("app.backToList")}
                </Button>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditOpen(true)}>
                        <Edit className="h-4 w-4" />
                        {t("task.edit")}
                    </Button>
                    <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                        <Trash2 className="h-4 w-4" />
                        {t("task.delete")}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                        <CardTitle className="text-2xl">{selectedTask.title}</CardTitle>
                        <StatusIcon
                            className={`h-6 w-6 shrink-0 ${selectedTask.status === "DONE" ? "text-emerald-500" : "text-muted-foreground"
                                }`}
                        />
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant={selectedTask.status === "DONE" ? "done" : selectedTask.status === "IN_PROGRESS" ? "inProgress" : "todo"}>
                            {t(`status.${selectedTask.status}`)}
                        </Badge>
                        <Badge variant={selectedTask.priority === "HIGH" ? "high" : selectedTask.priority === "MEDIUM" ? "medium" : "low"}>
                            <Tag className="h-3 w-3 mr-1" />
                            {t(`priority.${selectedTask.priority}`)}
                        </Badge>
                        {overdue && <Badge variant="overdue">⚠ {t("task.overdue")}</Badge>}
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    <div>
                        <h4 className="font-semibold mb-2">{t("task.description")}</h4>
                        <p className="text-muted-foreground whitespace-pre-wrap">
                            {selectedTask.description || "—"}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t("task.dueDate")}</p>
                                <p className="font-medium">{formatDate(selectedTask.dueDate)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t("task.createdAt")}</p>
                                <p className="font-medium">{formatDate(selectedTask.createdAt)}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 sm:col-span-2">
                            <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                                <p className="text-sm text-muted-foreground">{t("task.updatedAt")}</p>
                                <p className="font-medium">{formatDate(selectedTask.updatedAt)}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <ConfirmDialog
                open={deleteOpen}
                onOpenChange={setDeleteOpen}
                title={t("task.confirmDeleteTitle")}
                description={t("task.confirmDeleteDesc")}
                onConfirm={handleDelete}
            />

            <TaskFormModal open={editOpen} onOpenChange={setEditOpen} task={selectedTask} />
        </div>
    );
}
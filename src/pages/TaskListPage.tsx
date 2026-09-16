import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTasks } from "@/features/task/taskThunks";
import { TaskStats } from "@/components/task/TaskStats";
import { TaskFilter } from "@/components/task/TaskFilter";
import { TaskList } from "@/components/task/TaskList";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";
import { useTranslation } from "react-i18next";

export function TaskListPage() {
    const dispatch = useAppDispatch();
    const { loading, items } = useAppSelector((state) => state.task);
    const { t } = useTranslation();

    useEffect(() => {
        if (items.length === 0) {
            dispatch(fetchTasks());
        }
    }, [dispatch, items.length]);

    if (loading && items.length === 0) {
        return <LoadingSpinner text={t("task.loading")} />;
    }

    return (
        <div>
            <TaskStats />
            <TaskFilter />
            <TaskList />
        </div>
    );
}
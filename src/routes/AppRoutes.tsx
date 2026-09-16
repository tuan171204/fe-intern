import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/layout/MainLayout";
import { TaskListPage } from "@/pages/TaskListPage";
import { TaskDetailPage } from "@/pages/TaskDetailPage";
import { NotFoundPage } from "@/pages/NotFoundPage";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<TaskListPage />} />
                <Route path="/" element={<Navigate to="/" replace />} />
                <Route path="/task/:id" element={<TaskDetailPage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}
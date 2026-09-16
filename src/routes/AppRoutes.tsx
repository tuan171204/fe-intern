import { Routes, Route, Navigate } from "react-router-dom";
import { MainLayout } from "@/layout/MainLayout";
import { TaskListPage } from "@/pages/TaskListPage";

export function AppRoutes() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route index element={<TaskListPage />} />
                <Route path="/" element={<Navigate to="/" replace />} />
               
            </Route>
        </Routes>
    );
}
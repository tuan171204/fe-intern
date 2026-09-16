export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate: string;
    createdAt: string;
    updatedAt: string;
}

export type CreateTaskInput = Omit<Task, "createdAt" | "id" | "updatedAt">;
export type UpdateTaskInput = Partial<CreateTaskInput>;

export interface TaskFilterParams {
    search?: string;
    status?: TaskStatus | "ALL";
    priority?: TaskPriority | "ALL";
    sortBy?: "createdAt" | "dueDate" | "priority";
    sortOrder?: "asc" | "desc";
}
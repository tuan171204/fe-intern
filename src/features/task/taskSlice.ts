import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskFilterParams, TaskStatus, TaskPriority } from "@/types/task";
import {
    fetchTasks,
    addTask,
    editTask,
    removeTask,
    fetchTaskById,
} from "./taskThunks";

interface TaskState {
    items: Task[];
    selectedTask: Task | null;
    loading: boolean;
    error: string | null;
    filters: TaskFilterParams;
}

const initialState: TaskState = {
    items: [],
    selectedTask: null,
    loading: false,
    error: null,
    filters: {
        search: "",
        status: "ALL",
        priority: "ALL",
        sortBy: "createdAt",
        sortOrder: "desc",
    },
};

const taskSlice = createSlice({
    name: "task",
    initialState,
    reducers: {
        setSearchFilter(state, action: PayloadAction<string>) {
            state.filters.search = action.payload;
        },
        setStatusFilter(state, action: PayloadAction<TaskStatus | "ALL">) {
            state.filters.status = action.payload;
        },
        setPriorityFilter(state, action: PayloadAction<TaskPriority | "ALL">) {
            state.filters.priority = action.payload;
        },
        setSortBy(state, action: PayloadAction<"createdAt" | "dueDate" | "priority">) {
            state.filters.sortBy = action.payload;
        },
        setSortOrder(state, action: PayloadAction<"asc" | "desc">) {
            state.filters.sortOrder = action.payload;
        },
        resetFilters(state) {
            state.filters = initialState.filters;
        },
        clearSelectedTask(state) {
            state.selectedTask = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchTasks
            .addCase(fetchTasks.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTasks.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchTasks.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to fetch tasks";
            })
            // fetchTaskById
            .addCase(fetchTaskById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTaskById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedTask = action.payload;
            })
            .addCase(fetchTaskById.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Task not found";
            })
            // addTask
            .addCase(addTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addTask.fulfilled, (state, action) => {
                state.loading = false;
                state.items.unshift(action.payload);
            })
            .addCase(addTask.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to add task";
            })
            // editTask
            .addCase(editTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(editTask.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex((t) => t.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                if (state.selectedTask?.id === action.payload.id) {
                    state.selectedTask = action.payload;
                }
            })
            .addCase(editTask.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to update task";
            })
            // removeTask
            .addCase(removeTask.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeTask.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter((t) => t.id !== action.payload);
                if (state.selectedTask?.id === action.payload) {
                    state.selectedTask = null;
                }
            })
            .addCase(removeTask.rejected, (state, action) => {
                state.loading = false;
                state.error = (action.payload as string) || "Failed to delete task";
            });
    },
});

export const {
    setSearchFilter,
    setStatusFilter,
    setPriorityFilter,
    setSortBy,
    setSortOrder,
    resetFilters,
    clearSelectedTask,
} = taskSlice.actions;

export default taskSlice.reducer;
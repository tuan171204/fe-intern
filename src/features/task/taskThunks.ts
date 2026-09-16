import { createAsyncThunk } from "@reduxjs/toolkit";
import { taskService } from "@/services/taskService";
import type {
    Task,
    CreateTaskInput,
    UpdateTaskInput,
} from "@/types/task";

export const fetchTasks = createAsyncThunk<Task[]>(
    "task/fetchTasks",
    async (_, { rejectWithValue }) => {
        try {
            return await taskService.getAll();
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const addTask = createAsyncThunk<Task, CreateTaskInput>(
    "task/addTask",
    async (input, { rejectWithValue }) => {
        try {
            return await taskService.create(input);
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const editTask = createAsyncThunk<
    Task,
    { id: string; data: UpdateTaskInput }
>("task/editTask", async ({ id, data }, { rejectWithValue }) => {
    try {
        return await taskService.update(id, data);
    } catch (err) {
        return rejectWithValue((err as Error).message);
    }
});

export const removeTask = createAsyncThunk<string, string>(
    "task/removeTask",
    async (id, { rejectWithValue }) => {
        try {
            return await taskService.delete(id);
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);

export const fetchTaskById = createAsyncThunk<Task | null, string>(
    "task/fetchTaskById",
    async (id, { rejectWithValue }) => {
        try {
            return await taskService.getById(id);
        } catch (err) {
            return rejectWithValue((err as Error).message);
        }
    }
);
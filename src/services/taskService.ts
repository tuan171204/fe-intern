import type {
    Task,
    CreateTaskInput,
    UpdateTaskInput,
} from "@/types/task";
import { generateId } from "@/lib/utils";

const STORAGE_KEY = "todo_app_tasks";
const NETWORK_DELAY = 400;

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

const seedData: Task[] = [
    {
        id: generateId(),
        title: "Hoàn thành bài đánh giá Week 02",
        description:
            "Xây dựng ứng dụng Todo với React + TypeScript + Redux Toolkit theo yêu cầu đề bài.",
        status: "IN_PROGRESS",
        priority: "HIGH",
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        title: "Đọc tài liệu Clean Architecture",
        description:
            "Nghiên cứu các nguyên lý SOLID và Dependency Injection trong Clean Architecture.",
        status: "TODO",
        priority: "MEDIUM",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        title: "Thiết kế component library",
        description:
            "Tạo các reusable component dựa trên Shadcn/UI cho dự án tiếp theo.",
        status: "TODO",
        priority: "LOW",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
    {
        id: generateId(),
        title: "Setup CI/CD pipeline",
        description: "Cấu hình GitHub Actions để tự động build và test cho dự án.",
        status: "DONE",
        priority: "HIGH",
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        updatedAt: new Date().toISOString(),
    },
];

function readTasks(): Task[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(seedData));
            return seedData;
        }
        return JSON.parse(raw) as Task[];
    } catch {
        return seedData;
    }
}

function writeTasks(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export const taskService = {
    async getAll(): Promise<Task[]> {
        await delay(NETWORK_DELAY);
        return readTasks();
    },

    async getById(id: string): Promise<Task | null> {
        await delay(NETWORK_DELAY);
        const tasks = readTasks();
        return tasks.find((t) => t.id === id) ?? null;
    },

    async create(input: CreateTaskInput): Promise<Task> {
        await delay(NETWORK_DELAY);
        const tasks = readTasks();
        const now = new Date().toISOString();
        const newTask: Task = {
            id: generateId(),
            ...input,
            createdAt: now,
            updatedAt: now,
        };
        tasks.unshift(newTask);
        writeTasks(tasks);
        return newTask;
    },

    async update(id: string, input: UpdateTaskInput): Promise<Task> {
        await delay(NETWORK_DELAY);
        const tasks = readTasks();
        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) {
            throw new Error("Task not found");
        }
        const updated: Task = {
            ...tasks[index],
            ...input,
            updatedAt: new Date().toISOString(),
        };
        tasks[index] = updated;
        writeTasks(tasks);
        return updated;
    },

    async delete(id: string): Promise<string> {
        await delay(NETWORK_DELAY);
        const tasks = readTasks();
        const filtered = tasks.filter((t) => t.id !== id);
        writeTasks(filtered);
        return id;
    },
};
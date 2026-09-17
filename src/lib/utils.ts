import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(isoString: string): string {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
}

export function isOverdue(dueDate: string, status: string): boolean {
    if (status === "DONE") return false;
    return new Date(dueDate).getTime() < Date.now();
}

export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}
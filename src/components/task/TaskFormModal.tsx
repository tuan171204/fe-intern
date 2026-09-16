import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/store/hooks";
import { addTask, editTask } from "@/features/task/taskThunks";
import type { Task } from "@/types/task";

interface TaskFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    task?: Task | null;
}

const buildSchema = (t: (key: string, opts?: any) => string) =>
    z.object({
        title: z
            .string()
            .min(3, t("validation.titleMin", { min: 3 }))
            .max(100, t("validation.titleMax", { max: 100 })),
        description: z.string().max(500, t("validation.descMax", { max: 500 })).optional().or(z.literal("")),
        status: z.enum(["TODO", "IN_PROGRESS", "DONE"], { required_error: t("validation.required") }),
        priority: z.enum(["LOW", "MEDIUM", "HIGH"], { required_error: t("validation.required") }),
        dueDate: z.string().min(1, t("validation.required")),
    });

export function TaskFormModal({ open, onOpenChange, task }: TaskFormModalProps) {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const isEdit = !!task;

    const schema = buildSchema(t);
    type FormValues = z.infer<typeof schema>;

    const {
        register,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(schema),
        defaultValues: {
            title: "",
            description: "",
            status: "TODO",
            priority: "MEDIUM",
            dueDate: "",
        },
    });

    const status = watch("status");
    const priority = watch("priority");

    useEffect(() => {
        if (open) {
            if (task) {
                reset({
                    title: task.title,
                    description: task.description,
                    status: task.status,
                    priority: task.priority,
                    dueDate: task.dueDate.slice(0, 10),
                });
            } else {
                const tomorrow = new Date();
                tomorrow.setDate(tomorrow.getDate() + 1);
                reset({
                    title: "",
                    description: "",
                    status: "TODO",
                    priority: "MEDIUM",
                    dueDate: tomorrow.toISOString().slice(0, 10),
                });
            }
        }
    }, [open, task, reset]);

    const onSubmit = async (values: FormValues) => {
        const payload = {
            title: values.title.trim(),
            description: (values.description || "").trim(),
            status: values.status,
            priority: values.priority,
            dueDate: new Date(values.dueDate).toISOString(),
        };

        try {
            if (isEdit && task) {
                await dispatch(editTask({ id: task.id, data: payload })).unwrap();
                toast.success(t("task.updated"));
            } else {
                await dispatch(addTask(payload)).unwrap();
                toast.success(t("task.created"));
            }
            onOpenChange(false);
        } catch (err) {
            toast.error((err as string) || t("task.error"));
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{isEdit ? t("task.update") : t("task.create")}</DialogTitle>
                    <DialogDescription>
                        {isEdit ? t("task.update") : t("task.create")}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">{t("task.title")} *</Label>
                        <Input id="title" {...register("title")} />
                        {errors.title && (
                            <p className="text-sm text-destructive">{errors.title.message}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">{t("task.description")}</Label>
                        <Textarea id="description" rows={3} {...register("description")} />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description.message}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>{t("task.status")} *</Label>
                            <Select value={status} onValueChange={(v: any) => setValue("status", v, { shouldValidate: true })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TODO">{t("status.TODO")}</SelectItem>
                                    <SelectItem value="IN_PROGRESS">{t("status.IN_PROGRESS")}</SelectItem>
                                    <SelectItem value="DONE">{t("status.DONE")}</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.status && (
                                <p className="text-sm text-destructive">{errors.status.message}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>{t("task.priority")} *</Label>
                            <Select value={priority} onValueChange={(v: any) => setValue("priority", v, { shouldValidate: true })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">{t("priority.LOW")}</SelectItem>
                                    <SelectItem value="MEDIUM">{t("priority.MEDIUM")}</SelectItem>
                                    <SelectItem value="HIGH">{t("priority.HIGH")}</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.priority && (
                                <p className="text-sm text-destructive">{errors.priority.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">{t("task.dueDate")} *</Label>
                        <Input type="date" id="dueDate" {...register("dueDate")} />
                        {errors.dueDate && (
                            <p className="text-sm text-destructive">{errors.dueDate.message}</p>
                        )}
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
                            {t("button.cancel")}
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isEdit ? t("button.update") : t("button.create")}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
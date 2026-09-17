import { useTranslation } from "react-i18next";
import { CheckCircle2, Circle, Clock, ListTodo } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppSelector } from "@/store/hooks";

export function TaskStats() {
    const { t } = useTranslation();
    const items = useAppSelector((state) => state.task.items);

    const stats = [
        {
            label: t("task.total"),
            value: items.length,
            icon: ListTodo,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: t("status.TODO"),
            value: items.filter((t) => t.status === "TODO").length,
            icon: Circle,
            color: "text-slate-600",
            bg: "bg-slate-50",
        },
        {
            label: t("status.IN_PROGRESS"),
            value: items.filter((t) => t.status === "IN_PROGRESS").length,
            icon: Clock,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
        {
            label: t("status.DONE"),
            value: items.filter((t) => t.status === "DONE").length,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                    <Card key={stat.label}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
                            <div className={`${stat.bg} rounded-md p-2`}>
                                <Icon className={`h-4 w-4 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}
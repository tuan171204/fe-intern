import * as React from "react"

import { ToastViewport, type ToastItem, type ToastVariant } from "../components/ui/toast"

interface ToastContextValue {
    toast: (message: string, variant?: ToastVariant) => void
    success: (message: string) => void
    error: (message: string) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(undefined)

let idCounter = 0

const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [items, setItems] = React.useState<ToastItem[]>([])

    const dismiss = React.useCallback((id: number) => {
        setItems((prev) => prev.filter((t) => t.id !== id))
    }, [])

    const toast = React.useCallback(
        (message: string, variant: ToastVariant = "success") => {
            const id = ++idCounter
            setItems((prev) => [...prev, { id, message, variant }])
            window.setTimeout(() => dismiss(id), 3200)
        },
        [dismiss]
    )

    const value = React.useMemo<ToastContextValue>(
        () => ({
            toast,
            success: (message: string) => toast(message, "success"),
            error: (message: string) => toast(message, "error"),
        }),
        [toast]
    )

    return (
        <ToastContext.Provider value={value}>
            {children}
            <ToastViewport items={items} onDismiss={dismiss} />
        </ToastContext.Provider>
    )
}

const useToast = () => {
    const ctx = React.useContext(ToastContext)
    if (!ctx) throw new Error("useToast must be used within ToastProvider")
    return ctx
}

export { ToastProvider, useToast }
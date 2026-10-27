import * as React from "react"
import type { ParseKeys } from "i18next"
import { useTranslation } from "react-i18next"

import cn from "../../utils/cn"
import type { ExportFormat } from "../../utils/export-data"
import { Button } from "./button"
import Icon from "./icon"

const FORMATS: { format: ExportFormat; labelKey: ParseKeys }[] = [
    { format: "csv", labelKey: "export.csv" },
    { format: "xlsx", labelKey: "export.excel" },
]

export interface ExportMenuProps {
    onExport: (format: ExportFormat) => Promise<void> | void
    disabled?: boolean
    className?: string
}

const menuItemClass =
    "flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-accent focus-visible:bg-accent focus-visible:outline-none"

/** "Export" dropdown button: pick CSV or Excel, shows a spinner while the file is being generated */
const ExportMenu = ({ onExport, disabled = false, className }: ExportMenuProps) => {
    const { t } = useTranslation()
    const [open, setOpen] = React.useState(false)
    const [busy, setBusy] = React.useState(false)
    const rootRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        if (!open) return

        const onPointerDown = (e: MouseEvent) => {
            if (!rootRef.current?.contains(e.target as Node)) setOpen(false)
        }
        const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false)

        document.addEventListener("mousedown", onPointerDown)
        document.addEventListener("keydown", onKeyDown)
        return () => {
            document.removeEventListener("mousedown", onPointerDown)
            document.removeEventListener("keydown", onKeyDown)
        }
    }, [open])

    const handleSelect = async (format: ExportFormat) => {
        if (busy) return
        setOpen(false)
        setBusy(true)
        try {
            await onExport(format)
        } finally {
            setBusy(false)
        }
    }

    return (
        <div ref={rootRef} className={cn("relative", className)}>
            <Button
                type="button"
                variant="outline"
                size="sm"
                loading={busy}
                disabled={disabled}
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="rounded-full border-teal-600 text-teal-600 shadow-none hover:bg-teal-50 hover:text-teal-700"
            >
                {/* No dedicated download icon in the icon map: upload rotated 180deg */}
                {!busy && <Icon name="upload" size="sm" className="rotate-180" aria-hidden="true" />}
                {t("export.button")}
                <Icon
                    name="chevron-down"
                    size="sm"
                    aria-hidden="true"
                    className={cn("transition-transform", open && "rotate-180")}
                />
            </Button>

            {open && (
                <ul
                    role="menu"
                    aria-label={t("export.menuLabel")}
                    className="absolute right-0 top-full z-30 mt-2 w-44 rounded-lg border border-border bg-background p-1 shadow-lg animate-in fade-in-0 zoom-in-95 duration-150"
                >
                    {FORMATS.map(({ format, labelKey }) => (
                        <li key={format} role="none">
                            <button
                                type="button"
                                role="menuitem"
                                onClick={() => void handleSelect(format)}
                                className={menuItemClass}
                            >
                                <Icon name="docs" size="md" aria-hidden="true" />
                                {t(labelKey)}
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}

export { ExportMenu }
export default ExportMenu
export type ExportFormat = "csv" | "xlsx"
export type ExportCell = string | number

export interface ExportTable {
    headers: string[]
    rows: ExportCell[][]
}

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

/* Cells starting with these characters can run as formulas in Excel / Sheets (CSV injection) */
const FORMULA_PREFIX = /^[=+\-@\t\r]/

/** Neutralizes formula injection: user-controlled values (e.g. token names) are exported as plain text */
export const sanitizeCell = (value: ExportCell): ExportCell =>
    typeof value === "string" && FORMULA_PREFIX.test(value) ? `'${value}` : value

const escapeCsv = (value: ExportCell): string => {
    const text = String(value)
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** UTF-8 BOM keeps Excel from garbling non-ASCII characters (e.g. Vietnamese) */
export const toCsv = ({ headers, rows }: ExportTable): string =>
    "\uFEFF" + [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n")

/** YYYYMMDD, used in export file names */
export const dateStamp = (): string => new Date().toISOString().slice(0, 10).replace(/-/g, "")

const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    /* Revoke on the next tick so the browser has started the download */
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

/** Downloads the table as .csv or .xlsx. The xlsx library is loaded lazily, only when needed. */
export async function exportTable(
    table: ExportTable,
    format: ExportFormat,
    baseName: string,
    sheetName = "Sheet1"
): Promise<void> {
    const safe: ExportTable = { headers: table.headers, rows: table.rows.map((row) => row.map(sanitizeCell)) }
    const filename = `${baseName}.${format}`

    if (format === "csv") {
        downloadBlob(new Blob([toCsv(safe)], { type: "text/csv;charset=utf-8" }), filename)
        return
    }

    const XLSX = await import("xlsx")
    const sheet = XLSX.utils.aoa_to_sheet([safe.headers, ...safe.rows])
    sheet["!cols"] = safe.headers.map((header) => ({ wch: Math.max(header.length + 2, 16) }))

    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, sheetName)

    const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer
    downloadBlob(new Blob([buffer], { type: XLSX_MIME }), filename)
}
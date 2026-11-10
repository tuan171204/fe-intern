export type ExportFormat = "csv" | "xlsx"
export type ExportCell = string | number

export interface ExportTable {
    headers: string[]
    rows: ExportCell[][]
}

const XLSX_MIME = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"

/* Cells starting with these characters can run as formulas when a CSV is opened in Excel / Sheets (CSV injection) */
const FORMULA_PREFIX = /^[=+\-@\t\r]/

/**
 * Neutralizes formula injection: user-controlled values (e.g. token names) are exported as plain text.
 * CSV ONLY: in an .xlsx file strings are written as explicit string cells and are never evaluated,
 * so prefixing them would just show a stray apostrophe in the data.
 */
export const sanitizeCell = (value: ExportCell): ExportCell =>
    typeof value === "string" && FORMULA_PREFIX.test(value) ? `'${value}` : value

const escapeCsv = (value: ExportCell): string => {
    const text = String(value)
    return /[",\r\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text
}

/** UTF-8 BOM keeps Excel from garbling non-ASCII characters (e.g. Vietnamese) */
export const toCsv = ({ headers, rows }: ExportTable): string =>
    "\uFEFF" + [headers, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n")

/** YYYYMMDD in the user's LOCAL time zone, used in export file names (toISOString would use UTC and can be off by a day) */
export const dateStamp = (): string => {
    const now = new Date()
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}`
}

const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    link.remove()
    /* Revoke later: revoking immediately can cancel the download in some browsers */
    window.setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Downloads the table as .csv or .xlsx. The xlsx library is loaded lazily, only when needed. */
export async function exportTable(
    table: ExportTable,
    format: ExportFormat,
    baseName: string,
    sheetName = "Sheet1"
): Promise<void> {
    const filename = `${baseName}.${format}`

    if (format === "csv") {
        const safe: ExportTable = { headers: table.headers, rows: table.rows.map((row) => row.map(sanitizeCell)) }
        downloadBlob(new Blob([toCsv(safe)], { type: "text/csv;charset=utf-8" }), filename)
        return
    }

    const XLSX = await import("xlsx")
    const sheet = XLSX.utils.aoa_to_sheet([table.headers, ...table.rows])
    sheet["!cols"] = table.headers.map((header) => ({ wch: Math.max(header.length + 2, 16) }))

    const book = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(book, sheet, sheetName)

    const buffer = XLSX.write(book, { bookType: "xlsx", type: "array" }) as ArrayBuffer
    downloadBlob(new Blob([buffer], { type: XLSX_MIME }), filename)
}
import * as React from "react"
import { Upload } from "lucide-react"

import cn from "../../utils/cn"

export interface DropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  label?: string
  hint?: string
  error?: string
  className?: string
}

/** Ô "Drag and drop here to upload" ở Token Creator / NFT Creator */
const Dropzone = ({
  onFilesSelected,
  accept = "image/png,image/jpeg",
  multiple = false,
  label = "Drag and drop here to upload",
  hint = "png, .jpg, 1000x1000px",
  error,
  className,
}: DropzoneProps) => {
  const [dragging, setDragging] = React.useState(false)

  const handleFiles = (list: FileList | null) => {
    if (list && list.length > 0) onFilesSelected(Array.from(list))
  }

  return (
    <div className="flex w-full flex-col gap-1.5">
      <label
        onDragOver={(e) => {
          e.preventDefault()
          setDragging(true)
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragging(false)
          handleFiles(e.dataTransfer.files)
        }}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed px-4 py-6 text-center transition-colors",
          "focus-within:border-teal-600 hover:border-teal-600/60",
          dragging ? "border-teal-600 bg-teal-50" : "border-border bg-background",
          error && "border-destructive",
          className
        )}
      >
        <Upload className="size-4 text-muted-foreground" />
        <span className="text-xs font-medium">{label}</span>
        <span className="text-[10px] text-muted-foreground">{hint}</span>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = "" // cho phép chọn lại cùng 1 file
          }}
        />
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export { Dropzone }
export default Dropzone

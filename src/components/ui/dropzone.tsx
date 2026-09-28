import * as React from "react"

import cn from "../../utils/cn"
import Icon from "./icon"

export interface DropzoneProps {
  onFilesSelected: (files: File[]) => void
  accept?: string
  multiple?: boolean
  label?: string
  hint?: string
  error?: string
  className?: string
  /** URL xem trước (vd: ảnh token/NFT vừa chọn) - hiện thay cho vùng kéo-thả */
  previewUrl?: string
  /** Cho phép xoá ảnh đã chọn (nút "x" góc trên phải preview) */
  onRemove?: () => void
}

const Dropzone = ({
  onFilesSelected,
  accept = "image/png,image/jpeg",
  multiple = false,
  label = "Drag and drop here to upload",
  hint = "png, .jpg, 1000x1000px",
  error,
  className,
  previewUrl,
  onRemove,
}: DropzoneProps) => {
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleFiles = (list: FileList | null) => {
    if (list && list.length > 0) onFilesSelected(Array.from(list))
  }

  if (previewUrl) {
    return (
      <div className="flex w-full flex-col gap-1.5">
        <div
          className={cn(
            "relative flex items-center justify-center overflow-hidden rounded-lg border border-border bg-muted",
            className
          )}
        >
          <img src={previewUrl} alt="Uploaded preview" className="max-h-full w-full object-cover" />

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/0 text-transparent transition-colors hover:bg-black/40 hover:text-white focus-visible:bg-black/40 focus-visible:text-white focus-visible:outline-none"
          >
            <Icon name="upload" size="sm" />
            <span className="text-xs font-medium">Change image</span>
          </button>

          {onRemove && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onRemove()
              }}
              aria-label="Remove image"
              className="absolute right-2 top-2 rounded-full bg-black/60 p-1 text-white transition-colors hover:bg-black/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Icon name="close" size="xs" />
            </button>
          )}

          <input
            ref={inputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            className="sr-only"
            onChange={(e) => {
              handleFiles(e.target.files)
              e.target.value = ""
            }}
          />
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    )
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
        <Icon name="upload" size="md" className="text-muted-foreground" />
        <span className="text-xs font-medium">{label}</span>
        <span className="text-[10px] text-muted-foreground">{hint}</span>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => {
            handleFiles(e.target.files)
            e.target.value = ""
          }}
        />
      </label>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}

export { Dropzone }
export default Dropzone
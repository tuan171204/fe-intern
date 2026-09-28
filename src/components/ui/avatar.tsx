import * as React from "react"

import cn from "../../utils/cn"

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  src?: string
  alt?: string
  /** Chữ hiển thị khi không có ảnh / ảnh lỗi (vd: ký tự đầu của tên token) */
  fallback?: string
  size?: "sm" | "md" | "lg"
}

const sizes = { sm: "size-6 text-[10px]", md: "size-8 text-xs", lg: "size-10 text-sm" }

const Avatar = ({ src, alt = "", fallback, size = "md", className, ...props }: AvatarProps) => {
  const [failed, setFailed] = React.useState(false)
  const showImage = !!src && !failed

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-teal-100 font-medium text-teal-700",
        sizes[size],
        className
      )}
      {...props}
    >
      {showImage ? (
        <img src={src} alt={alt} onError={() => setFailed(true)} className="size-full object-cover" />
      ) : (
        (fallback ?? alt).slice(0, 2).toUpperCase()
      )}
    </span>
  )
}

export { Avatar }
export default Avatar

import * as React from "react"

import cn from "../../utils/cn"

/** Placeholder khi đang tải dữ liệu bảng/danh sách */
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("animate-pulse rounded-md bg-muted", className)} {...props} />
)

export { Skeleton }
export default Skeleton

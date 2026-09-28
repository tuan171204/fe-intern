import * as React from "react"

import cn from "../../utils/cn"

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Giá trị từ 0 đến 100 */
  value: number
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ value, className, ...props }, ref) => {
    const clamped = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0))

    return (
      <div
        ref={ref}
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={clamped}
        className={cn("h-1.5 w-full overflow-hidden rounded-full bg-teal-100", className)}
        {...props}
      >
        <div
          className="h-full rounded-full bg-teal-600 transition-all duration-500 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
    )
  }
)
Progress.displayName = "Progress"

export { Progress }
export default Progress

import cn from "../../utils/cn"

export interface TabOption<T extends string> {
  value: T
  label: string
}

export interface TabsProps<T extends string> {
  options: TabOption<T>[]
  value: T
  onChange: (value: T) => void
  /** solid: segmented control nền xám, tab active màu teal. subtle: không nền, tab active nền xám nhạt */
  variant?: "solid" | "subtle"
  className?: string
}

/** Segmented control, vd: "BNB Chain | Base" ở Leaderboard, "Tokens | NFTs" ở Profile */
function Tabs<T extends string>({ options, value, onChange, variant = "solid", className }: TabsProps<T>) {
  const subtle = variant === "subtle"

  return (
    <div
      role="tablist"
      className={cn("inline-flex items-center gap-1", !subtle && "rounded-lg bg-muted p-1", className)}
    >
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(opt.value)}
            className={cn(
              "rounded-md font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              subtle ? "px-4 py-1.5 text-sm" : "px-3 py-1 text-xs",
              active
                ? subtle
                  ? "bg-muted text-foreground"
                  : "bg-teal-600 text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

export { Tabs }
export default Tabs
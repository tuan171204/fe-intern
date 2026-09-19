import cn from "../../utils/cn"

export interface TabOption<T extends string> {
  value: T
  label: string
}

export interface TabsProps<T extends string> {
  options: TabOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
}

/** Segmented control, vd: "BNB Chain | Base" ở Leaderboard */
function Tabs<T extends string>({ options, value, onChange, className }: TabsProps<T>) {
  return (
    <div role="tablist" className={cn("inline-flex items-center gap-1 rounded-lg bg-muted p-1", className)}>
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
              "rounded-md px-3 py-1 text-xs font-medium transition-colors",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              active ? "bg-teal-600 text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
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

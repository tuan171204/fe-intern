import cn from "../../utils/cn"
import { getPasswordStrength } from "../../utils/validators"

export interface PasswordStrengthMeterProps {
    password: string
    className?: string
}

const LEVEL_CONFIG = {
    weak: { label: "Weak", barClass: "bg-destructive", widthClass: "w-1/3", textClass: "text-destructive" },
    medium: { label: "Medium", barClass: "bg-amber-500", widthClass: "w-2/3", textClass: "text-amber-600" },
    strong: { label: "Strong", barClass: "bg-teal-600", widthClass: "w-full", textClass: "text-teal-600" },
} as const

const PasswordStrengthMeter = ({ password, className }: PasswordStrengthMeterProps) => {
    const strength = getPasswordStrength(password)
    if (strength.level === "empty") return null

    const config = LEVEL_CONFIG[strength.level]

    return (
        <div className={cn("flex flex-col gap-1", className)}>
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-teal-100">
                <div className={cn("h-full rounded-full transition-all duration-300", config.barClass, config.widthClass)} />
            </div>
            <p className={cn("text-base text-center font-normal", config.textClass)}>
                Password strength: {config.label}
            </p>
        </div>
    )
}

export { PasswordStrengthMeter }
export default PasswordStrengthMeter
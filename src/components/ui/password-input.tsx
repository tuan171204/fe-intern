import * as React from "react"

import cn from "../../utils/cn"
import Icon from "./icon"
import { Input, type InputProps } from "./input"

export type PasswordInputProps = Omit<InputProps, "type" | "endAdornment" | "placeholder">

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(({ className, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false)

    return (
        <Input
            ref={ref}
            type={visible ? "text" : "password"}
            placeholder=" "
            className={cn(
                "placeholder-shown:bg-[url('/password-placeholder.svg')] bg-[size:auto_10px] placeholder-shown:bg-[position:12px_center] placeholder-shown:bg-no-repeat",
                className
            )}
            endAdornment={
                <button
                    type="button"
                    onClick={() => setVisible((v) => !v)}
                    aria-label={visible ? "Hide password" : "Show password"}
                    className="text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                    <Icon name={visible ? "eye" : "eye-off"} size="lg" />
                </button>
            }
            {...props}
        />
    )
})
PasswordInput.displayName = "PasswordInput"

export { PasswordInput }
export default PasswordInput
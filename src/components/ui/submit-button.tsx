import * as React from "react"

import cn from "../../utils/cn"
import { Button, type ButtonProps } from "./button"

const SubmitButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, type = "submit", children, ...props }, ref) => (
        <Button
            ref={ref}
            type={type}
            className={cn("h-12 w-full rounded-full bg-teal-600 font-normal text-white hover:bg-teal-700", className)}
            {...props}
        >
            {children}
        </Button>
    )
)
SubmitButton.displayName = "SubmitButton"

export { SubmitButton }
export default SubmitButton
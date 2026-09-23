import * as React from "react"

import { Input } from "../ui/input"
import { PasswordInput } from "../ui/password-input"
import { PasswordStrengthMeter } from "../ui/password-strength"
import { SubmitButton } from "../ui/submit-button"
import { useFormValidation } from "../../hooks/useFormValidation"
import { useAuth } from "../../store/AuthContext"
import { registerUser } from "../../mocks/auth"
import { getPasswordStrength, isValidWalletAddress } from "../../utils/validators"
import type { AuthFormProps } from "./SignInForm"

type RegisterValues = {
    address: string
    password: string
    confirmPassword: string
}

const INITIAL_VALUES: RegisterValues = { address: "", password: "", confirmPassword: "" }

const validate = (values: RegisterValues) => {
    const errors: Partial<Record<keyof RegisterValues, string>> = {}

    if (!values.address.trim()) errors.address = "Wallet address is required"
    else if (!isValidWalletAddress(values.address)) errors.address = "Invalid wallet address (format: 0x + 40 hex characters)"

    if (!values.password) errors.password = "Password is required"
    else if (getPasswordStrength(values.password).level !== "strong")
        errors.password = "Password is not strong enough. Requires at least 6 characters with uppercase, lowercase, numbers, and special characters"

    if (!values.confirmPassword) errors.confirmPassword = "Please confirm your password"
    else if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords do not match"

    return errors
}

const RegisterForm = ({ onSwitch, onSuccess }: AuthFormProps) => {
    const { login } = useAuth()
    const { values, setField, fieldError, errors, touchAll } = useFormValidation(INITIAL_VALUES, validate)
    const [submitError, setSubmitError] = React.useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        touchAll()
        setSubmitError("")

        if (Object.keys(errors).length > 0) return

        const result = registerUser(values.address.trim(), values.password)
        if (!result.success) {
            setSubmitError(result.error ?? "Registration failed")
            return
        }

        login(values.address.trim())
        onSuccess()
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <Input
                label="Wallet Address"
                placeholder="0x..."
                autoComplete="off"
                className="h-11"
                value={values.address}
                onChange={(e) => setField("address", e.target.value)}
                error={fieldError("address")}
            />

            <div className="flex flex-col gap-1.5">
                <PasswordInput
                    label="Password"
                    autoComplete="new-password"
                    className="h-11"
                    value={values.password}
                    onChange={(e) => setField("password", e.target.value)}
                    error={fieldError("password")}
                />
                {values.password && <PasswordStrengthMeter password={values.password} />}
            </div>

            <PasswordInput
                label="Confirm Password"
                autoComplete="new-password"
                className="h-11"
                value={values.confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
                error={fieldError("confirmPassword")}
            />

            {submitError && (
                <p role="alert" className="text-center text-xs text-destructive">
                    {submitError}
                </p>
            )}

            <SubmitButton className="mt-2 tracking-widest">Register</SubmitButton>

            <button
                type="button"
                onClick={onSwitch}
                className="mx-auto mt-2 text-xs underline underline-offset-2 hover:text-teal-600"
            >
                You already have an Account?
            </button>
        </form>
    )
}

export { RegisterForm }
export default RegisterForm
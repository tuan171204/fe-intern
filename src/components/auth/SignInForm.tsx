import * as React from "react"

import { Input } from "../ui/input"
import { PasswordInput } from "../ui/password-input"
import { SubmitButton } from "../ui/submit-button"
import { useAuth } from "../../store/AuthContext"
import { validateCredentials } from "../../mocks/auth"

export interface AuthFormProps {
    /** Chuyển sang form còn lại (Sign In <-> Register) */
    onSwitch: () => void
    /** Gọi khi đăng nhập/đăng ký thành công */
    onSuccess: () => void
}

const SignInForm = ({ onSwitch, onSuccess }: AuthFormProps) => {
    const { login } = useAuth()
    const [address, setAddress] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [touched, setTouched] = React.useState(false)
    const [notFound, setNotFound] = React.useState(false)

    const addressError = touched && !address.trim() ? "Wallet address is required" : undefined
    const passwordError = touched && !password ? "Password is required" : undefined

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setTouched(true)
        setNotFound(false)

        if (!address.trim() || !password) return

        if (!validateCredentials(address.trim(), password)) {
            setNotFound(true)
            return
        }

        login(address.trim())
        onSuccess()
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <Input
                label="Wallet Address"
                placeholder="0x..."
                autoComplete="off"
                className="h-11"
                value={address}
                onChange={(e) => {
                    setAddress(e.target.value)
                    setNotFound(false)
                }}
                error={addressError}
            />
            <PasswordInput
                label="Password"
                autoComplete="current-password"
                className="h-11"
                value={password}
                onChange={(e) => {
                    setPassword(e.target.value)
                    setNotFound(false)
                }}
                error={passwordError}
            />

            <SubmitButton className="mt-2 tracking-widest">Sign</SubmitButton>

            {notFound && (
                <p role="alert" className="-mt-2 text-center text-xs text-destructive">
                    Account not found. Please check your wallet address or password.
                </p>
            )}

            <button
                type="button"
                onClick={onSwitch}
                className="mx-auto mt-2 text-xs underline underline-offset-2 hover:text-teal-600"
            >
                You haven&apos;t Account?
            </button>
        </form>
    )
}

export { SignInForm }
export default SignInForm
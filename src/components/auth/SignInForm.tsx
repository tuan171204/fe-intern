// File: src/components/auth/SignInForm.tsx
import * as React from "react"

import { Input } from "../ui/input"
import { PasswordInput } from "../ui/password-input"
import { SubmitButton } from "../ui/submit-button"
import { signIn } from "../../api/auth"
import { useAuth } from "../../store/AuthContext"
import { useToast } from "../../store/ToastContext"
import { getErrorMessage } from "../../utils/api"

export interface AuthFormProps {
    /** Chuyển sang form còn lại (Sign In <-> Register) */
    onSwitch: () => void
    /** Gọi khi đăng nhập/đăng ký thành công */
    onSuccess: () => void
}

const SignInForm = ({ onSwitch, onSuccess }: AuthFormProps) => {
    const { login } = useAuth()
    const { success, error } = useToast()
    const [address, setAddress] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [touched, setTouched] = React.useState(false)
    const [submitting, setSubmitting] = React.useState(false)

    const addressError = touched && !address.trim() ? "Wallet address is required" : undefined
    const passwordError = touched && !password ? "Password is required" : undefined

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setTouched(true)

        if (!address.trim() || !password || submitting) return

        setSubmitting(true)
        try {
            const { data: token } = await signIn({ walletAddress: address.trim(), password })
            login(token)
            success("Signed in successfully")
            onSuccess()
        } catch (err) {
            error(getErrorMessage(err, "Sign in failed"))
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form className="flex flex-col gap-4" onSubmit={handleSubmit} noValidate>
            <Input
                label="Wallet Address"
                placeholder="0x..."
                autoComplete="off"
                className="h-11"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={addressError}
            />
            <PasswordInput
                label="Password"
                autoComplete="current-password"
                className="h-11"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={passwordError}
            />

            <SubmitButton loading={submitting} disabled={submitting} className="mt-2 tracking-widest">
                Sign
            </SubmitButton>

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
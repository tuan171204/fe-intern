import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { PasswordInput } from "../ui/password-input"

export interface AuthFormProps {
    /** Chuyển sang form còn lại (Sign In <-> Register) */
    onSwitch: () => void
}

const SignInForm = ({ onSwitch }: AuthFormProps) => (
    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Wallet Address" placeholder="0x..." autoComplete="off" className="h-11" />
        <PasswordInput label="Password" autoComplete="current-password" className="h-11" />

        <Button type="submit" className="mt-2 h-12 w-full font-normal tracking-widest rounded-full bg-teal-600 text-white hover:bg-teal-700">
            Sign
        </Button>

        <button
            type="button"
            onClick={onSwitch}
            className="mx-auto mt-2 text-xs underline underline-offset-2 hover:text-teal-600"
        >
            You haven&apos;t Account?
        </button>
    </form>
)

export { SignInForm }
export default SignInForm
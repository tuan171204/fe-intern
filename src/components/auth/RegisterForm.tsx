import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { PasswordInput } from "../ui/password-input"
import type { AuthFormProps } from "./SignInForm"

const RegisterForm = ({ onSwitch }: AuthFormProps) => (
    <form className="flex flex-col gap-4" onSubmit={(e) => e.preventDefault()}>
        <Input label="Wallet Address" placeholder="0x..." autoComplete="off" className="h-11" />
        <PasswordInput label="Password" autoComplete="new-password" className="h-11" />
        <PasswordInput
            label="Confirm Password"
            autoComplete="new-password"
            className="h-11"
        />

        <Button type="submit" className="mt-2 h-12 w-full font-normal tracking-widest rounded-full bg-teal-600 text-white hover:bg-teal-700">
            Register
        </Button>

        <button
            type="button"
            onClick={onSwitch}
            className="mx-auto mt-2 text-xs underline underline-offset-2 hover:text-teal-600"
        >
            You already have an Account?
        </button>
    </form>
)

export { RegisterForm }
export default RegisterForm
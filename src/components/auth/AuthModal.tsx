import * as React from "react"

import { Dialog } from "../ui/dialog"
import RegisterForm from "./RegisterForm"
import SignInForm from "./SignInForm"

export type AuthView = "signIn" | "register"

export interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    /** Form hiển thị khi mở modal (mặc định: signIn) */
    defaultView?: AuthView
}

const TITLES: Record<AuthView, string> = {
    signIn: "Sign In",
    register: "Register",
}

const AuthModal = ({ isOpen, onClose, defaultView = "signIn" }: AuthModalProps) => {
    const [view, setView] = React.useState<AuthView>(defaultView)

    const handleClose = () => {
        onClose()
        setView(defaultView) // lần mở sau luôn bắt đầu từ form mặc định
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} title={TITLES[view]}>
            {view === "signIn" ? (
                <SignInForm onSwitch={() => setView("register")} />
            ) : (
                <RegisterForm onSwitch={() => setView("signIn")} />
            )}
        </Dialog>
    )
}

export { AuthModal }
export default AuthModal
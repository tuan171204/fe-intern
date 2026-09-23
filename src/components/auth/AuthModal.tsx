import * as React from "react"
import { useNavigate } from "react-router-dom"

import { Dialog } from "../ui/dialog"
import RegisterForm from "./RegisterForm"
import SignInForm from "./SignInForm"

export type AuthView = "signIn" | "register"

export interface AuthModalProps {
    isOpen: boolean
    onClose: () => void
    defaultView?: AuthView
}

const TITLES: Record<AuthView, string> = {
    signIn: "Sign In",
    register: "Register",
}

const AuthModal = ({ isOpen, onClose, defaultView = "signIn" }: AuthModalProps) => {
    const [view, setView] = React.useState<AuthView>(defaultView)
    const navigate = useNavigate()

    const handleClose = () => {
        onClose()
        setView(defaultView)
    }

    const handleSuccess = () => {
        onClose()
        setView(defaultView)
        navigate("/dashboard")
    }

    return (
        <Dialog isOpen={isOpen} onClose={handleClose} title={TITLES[view]}>
            {view === "signIn" ? (
                <SignInForm onSwitch={() => setView("register")} onSuccess={handleSuccess} />
            ) : (
                <RegisterForm onSwitch={() => setView("signIn")} onSuccess={handleSuccess} />
            )}
        </Dialog>
    )
}

export { AuthModal }
export default AuthModal
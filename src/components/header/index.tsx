import { Link } from "react-router-dom"

import ConnectWalletButton from "../wallet/ConnectWalletButton"

const Header = () => (
    <header className="border-b border-border bg-background">
        <div className="flex h-16 items-center justify-between px-4 sm:px-6">
            <Link to="/" className="text-lg font-bold text-teal-600">
                ACW3
            </Link>

            <ConnectWalletButton className="h-9 rounded-full bg-teal-600 px-4 text-white hover:bg-teal-700" />
        </div>
    </header>
)

export { Header }
export default Header
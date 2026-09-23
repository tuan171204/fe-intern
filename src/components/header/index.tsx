import * as React from "react"
import { Link } from "react-router-dom"

import AuthModal from "../auth/AuthModal"
import { Avatar } from "../ui/avatar"
import { Button } from "../ui/button"
import { CopyAddress } from "../ui/copy-address"

export interface HeaderProps {
    isConnected?: boolean
    address?: string
    balance?: string
}

// Dữ liệu tĩnh mẫu -> hiển thị "0x71C...3A9f"
const DEMO_ADDRESS = "0x71C7656EC7ab88b098defB751B7401B5f6d83A9f"

const Header = ({ isConnected = false, address = DEMO_ADDRESS, balance = "200 ZKN" }: HeaderProps) => {
    const [modalOpen, setModalOpen] = React.useState(false)

    return (
        <header className="border-b border-border bg-background">
            <div className="flex h-16 items-center justify-between px-4 sm:px-6">
                <Link to="/" className="text-lg font-bold text-teal-600">
                    ACW3
                </Link>

                {isConnected ? (
                    <div className="flex items-center gap-2 rounded-full border border-border py-1 pl-1 pr-3">
                        <Avatar fallback="0x" size="md" />
                        <div className="flex flex-col leading-tight">
                            <CopyAddress address={address} head={5} tail={4} className="text-[11px] text-foreground" />
                            <span className="text-[10px] text-muted-foreground">{balance}</span>
                        </div>
                    </div>
                ) : (
                    <Button
                        onClick={() => setModalOpen(true)}
                        className="rounded-full bg-teal-600 px-6 text-white hover:bg-teal-700"
                    >
                        Connect
                    </Button>
                )}
            </div>

            <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </header>
    )
}

export { Header }
export default Header
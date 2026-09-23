import * as React from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "../left-menu"
import DashboardHeader from "./DashboardHeader"

const DashboardLayout = () => {
    const [menuOpen, setMenuOpen] = React.useState(false)

    return (
        <div className="flex min-h-svh bg-background text-foreground">
            <Sidebar isOpen={menuOpen} onClose={() => setMenuOpen(false)} />
            <div className="flex min-w-0 flex-1 flex-col">
                <DashboardHeader onMenuClick={() => setMenuOpen(true)} />
                <main className="flex-1 bg-muted/50 p-3 sm:p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export { DashboardLayout }
export default DashboardLayout
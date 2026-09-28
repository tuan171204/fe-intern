import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "../../store/AuthContext"

/** Chặn người dùng đã đăng nhập quay lại trang Connect */
const GuestRoute = () => {
    const { isLogged } = useAuth()
    return isLogged ? <Navigate to="/dashboard" replace /> : <Outlet />
}

export default GuestRoute
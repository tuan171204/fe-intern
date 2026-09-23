import { Navigate, Outlet } from "react-router-dom"

import { useAuth } from "../../store/AuthContext"

/** Chỉ cho phép truy cập khi đã đăng nhập, ngược lại điều hướng về trang Connect */
const ProtectedRoute = () => {
    const { isLogged } = useAuth()
    return isLogged ? <Outlet /> : <Navigate to="/" replace />
}

export default ProtectedRoute
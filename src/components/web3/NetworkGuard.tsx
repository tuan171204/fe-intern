import { useNetworkGuard } from "../../hooks/useNetworkGuard"
import { useAuth } from "../../store/AuthContext"
import { useWalletAuth } from "../../store/WalletAuthContext"

/**
 * Không có UI, kích hoạt Chain Guard (tự yêu cầu chuyển sang Sepolia) cho toàn app.
 * - Chưa đăng nhập: việc chuyển mạng do flow SIWE (WalletAuthContext) đảm nhiệm, để không có 2 popup MetaMask cùng lúc.
 * - Đã đăng nhập: nếu user đổi sang mạng khác thì yêu cầu chuyển lại (khi không có flow nào đang chạy).
 * Phải được render bên trong AuthProvider và WalletAuthProvider.
 */
const NetworkGuard = () => {
    const { isLogged } = useAuth()
    const { isBusy } = useWalletAuth()

    useNetworkGuard({ autoSwitch: isLogged && !isBusy })
    return null
}

export { NetworkGuard }
export default NetworkGuard
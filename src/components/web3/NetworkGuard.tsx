import { useNetworkGuard } from "../../hooks/useNetworkGuard"
import { useAuth } from "../../store/AuthContext"
import { useWalletAuth } from "../../store/WalletAuthContext"

/**
 * Component không có UI, kích hoạt Chain Guard toàn app.
 * Chỉ tự chuyển mạng khi đã đăng nhập và luồng SIWE không bận; trong lúc đăng nhập,
 */
const NetworkGuard = () => {
    const { isLogged } = useAuth()
    const { isBusy } = useWalletAuth()

    useNetworkGuard({ autoSwitch: isLogged && !isBusy })
    return null
}

export { NetworkGuard }
export default NetworkGuard
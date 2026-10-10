import { useNetworkGuard } from "../../hooks/useNetworkGuard"

/** Component không có UI, dùng kích hoạt Chain Guard cho toàn app. */
const NetworkGuard = () => {
    useNetworkGuard()
    return null
}

export { NetworkGuard }
export default NetworkGuard
import { useNetworkGuard } from "../../hooks/useNetworkGuard"

/** Component không có UI, chỉ kích hoạt Chain Guard (tự yêu cầu chuyển sang Sepolia) cho toàn app. */
const NetworkGuard = () => {
    useNetworkGuard({ autoSwitch: true })
    return null
}

export { NetworkGuard }
export default NetworkGuard
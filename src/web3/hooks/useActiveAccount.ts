// MetaMask KHÔNG cho dApp tự đổi account đang chọn của ví. dApp chỉ thấy danh sách `addresses`
// (các account đã cấp quyền) và `address` luôn là account đầu tiên.
// Hook này cho phép chọn một account trong danh sách đó để dùng trong app. Khi gửi giao dịch
// phải truyền `account` tường minh (xem useEthTransfer / useErc20Transfer).
import { useState } from 'react'
import { useAccount } from 'wagmi'
import type { Address } from 'viem'

export function useActiveAccount() {
    const { address: walletAddress, addresses } = useAccount()
    const [picked, setPicked] = useState<Address | undefined>()
    const [seenWallet, setSeenWallet] = useState(walletAddress)

    // MetaMask đổi account (hoặc ngắt kết nối) -> bỏ lựa chọn trong app, đi theo ví.
    // (Cập nhật state ngay trong lúc render là cách React khuyến nghị thay cho useEffect.)
    if (seenWallet !== walletAddress) {
        setSeenWallet(walletAddress)
        setPicked(undefined)
    }

    const accounts: readonly Address[] = addresses ?? (walletAddress ? [walletAddress] : [])
    const address = picked && accounts.includes(picked) ? picked : walletAddress

    return { address, accounts, selectAccount: setPicked }
}
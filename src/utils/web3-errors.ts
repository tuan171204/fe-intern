interface ErrorLike {
    name?: unknown
    code?: unknown
    message?: unknown
    shortMessage?: unknown
    cause?: unknown
}

/** Duyệt toàn bộ chuỗi `cause` (viem / wagmi / MetaMask đều bọc lỗi lồng nhau). */
const errorChain = (error: unknown): ErrorLike[] => {
    const chain: ErrorLike[] = []
    let current: unknown = error
    for (let depth = 0; depth < 10 && current && typeof current === "object"; depth++) {
        chain.push(current as ErrorLike)
        current = (current as ErrorLike).cause
    }
    return chain
}

/** Người dùng bấm Reject / đóng popup MetaMask (EIP-1193 code 4001). */
export const isUserRejection = (error: unknown) =>
    errorChain(error).some((e) => e.code === 4001 || e.name === "UserRejectedRequestError")

/** Không tìm thấy provider (chưa cài MetaMask hoặc bị tắt). */
export const isProviderNotFound = (error: unknown) =>
    errorChain(error).some((e) => e.name === "ProviderNotFoundError")

/** MetaMask đang có một yêu cầu khác chờ xử lý (code -32002). */
export const isRequestPending = (error: unknown) =>
    errorChain(error).some((e) => e.code === -32002 || e.name === "ResourceUnavailableRpcError")

/**
 * Thông báo cho người dùng từ lỗi của ví.
 * `rejectedMessage`: nội dung riêng khi người dùng từ chối (kết nối / chuyển mạng).
 */
export function getWalletErrorMessage(
    error: unknown,
    rejectedMessage = "Bạn đã từ chối yêu cầu trong MetaMask."
): string {
    if (isProviderNotFound(error)) {
        return "Không tìm thấy ví MetaMask. Hãy cài extension MetaMask rồi tải lại trang."
    }
    if (isUserRejection(error)) return rejectedMessage
    if (isRequestPending(error)) {
        return "MetaMask đang có một yêu cầu chờ xử lý. Hãy mở extension MetaMask để xác nhận hoặc hủy."
    }

    const [first] = errorChain(error)
    if (typeof first?.shortMessage === "string" && first.shortMessage) return first.shortMessage
    if (typeof first?.message === "string" && first.message) return first.message
    return "Đã có lỗi xảy ra. Vui lòng thử lại."
}
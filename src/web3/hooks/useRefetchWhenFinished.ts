import { useEffect } from 'react'

/** Chờ thêm rồi đọc lại lần nữa */
const SECOND_REFETCH_DELAY_MS = 4000

/**
 * Khi giao dịch kết thúc (isFinished chuyển sang true): đọc lại dữ liệu ngay,
 * rồi đọc lại lần nữa sau vài giây để chắc chắn lấy được số dư mới.
 * `refetch` phải có identity ổn định.
 */
export function useRefetchWhenFinished(isFinished: boolean, refetch: () => unknown) {
    useEffect(() => {
        if (!isFinished) return
        void refetch()
        const timer = window.setTimeout(() => void refetch(), SECOND_REFETCH_DELAY_MS)
        return () => window.clearTimeout(timer)
    }, [isFinished, refetch])
}
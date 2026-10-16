import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
    children: ReactNode
}

interface ErrorBoundaryState {
    error: Error | null
}

/** Bắt lỗi xảy ra khi render để hiện thông báo thay vì màn hình trắng. */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { error: null }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { error }
    }

    componentDidCatch(error: Error, info: ErrorInfo) {
        console.error('UI crashed:', error, info.componentStack)
    }

    render() {
        if (!this.state.error) return this.props.children

        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
                <div role="alert" className="max-w-md rounded-3xl border border-rose-200 bg-white p-6 text-center shadow-sm">
                    <h1 className="text-lg font-semibold text-slate-900">Đã có lỗi xảy ra</h1>
                    <p className="mt-2 text-sm text-slate-600">
                        Ứng dụng gặp sự cố không mong muốn. Ví và tài sản của bạn không bị ảnh hưởng. Hãy tải lại trang để
                        thử lại.
                    </p>
                    <p className="mt-3 break-words rounded-lg bg-slate-50 p-2 font-mono text-xs text-slate-500">
                        {this.state.error.message}
                    </p>
                    <button
                        type="button"
                        onClick={() => window.location.reload()}
                        className="mt-5 inline-flex cursor-pointer items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500"
                    >
                        Tải lại trang
                    </button>
                </div>
            </div>
        )
    }
}
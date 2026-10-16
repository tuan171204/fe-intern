import * as React from "react"

/** Copy text vào clipboard, `copied` tự về false sau `resetMs`. */
export function useCopy(resetMs = 1500) {
    const [copied, setCopied] = React.useState(false)
    const timer = React.useRef<number | undefined>(undefined)

    React.useEffect(() => () => window.clearTimeout(timer.current), [])

    const copy = React.useCallback(
        async (text: string) => {
            try {
                await navigator.clipboard.writeText(text)
                setCopied(true)
                window.clearTimeout(timer.current)
                timer.current = window.setTimeout(() => setCopied(false), resetMs)
            } catch {
                /* clipboard bị chặn (http, quyền trình duyệt): bỏ qua */
            }
        },
        [resetMs]
    )

    return { copied, copy }
}
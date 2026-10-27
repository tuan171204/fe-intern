import * as React from "react"

export type Theme = "light" | "dark"

/* Keep in sync with the inline script in index.html */
const STORAGE_KEY = "theme"
const TRANSITION_CLASS = "theme-transition"
const TRANSITION_MS = 350

interface ThemeContextValue {
    theme: Theme
    setTheme: (theme: Theme) => void
    toggleTheme: () => void
}

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined)

const isTheme = (value: unknown): value is Theme => value === "light" || value === "dark"

const readStoredTheme = (): Theme | null => {
    try {
        const value = localStorage.getItem(STORAGE_KEY)
        return isTheme(value) ? value : null
    } catch {
        return null
    }
}

const getSystemTheme = (): Theme =>
    window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"

const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    /* First visit follows the OS preference; an explicit choice is persisted */
    const [theme, setThemeState] = React.useState<Theme>(() => readStoredTheme() ?? getSystemTheme())
    const timer = React.useRef<number | undefined>(undefined)

    /* Mirror the theme on <html> so Tailwind's `dark:` variant and CSS variables apply */
    React.useEffect(() => {
        const root = document.documentElement
        root.classList.toggle("dark", theme === "dark")
        root.style.colorScheme = theme
    }, [theme])

    const setTheme = React.useCallback((next: Theme) => {
        const root = document.documentElement

        /* Enable color transitions only for the duration of the switch */
        root.classList.add(TRANSITION_CLASS)
        window.clearTimeout(timer.current)
        timer.current = window.setTimeout(() => root.classList.remove(TRANSITION_CLASS), TRANSITION_MS)

        setThemeState(next)
        try {
            localStorage.setItem(STORAGE_KEY, next)
        } catch {
            /* storage blocked (private mode): the preference just won't persist */
        }
    }, [])

    const toggleTheme = React.useCallback(
        () => setTheme(theme === "dark" ? "light" : "dark"),
        [theme, setTheme]
    )

    /* Keep multiple open tabs in sync */
    React.useEffect(() => {
        const onStorage = (e: StorageEvent) => {
            if (e.key === STORAGE_KEY && isTheme(e.newValue)) setThemeState(e.newValue)
        }
        window.addEventListener("storage", onStorage)
        return () => {
            window.removeEventListener("storage", onStorage)
            window.clearTimeout(timer.current)
        }
    }, [])

    const value = React.useMemo<ThemeContextValue>(
        () => ({ theme, setTheme, toggleTheme }),
        [theme, setTheme, toggleTheme]
    )

    return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

const useTheme = () => {
    const ctx = React.useContext(ThemeContext)
    if (!ctx) throw new Error("useTheme must be used within ThemeProvider")
    return ctx
}

export { ThemeProvider, useTheme }
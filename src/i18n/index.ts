import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"

import enJson from "./locales/en.json"
import viJson from "./locales/vi.json"

export const SUPPORTED_LANGUAGES = ["en", "vi"] as const
export type Language = (typeof SUPPORTED_LANGUAGES)[number]

export const LANGUAGE_STORAGE_KEY = "language"

const en = enJson
/* Compile-time guard: the build fails if vi.json is missing any key present in en.json */
const vi: typeof enJson = viJson

export const resources = {
    en: { translation: en },
    vi: { translation: vi },
} as const

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en",
        supportedLngs: [...SUPPORTED_LANGUAGES],
        nonExplicitSupportedLngs: true, // "vi-VN" resolves to "vi"
        load: "languageOnly",
        interpolation: { escapeValue: false }, // React already escapes rendered values
        detection: {
            // Saved choice first, then the browser language
            order: ["localStorage", "navigator"],
            lookupLocalStorage: LANGUAGE_STORAGE_KEY,
            caches: ["localStorage"],
        },
        react: { useSuspense: false }, 
    })

/* Keep <html lang> accurate for screen readers and browser translation tools */
const syncHtmlLang = (lng: string) => {
    document.documentElement.lang = lng.split("-")[0]
}
i18n.on("languageChanged", syncHtmlLang)
syncHtmlLang(i18n.resolvedLanguage ?? i18n.language ?? "en")

export default i18n
import * as React from "react"

type FieldErrors<T> = Partial<Record<keyof T, string>>
type FieldTouched<T> = Partial<Record<keyof T, boolean>>

/**
 * Hook validate form dùng chung cho các form trong dự án (Auth, Token Creator,
 * NFT Creator...). Lỗi 1 field chỉ hiện khi field đó đã "touched" (đã nhập);
 * touchAll() dùng lúc submit để lộ hết lỗi còn thiếu.
 */
export function useFormValidation<T extends Record<string, unknown>>(
    initialValues: T,
    validate: (values: T) => FieldErrors<T>
) {
    const [values, setValues] = React.useState<T>(initialValues)
    const [touched, setTouched] = React.useState<FieldTouched<T>>({})

    const errors = validate(values)

    const setField = <K extends keyof T>(field: K, value: T[K]) => {
        setValues((prev) => ({ ...prev, [field]: value }))
        setTouched((prev) => ({ ...prev, [field]: true }))
    }

    const fieldError = (field: keyof T) => (touched[field] ? errors[field] : undefined)

    const touchAll = () => {
        setTouched(
            Object.keys(values).reduce((acc, key) => {
                acc[key as keyof T] = true
                return acc
            }, {} as FieldTouched<T>)
        )
    }

    const reset = () => {
        setValues(initialValues)
        setTouched({})
    }

    return { values, setValues, setField, fieldError, errors, touchAll, reset }
}
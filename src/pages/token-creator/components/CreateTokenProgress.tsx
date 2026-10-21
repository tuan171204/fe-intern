import Icon from "../../../components/ui/icon"
import { Loading } from "../../../components/ui/loading"
import type { CreateTokenStep } from "../../../hooks/useCreateToken"
import cn from "../../../utils/cn"

const STAGES = [
    { step: "submitting", label: "Submitting Transaction", hint: "Confirm the transaction in MetaMask" },
    { step: "confirming", label: "Confirming on Chain", hint: "Waiting for the block confirmation" },
    { step: "saving", label: "Saving Metadata", hint: "Uploading image and token info" },
] as const

/** Vị trí giai đoạn đang chạy; save-failed = lỗi ở giai đoạn lưu metadata */
const activeIndex = (step: CreateTokenStep) => {
    if (step === "submitting") return 0
    if (step === "confirming") return 1
    if (step === "saving" || step === "save-failed") return 2
    return -1
}

export interface CreateTokenProgressProps {
    step: CreateTokenStep
    txUrl?: string
}

const CreateTokenProgress = ({ step, txUrl }: CreateTokenProgressProps) => {
    const current = activeIndex(step)
    if (current < 0) return null

    const failed = step === "save-failed"

    return (
        <div role="status" aria-live="polite" className="rounded-lg border border-border bg-muted/40 p-4">
            <ol className="flex flex-col gap-3">
                {STAGES.map((stage, index) => {
                    const done = index < current
                    const active = index === current
                    const stageFailed = active && failed

                    return (
                        <li key={stage.step} className="flex items-start gap-3">
                            <span
                                className={cn(
                                    "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border text-teal-600",
                                    done && "border-teal-600 bg-teal-600 text-white",
                                    active && !stageFailed && "border-teal-600",
                                    stageFailed && "border-destructive text-destructive",
                                    !done && !active && "border-border text-muted-foreground"
                                )}
                            >
                                {done && <Icon name="check" size="xs" />}
                                {active && !stageFailed && <Loading size="sm" className="size-3.5" />}
                                {stageFailed && <Icon name="alert" size="xs" />}
                            </span>
                            <div className="min-w-0">
                                <p className={cn("text-sm font-medium", !done && !active && "text-muted-foreground")}>
                                    {stage.label}
                                </p>
                                {active && !stageFailed && (
                                    <p className="text-xs text-muted-foreground">{stage.hint}</p>
                                )}
                            </div>
                        </li>
                    )
                })}
            </ol>

            {txUrl && (
                <a
                    href={txUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-block text-xs font-medium text-teal-600 underline underline-offset-2 hover:text-teal-700"
                >
                    View transaction on Etherscan
                </a>
            )}
        </div>
    )
}

export default CreateTokenProgress
import { Trans, useTranslation } from "react-i18next"

import { Button } from "../../../components/ui/button"
import { Dialog } from "../../../components/ui/dialog"

export interface CreateTokenSuccessModalProps {
    isOpen: boolean
    tokenName: string
    tokenSymbol: string
    txUrl?: string
    onViewTokens: () => void
    /** Close the modal / create another token */
    onClose: () => void
}

const CreateTokenSuccessModal = ({
    isOpen,
    tokenName,
    tokenSymbol,
    txUrl,
    onViewTokens,
    onClose,
}: CreateTokenSuccessModalProps) => {
    const { t } = useTranslation()

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title={t("tokenCreator.success.title")}>
            <div className="flex flex-col gap-4 text-center">
                <p className="text-sm">
                    <Trans
                        i18nKey="tokenCreator.success.body"
                        values={{ name: tokenName, symbol: tokenSymbol }}
                        components={{
                            b: <span className="font-semibold" />,
                            muted: <span className="text-muted-foreground" />,
                        }}
                    />
                </p>

                {txUrl && (
                    <a
                        href={txUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-teal-600 underline underline-offset-2 hover:text-teal-700"
                    >
                        {t("common.viewOnEtherscan")}
                    </a>
                )}

                <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                    <Button variant="outline" onClick={onClose} className="h-10 flex-1 rounded-full">
                        {t("tokenCreator.success.createAnother")}
                    </Button>
                    <Button onClick={onViewTokens} className="h-10 flex-1 rounded-full bg-teal-600 text-white hover:bg-teal-700">
                        {t("tokenCreator.success.viewTokens")}
                    </Button>
                </div>
            </div>
        </Dialog>
    )
}

export default CreateTokenSuccessModal
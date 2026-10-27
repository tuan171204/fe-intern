import { useTranslation } from "react-i18next"

import ConnectWalletButton from "../../components/wallet/ConnectWalletButton"

/* The hero keeps its light artwork colors in both themes on purpose (brand illustration) */
const Home = () => {
    const { t } = useTranslation()

    return (
        <div className="flex flex-1 flex-col bg-muted/50 p-3 sm:p-4 lg:px-5 lg:py-5">
            <section className="relative flex min-h-[22rem] flex-1 flex-col overflow-hidden rounded-2xl bg-[#6ebed7] md:min-h-[28rem] lg:min-h-[41.7rem]">
                <img
                    src="/hero-bg.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 w-full select-none [mask-image:linear-gradient(to_bottom,transparent,black_35%)] lg:inset-0 lg:h-full lg:object-contain lg:object-bottom lg:[mask-image:none]"
                />

                <div className="relative z-10 flex flex-[2] flex-col items-center justify-center gap-6 lg:gap-10 px-4 text-center sm:gap-4">
                    <h1 className="text-balance text-2xl font-medium text-black sm:text-3xl lg:text-4xl">
                        {t("connect.title")}
                    </h1>

                    <p className="max-w-xl text-balance text-base text-neutral-900 sm:text-lg lg:text-2xl">
                        {t("connect.subtitleLine1")}
                        <br className="hidden sm:block" /> {t("connect.subtitleLine2")}
                    </p>

                    <ConnectWalletButton
                        size="lg"
                        label={t("connect.cta")}
                        className="mt-1 h-11 rounded-full text-md bg-white px-8 py-7 text-teal-600 hover:bg-teal-700 lg:h-12"
                        secondaryClassName="mt-1 h-11 rounded-full border-white bg-white/30 px-8 py-7 text-md text-neutral-900 shadow-none backdrop-blur-sm hover:bg-white/50 lg:h-12"
                    />
                </div>
                <div className="flex-1" aria-hidden="true" />
            </section>
        </div>
    )
}

export default Home
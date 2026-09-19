import * as React from "react"

import AuthModal from "../../components/auth/AuthModal"
import { Button } from "../../components/ui/button"

const Home = () => {
    const [modalOpen, setModalOpen] = React.useState(false)

    return (
        <div className="flex flex-1 flex-col bg-muted/50 p-3 sm:p-4 lg:px-7 lg:py-5">
            {/* bg-[#6ebed7]: màu trời ở mép trên ảnh, chỉnh lại nếu thấy lệch màu trên mobile/tablet */}
            <section className="relative flex min-h-[22rem] flex-1 flex-col overflow-hidden rounded-md bg-[#6ebed7] md:min-h-[28rem] lg:min-h-[41rem]">
                {/* Mobile/tablet: ảnh full chiều ngang, nằm sát đáy, mép trên mờ dần vào nền trời (không bị cắt hai bên).
            Desktop (lg+): ảnh phủ kín (cover). */}
                <img
                    src="/hero-bg.png"
                    alt=""
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 bottom-0 w-full select-none [mask-image:linear-gradient(to_bottom,transparent,black_35%)] lg:inset-0 lg:h-full lg:object-contain lg:object-bottom lg:[mask-image:none]"
                />

                {/* Nội dung nằm ở ~80% phía trên (tâm khối chữ ≈ 40% chiều cao hero); 20% dưới để lộ đồng cỏ */}
                <div className="relative z-10 flex flex-[2] flex-col items-center justify-center gap-6 lg:gap-10 px-4 text-center sm:gap-4">
                    <h1 className="text-balance text-2xl font-medium text-black sm:text-3xl lg:text-4xl">
                        Tokens &amp; NFT with Ease
                    </h1>

                    <p className="max-w-xl text-balance text-base text-neutral-900 sm:text-lg lg:text-2xl">
                        Launch Token, Liquidity, Airdrops and much more.
                        <br className="hidden sm:block" /> Effortless and without coding.
                    </p>

                    <Button
                        size="lg"
                        onClick={() => setModalOpen(true)}
                        className="mt-1 h-11 rounded-full text-md bg-white px-8 py-7 text-teal-600 hover:bg-teal-700 lg:h-12"
                    >
                        Connect Your Wallet
                    </Button>
                </div>
                <div className="flex-1" aria-hidden="true" />
            </section>

            <AuthModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    )
}

export default Home
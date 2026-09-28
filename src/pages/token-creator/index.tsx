import TokenForm from "./components/TokenForm"

const TokenCreator = () => (
    <section className="mx-auto w-full max-w-4xl rounded-xl bg-background p-4 shadow-sm sm:p-8">
        <header className="mb-8 text-center">
            <h1 className="text-xl font-semibold">Token Creator</h1>
            <p className="mt-1 text-xs text-muted-foreground">
                Easily Create your own Token in just 7+1 steps without Coding.
            </p>
        </header>

        <TokenForm />
    </section>
)

export default TokenCreator
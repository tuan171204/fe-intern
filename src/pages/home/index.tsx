import { Link } from "react-router-dom"

import { Button } from "../../components/ui/button"

const Home = () => (
    <section className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 py-24 text-center">
        <h1 className="text-4xl font-semibold">Tokens &amp; NFT with Ease</h1>
        <p className="text-muted-foreground">
            Launch Token, Liquidity, Airdrops and much more. Effortless and without coding.
        </p>
        <Button asChild className="mt-2 rounded-full bg-teal-600 px-6 text-white hover:bg-teal-700">
            <Link to="/create">Start creating</Link>
        </Button>
    </section>
)

export default Home
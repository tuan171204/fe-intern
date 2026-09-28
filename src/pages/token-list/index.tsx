import * as React from "react"

import { TOKEN_LIST, type TokenItem } from "../../mocks/tokens"
import MintModal from "./components/MintModal"
import TokenListHeader from "./components/TokenListHeader"
import TokenRow from "./components/TokenRow"

const TokenList = () => {
    const [mintingToken, setMintingToken] = React.useState<TokenItem | null>(null)

    return (
        <>
            <div role="table" aria-label="Tokens" className="flex w-full flex-col gap-2.5">
                <TokenListHeader />
                <div role="rowgroup" className="divide-y divide-border/60 overflow-hidden rounded-lg bg-background">
                    {TOKEN_LIST.map((token) => (
                        <TokenRow key={token.id} token={token} onMint={setMintingToken} />
                    ))}
                </div>
            </div>

            <MintModal token={mintingToken} onClose={() => setMintingToken(null)} />
        </>
    )
}

export default TokenList
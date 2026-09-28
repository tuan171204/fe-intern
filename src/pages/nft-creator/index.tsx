import NftCollectionForm from "./components/NftCollectionForm"

const NftCreator = () => (
    <section className="mx-auto w-full max-w-4xl rounded-xl bg-background p-4 shadow-sm sm:p-8">
        <h1 className="mb-8 text-center text-xl font-semibold">Create NFT Collection</h1>
        <NftCollectionForm />
    </section>
)

export default NftCreator
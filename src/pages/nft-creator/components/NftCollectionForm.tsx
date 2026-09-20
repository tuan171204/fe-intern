import { Button } from "../../../components/ui/button"
import { Input } from "../../../components/ui/input"

const NftCollectionForm = () => (
    /* [&_label]: cùng cỡ label nhỏ với form Token Creator (Input gốc chưa có prop chỉnh label) */
    <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 [&_label]:text-xs [&_label]:font-medium">
        {/* Grid 1 cột Mobile, 2 cột từ Tablet */}
        <div className="grid gap-5 sm:grid-cols-2">
            <Input label="Name" required maxLength={32} placeholder="Ex: Zoken" hint="Max 32 characters in your name" />
            <Input label="Symbol" required maxLength={8} placeholder="Ex: ZKN" hint="Max 8 characters in your symbol" />
        </div>

        <Input label="Total Supply" required type="number" inputMode="numeric" placeholder="1" hint="Most token use 10B" />

        <Button type="submit" className="h-11 w-full rounded-full bg-teal-600 text-white hover:bg-teal-700">
            Create
        </Button>
    </form>
)

export default NftCollectionForm
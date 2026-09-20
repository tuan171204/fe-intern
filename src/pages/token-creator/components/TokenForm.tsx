import * as React from "react"

import { Button } from "../../../components/ui/button"
import { Dropzone } from "../../../components/ui/dropzone"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import SocialLinksSection from "./SocialLinksSection"

const DESCRIPTION_MAX = 500

const TokenForm = () => {
    const [description, setDescription] = React.useState("")
    const [image, setImage] = React.useState<File | null>(null)

    return (
        /* [&_label]: ép label của Input/Textarea về cùng cỡ chữ nhỏ như thiết kế (Input gốc chưa có prop chỉnh label) */
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5 [&_label]:text-xs [&_label]:font-medium">
            {/* Grid 1 cột Mobile, 2 cột từ Tablet */}
            <div className="grid gap-5 sm:grid-cols-2">
                <Input label="Name" required maxLength={32} placeholder="Ex: Zoken" hint="Max 32 characters in your name" />
                <Input label="Symbol" required maxLength={8} placeholder="Ex: ZKN" hint="Max 8 characters in your symbol" />
                <Input label="Decimal" required type="number" inputMode="numeric" placeholder="6" hint="Most token use 6 decimals" />
                <Input label="Supply" required type="number" inputMode="numeric" placeholder="1" hint="Most token use 10B" />
            </div>

            <Input label="Amount per mint" required type="number" inputMode="numeric" placeholder="6" />

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium">
                        <span className="mr-0.5 text-destructive">*</span>Image
                    </span>
                    <Dropzone
                        onFilesSelected={([file]) => setImage(file)}
                        label={image?.name}
                        className="min-h-28"
                    />
                </div>

                <Textarea
                    label="Description"
                    required
                    value={description}
                    maxLength={DESCRIPTION_MAX}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ex: First community token on Zoken..."
                    className="min-h-28 bg-[#F5FBFB] focus-visible:bg-background"
                />
            </div>

            <SocialLinksSection />

            <Button type="submit" className="h-11 w-full rounded-full bg-teal-600 text-white hover:bg-teal-700">
                Create
            </Button>
        </form>
    )
}

export default TokenForm
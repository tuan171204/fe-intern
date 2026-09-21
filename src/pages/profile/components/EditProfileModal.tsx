import * as React from "react"

import { Button } from "../../../components/ui/button"
import { Dialog } from "../../../components/ui/dialog"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { SOCIAL_LINKS } from "./social-links"

export interface EditProfileModalProps {
    isOpen: boolean
    onClose: () => void
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
    const [name, setName] = React.useState("")
    const [biography, setBiography] = React.useState("")
    const dirty = name.trim() !== "" || biography.trim() !== ""

    return (
        <Dialog isOpen={isOpen} onClose={onClose} title="Edit Profile" className="max-h-[90svh] overflow-y-auto">
            {/* [&_label]: Textarea gốc hard-code label cỡ xs, ép về cùng cỡ với label của Input */}
            <form
                onSubmit={(e) => e.preventDefault()}
                className="flex flex-col gap-4 [&_label]:text-base [&_label]:font-normal"
            >
                <Input label="Name" placeholder="John" value={name} onChange={(e) => setName(e.target.value)} />

                <div className="flex flex-col items-start gap-2">
                    <Textarea
                        label="Biography"
                        placeholder="Write your biography here!"
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        className="bg-[#F5FBFB] focus-visible:bg-background"
                    />
                    <Button type="button" size="sm" className="rounded-md bg-teal-600 text-white hover:bg-teal-700">
                        Save
                    </Button>
                </div>

                <fieldset className="flex flex-col gap-2">
                    <legend className="mb-2 text-base">Social Links</legend>
                    {SOCIAL_LINKS.map(({ label, Icon }) => (
                        <Input
                            key={label}
                            readOnly
                            aria-label={`${label} connection`}
                            placeholder="Not connected"
                            startAdornment={<Icon className="size-3.5" aria-hidden="true" />}
                            className="h-10 py-0 read-only:hover:border-transparent"
                        />
                    ))}
                </fieldset>

                <Button
                    type="submit"
                    className="mt-2 h-12 w-full rounded-full text-lg bg-teal-600 font-light tracking-wide text-white hover:bg-teal-700 disabled:bg-teal-100 disabled:text-teal-600 disabled:opacity-100"
                >
                    Save
                </Button>
            </form>
        </Dialog>
    )
}

export default EditProfileModal
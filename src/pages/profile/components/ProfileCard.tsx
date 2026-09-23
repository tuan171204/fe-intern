import * as React from "react"

import { Button } from "../../../components/ui/button"
import { shortenAddress } from "../../../components/ui/copy-address"
import Icon from "../../../components/ui/icon"
import { PROFILE } from "../../../mocks/profile"
import EditProfileModal from "./EditProfileModal"
import { SOCIAL_LINKS } from "./social-links"

const ProfileCard = () => {
    const [editing, setEditing] = React.useState(false)

    return (
        <section aria-label="Profile" className="flex flex-col gap-4 rounded-lg bg-background p-4">
            <div className="flex items-center gap-3">
                <div className="relative shrink-0">
                    <span aria-hidden="true" className="block size-10 rounded-full bg-teal-600" />
                    <span className="absolute -left-1 -top-1 rounded-full bg-orange-200 px-1 text-[9px] font-medium leading-4">
                        {PROFILE.level}
                    </span>
                </div>
                <div className="min-w-0">
                    <p className="text-sm font-medium">{PROFILE.name}</p>
                    <p className="truncate text-xs text-muted-foreground" title={PROFILE.address}>
                        {shortenAddress(PROFILE.address, 5, 9)}
                    </p>
                </div>
            </div>

            <div>
                <h2 className="text-base font-medium">Balance</h2>
                <p className="mt-1 text-xs text-muted-foreground">{PROFILE.balance}</p>
            </div>

            <div>
                <h2 className="text-base font-medium">Biography</h2>
                <p className="mt-1 text-xs text-muted-foreground">{PROFILE.biography}</p>
            </div>

            <div>
                <h2 className="text-base font-medium">Social Links</h2>
                <ul className="mt-2 flex items-center gap-3 text-muted-foreground">
                    {SOCIAL_LINKS.map(({ key, label, icon }) => (
                        <li key={key}>
                            <Icon name={icon} size="md" aria-hidden="true" />
                            <span className="sr-only">{label}</span>
                        </li>
                    ))}
                </ul>
            </div>

            <Button
                onClick={() => setEditing(true)}
                className="h-10 w-full rounded-full bg-teal-600 text-white hover:bg-teal-700"
            >
                Edit Profile
            </Button>

            <EditProfileModal isOpen={editing} onClose={() => setEditing(false)} />
        </section>
    )
}

export default ProfileCard
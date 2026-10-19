import * as React from "react"
import type { Address } from "viem"

import { Button } from "../../../components/ui/button"
import { shortenAddress } from "../../../components/ui/copy-address"
import Icon from "../../../components/ui/icon"
import { useEthBalance } from "../../../hooks/useEthBalance"
import type { UserProfile } from "../../../types/profile"
import EditProfileModal from "./EditProfileModal"
import { SOCIAL_LINKS } from "./social-links"

export interface ProfileCardProps {
    profile: UserProfile
    onSave: (profile: UserProfile) => void
}

const toHref = (url: string) => (/^https?:\/\//i.test(url) ? url : `https://${url}`)

const ProfileCard = ({ profile, onSave }: ProfileCardProps) => {
    const [editing, setEditing] = React.useState(false)
    const { formatted: ethBalance, isLoading: balanceLoading, isError: balanceError } = useEthBalance(
        profile.walletAddress as Address
    )

    const balanceText = balanceLoading ? "Loading..." : balanceError ? "Unavailable" : (ethBalance ?? "0 ETH")

    return (
        <section aria-label="Profile" className="flex flex-col gap-4 rounded-lg bg-background p-4">
            <div className="flex items-center gap-3">
                <span aria-hidden="true" className="block size-10 shrink-0 rounded-full bg-teal-600" />
                <div className="min-w-0">
                    <p className="text-sm font-medium">{profile.username || "Unnamed"}</p>
                    <p className="truncate text-xs text-muted-foreground" title={profile.walletAddress}>
                        {shortenAddress(profile.walletAddress, 5, 9)}
                    </p>
                </div>
            </div>

            <div>
                <h2 className="text-base font-medium">Balance</h2>
                <p className="mt-1 text-xs text-muted-foreground">{balanceText}</p>
            </div>

            <div>
                <h2 className="text-base font-medium">Biography</h2>
                <p className="mt-1 text-xs text-muted-foreground">{profile.bio || "None"}</p>
            </div>

            <div>
                <h2 className="text-base font-medium">Social Links</h2>
                <ul className="mt-2 flex items-center gap-3 text-muted-foreground">
                    {SOCIAL_LINKS.map(({ key, label, icon }) => {
                        const url = profile[key]
                        return (
                            <li key={key}>
                                {url ? (
                                    <a
                                        href={toHref(url)}
                                        target="_blank"
                                        rel="noreferrer"
                                        aria-label={label}
                                        className="transition-colors hover:text-teal-600"
                                    >
                                        <Icon name={icon} size="md" />
                                    </a>
                                ) : (
                                    <>
                                        <Icon name={icon} size="md" aria-hidden="true" />
                                        <span className="sr-only">{label}</span>
                                    </>
                                )}
                            </li>
                        )
                    })}
                </ul>
            </div>

            <Button
                onClick={() => setEditing(true)}
                className="h-10 w-full rounded-full bg-teal-600 text-white hover:bg-teal-700"
            >
                Edit Profile
            </Button>

            <EditProfileModal isOpen={editing} profile={profile} onSave={onSave} onClose={() => setEditing(false)} />
        </section>
    )
}

export default ProfileCard
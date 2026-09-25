import * as React from "react"

import { PROFILE, type ProfileData } from "../../mocks/profile"
import ProfileAssets from "./components/ProfileAssets"
import ProfileCard from "./components/ProfileCard"

const StatCard = ({ label, value }: { label: string; value: number }) => (
    <div className="rounded-lg bg-background p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-medium">{value}</p>
    </div>
)

const Profile = () => {
    /* Nâng state Profile lên đây để Edit Profile lưu xong thì ProfileCard cập nhật ngay */
    const [profile, setProfile] = React.useState<ProfileData>(PROFILE)

    return (
        <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
            <ProfileCard profile={profile} onSave={setProfile} />

            <div className="flex min-w-0 flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Total Tokens" value={profile.totalTokens} />
                    <StatCard label="Total NFTs" value={profile.totalNfts} />
                </div>
                <ProfileAssets />
            </div>
        </div>
    )
}

export default Profile
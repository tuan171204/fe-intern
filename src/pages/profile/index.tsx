import { PROFILE } from "../../mocks/profile"
import ProfileAssets from "./components/ProfileAssets"
import ProfileCard from "./components/ProfileCard"

const StatCard = ({ label, value }: { label: string; value: number }) => (
    <div className="rounded-lg bg-background p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-medium">{value}</p>
    </div>
)

const Profile = () => (
    /* Mobile/Tablet: 1 cột xếp chồng. Desktop: cột trái cố định 20rem (profile), cột phải co giãn */
    <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
        <ProfileCard />

        <div className="flex min-w-0 flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
                <StatCard label="Total Tokens" value={PROFILE.totalTokens} />
                <StatCard label="Total NFTs" value={PROFILE.totalNfts} />
            </div>
            <ProfileAssets />
        </div>
    </div>
)

export default Profile
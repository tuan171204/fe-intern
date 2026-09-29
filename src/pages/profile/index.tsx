import * as React from "react"

import { getUserTokens } from "../../api/profile"
import { Button } from "../../components/ui/button"
import { usePaginatedTokens } from "../../hooks/usePaginatedTokens"
import { PROFILE_NFTS } from "../../mocks/profile"
import { useAuth } from "../../store/AuthContext"
import ProfileAssets from "./components/ProfileAssets"
import ProfileCard from "./components/ProfileCard"
import ProfileCardSkeleton from "./components/ProfileCardSkeleton"

const TOKENS_PER_PAGE = 10

const StatCard = ({ label, value }: { label: string; value: number }) => (
    <div className="rounded-lg bg-background p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-medium">{value}</p>
    </div>
)

const Profile = () => {
    /* Profile được AuthContext tải khi app khởi chạy / đăng nhập; Edit Profile lưu xong thì cập nhật lại context */
    const { profile, profileError, fetchProfile, setProfile } = useAuth()
    const [page, setPage] = React.useState(1)
    const userTokens = usePaginatedTokens(getUserTokens, page, TOKENS_PER_PAGE)

    return (
        <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
            {profile ? (
                <ProfileCard profile={profile} onSave={setProfile} />
            ) : profileError ? (
                <section className="flex flex-col items-center gap-3 rounded-lg bg-background p-4 text-center">
                    <p className="text-sm text-destructive">{profileError}</p>
                    <Button variant="outline" size="sm" onClick={() => void fetchProfile()}>
                        Retry
                    </Button>
                </section>
            ) : (
                <ProfileCardSkeleton />
            )}

            <div className="flex min-w-0 flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label="Total Tokens" value={userTokens.pagination.total} />
                    <StatCard label="Total NFTs" value={PROFILE_NFTS.length} />
                </div>
                <ProfileAssets
                    tokensTable={{
                        tokens: userTokens.items,
                        page,
                        pagination: userTokens.pagination,
                        loading: userTokens.loading,
                        error: userTokens.error,
                        onRetry: userTokens.reload,
                        onPageChange: setPage,
                    }}
                />
            </div>
        </div>
    )
}

export default Profile
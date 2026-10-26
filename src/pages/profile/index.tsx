import { useTranslation } from "react-i18next"

import { getUserTokens } from "../../api/profile"
import { Button } from "../../components/ui/button"
import { useInfiniteTokens } from "../../hooks/useInfiniteTokens"
import { PROFILE_NFTS } from "../../mocks/profile"
import { useAuth } from "../../store/AuthContext"
import ProfileAssets from "./components/ProfileAssets"
import ProfileCard from "./components/ProfileCard"
import ProfileCardSkeleton from "./components/ProfileCardSkeleton"

const TOKENS_PER_PAGE = 2 // temporary, for testing only

const StatCard = ({ label, value }: { label: string; value: number }) => (
    <div className="rounded-lg bg-background p-4">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="mt-1 text-2xl font-medium">{value}</p>
    </div>
)

const Profile = () => {
    const { t } = useTranslation()
    /* The profile is loaded by AuthContext on app start / sign-in; after Edit Profile saves, the context is updated */
    const { profile, profileError, fetchProfile, setProfile } = useAuth()
    /* Infinite scroll: pages are appended as the user scrolls to the end of the table */
    const userTokens = useInfiniteTokens(getUserTokens, TOKENS_PER_PAGE)

    return (
        <div className="grid gap-4 lg:grid-cols-[20rem_minmax(0,1fr)] lg:items-start">
            {profile ? (
                <ProfileCard profile={profile} onSave={setProfile} />
            ) : profileError ? (
                <section className="flex flex-col items-center gap-3 rounded-lg bg-background p-4 text-center">
                    <p className="text-sm text-destructive">{profileError}</p>
                    <Button variant="outline" size="sm" onClick={() => void fetchProfile()}>
                        {t("common.retry")}
                    </Button>
                </section>
            ) : (
                <ProfileCardSkeleton />
            )}

            <div className="flex min-w-0 flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <StatCard label={t("profile.totalTokens")} value={userTokens.total} />
                    <StatCard label={t("profile.totalNfts")} value={PROFILE_NFTS.length} />
                </div>
                <ProfileAssets
                    tokensTable={{
                        pages: userTokens.pages,
                        loading: userTokens.loading,
                        error: userTokens.error,
                        onRetry: userTokens.reload,
                        hasMore: userTokens.hasMore,
                        loadingMore: userTokens.loadingMore,
                        loadMoreError: userTokens.loadMoreError,
                        onLoadMore: userTokens.loadMore,
                    }}
                />
            </div>
        </div>
    )
}

export default Profile
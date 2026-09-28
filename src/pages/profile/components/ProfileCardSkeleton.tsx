import { Skeleton } from "../../../components/ui/skeleton"

/** Placeholder khi đang tải profile */
const ProfileCardSkeleton = () => (
    <section aria-label="Loading profile" aria-busy="true" className="flex flex-col gap-4 rounded-lg bg-background p-4">
        <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-col gap-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-36" />
            </div>
        </div>

        {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-full" />
            </div>
        ))}

        <Skeleton className="h-10 w-full rounded-full" />
    </section>
)

export default ProfileCardSkeleton
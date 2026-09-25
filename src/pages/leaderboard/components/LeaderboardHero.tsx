import { Badge } from "../../../components/ui/badge"
import { CopyAddress } from "../../../components/ui/copy-address"
import Icon from "../../../components/ui/icon"

const STATS = [
    { label: "MC", value: "$162.77K" },
    { label: "1h", value: "-3.34%", negative: true },
    { label: "24h Vol", value: "$8.55K" },
]

const LeaderboardHero = () => (
    <section className="flex flex-col items-center gap-3 px-2 pt-6 text-center sm:pt-10">
        <h1 className="text-3xl font-medium sm:text-4xl lg:text-5xl">ACW3 Leaderboard</h1>
        <p className="text-sm sm:text-base">
            Discover the top cults on <span className="font-medium text-teal-600">ACW3</span>
        </p>

        <Badge variant="outline" className="gap-1 text-[10px]">
            <Icon name="close" size="xs" aria-hidden="true" />
            Made by ACW3
        </Badge>

        <div className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full bg-teal-600 px-4 py-2 text-xs text-white">
            This dashboard has been coined
            <CopyAddress address="ACW3" short={false} className="text-xs font-semibold text-white" />
        </div>

        <dl className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[10px]">
            {STATS.map(({ label, value, negative }) => (
                <div key={label} className="flex items-center gap-1">
                    <dt className="font-medium">{label}:</dt>
                    <dd className={negative ? "flex items-center gap-0.5 text-destructive" : undefined}>
                        {negative && <Icon name="trend-down" size="xs" aria-hidden="true" />}
                        {value}
                    </dd>
                </div>
            ))}
        </dl>
    </section>
)

export default LeaderboardHero
import LeaderboardHero from "./components/LeaderboardHero"
import LeaderboardTable from "./components/LeaderboardTable"

const Leaderboard = () => (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 pb-8">
        <LeaderboardHero />
        <LeaderboardTable />
    </div>
)

export default Leaderboard
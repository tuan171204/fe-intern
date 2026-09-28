export interface LeaderboardRow {
    rank: number
    name: string
    symbol: string
    creator: string
    change: string
    marketCap: string
    volume: string
    price: string
    isCurrentUser?: boolean
}

export const LEADERBOARD_ROWS: LeaderboardRow[] = Array.from({ length: 10 }, (_, i) => ({
    rank: i + 1,
    name: "promptbidder",
    symbol: "$DUPE",
    creator: "N/A",
    change: "+24%",
    marketCap: "$32.88M",
    volume: "$4.31M",
    price: "$0.032878",
    isCurrentUser: i === 9,
}))
import * as React from "react"

import { Avatar } from "../../../components/ui/avatar"
import { Card, CardHeader, CardTitle } from "../../../components/ui/card"
import { CopyAddress } from "../../../components/ui/copy-address"
import Icon from "../../../components/ui/icon"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../../components/ui/table"
import { Tabs, type TabOption } from "../../../components/ui/tabs"
import cn from "../../../utils/cn"
import { LEADERBOARD_ROWS, type LeaderboardRow } from "../../../mocks/leaderboard"

type Chain = "bnb" | "base"

const CHAINS: TabOption<Chain>[] = [
    { value: "bnb", label: "BNB Chain" },
    { value: "base", label: "Base" },
]

const COLUMNS = [
    { label: "Rank", align: "left" },
    { label: "Token", align: "left" },
    { label: "Creator", align: "left" },
    { label: "24h Chg", align: "right" },
    { label: "Market Cap", align: "right" },
    { label: "Volume (24h)", align: "right" },
    { label: "Token Price", align: "right" },
] as const

/* Thay thế cho 1 dòng bảng trên Mobile/Tablet - tránh phải cuộn ngang bảng 7 cột */
const LeaderboardRowCard = ({ row }: { row: LeaderboardRow }) => (
    <div
        className={cn(
            "flex flex-col gap-3 rounded-xl border border-teal-600/20 bg-background p-3.5",
            row.isCurrentUser && "border-transparent bg-teal-600 text-white"
        )}
    >
        <div className="flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
                <span
                    className={cn(
                        "shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                        row.isCurrentUser ? "bg-white/20 text-white" : "bg-teal-50 text-teal-600"
                    )}
                >
                    #{row.rank}
                </span>
                <Avatar fallback={row.name} alt={row.name} size="md" />
                <div className="flex min-w-0 flex-col leading-tight">
                    <span className="truncate text-sm font-medium">{row.name}</span>
                    <CopyAddress
                        address={row.symbol}
                        short={false}
                        className={cn("text-[10px]", row.isCurrentUser && "text-white/80")}
                    />
                </div>
            </div>

            <span className={cn("shrink-0 text-sm font-semibold", row.isCurrentUser ? "text-white" : "text-teal-600")}>
                {row.change}
            </span>
        </div>

        <dl className="grid grid-cols-3 gap-2 text-center">
            {[
                { label: "Market Cap", value: row.marketCap },
                { label: "Volume 24h", value: row.volume },
                { label: "Price", value: row.price },
            ].map(({ label, value }) => (
                <div key={label} className={cn("rounded-lg p-2", row.isCurrentUser ? "bg-white/10" : "bg-muted/60")}>
                    <dt className={cn("truncate text-[9px]", row.isCurrentUser ? "text-white/70" : "text-muted-foreground")}>
                        {label}
                    </dt>
                    <dd className="mt-0.5 truncate text-xs font-semibold">{value}</dd>
                </div>
            ))}
        </dl>

        <p className={cn("truncate text-[11px]", row.isCurrentUser ? "text-white/70" : "text-muted-foreground")}>
            Creator: <span className={row.isCurrentUser ? "text-white" : "text-foreground"}>{row.creator}</span>
        </p>
    </div>
)

const LeaderboardTable = () => {
    const [chain, setChain] = React.useState<Chain>("bnb")

    return (
        <section aria-labelledby="top-creators-title">
            <Card className="border-teal-600/60 bg-teal-50/30 shadow-none">
                <CardHeader className="flex-wrap p-4">
                    <CardTitle id="top-creators-title" className="flex items-center gap-2 font-medium">
                        <Icon name="bar-chart" size="sm" className="text-teal-600" aria-hidden="true" />
                        Top 50 Creators
                    </CardTitle>
                    <Tabs options={CHAINS} value={chain} onChange={setChain} />
                </CardHeader>

                {/* < lg: Card, xếp 1 cột Mobile / 2 cột Tablet. >= lg: bảng đầy đủ 7 cột */}
                <div className="grid grid-cols-1 gap-2.5 p-3 sm:grid-cols-2 lg:hidden">
                    {LEADERBOARD_ROWS.map((row) => (
                        <LeaderboardRowCard key={row.rank} row={row} />
                    ))}
                </div>

                <div className="hidden px-2 pb-2 lg:block lg:px-4 lg:pb-4">
                    <Table className="min-w-[760px]">
                        <TableHeader>
                            <TableRow className="border-0 bg-teal-50 hover:bg-teal-50">
                                {COLUMNS.map(({ label, align }) => (
                                    <TableHead
                                        key={label}
                                        className={cn("first:rounded-l-md last:rounded-r-md", align === "right" && "text-right")}
                                    >
                                        {label}
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {LEADERBOARD_ROWS.map((row) => (
                                <TableRow
                                    key={row.rank}
                                    className={cn(
                                        "text-xs",
                                        row.isCurrentUser && "border-0 bg-teal-600 text-white hover:bg-teal-600"
                                    )}
                                >
                                    <TableCell className={cn("rounded-l-md text-muted-foreground", row.isCurrentUser && "text-white")}>
                                        #{row.rank}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Avatar fallback={row.name} alt={row.name} size="md" />
                                            <div className="flex flex-col leading-tight">
                                                <span className="font-medium">{row.name}</span>
                                                <CopyAddress
                                                    address={row.symbol}
                                                    short={false}
                                                    className={cn(row.isCurrentUser && "text-white/80")}
                                                />
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{row.creator}</TableCell>
                                    <TableCell
                                        className={cn("text-right", row.isCurrentUser ? "text-white/80" : "text-teal-600")}
                                    >
                                        {row.change}
                                    </TableCell>
                                    <TableCell className="text-right">{row.marketCap}</TableCell>
                                    <TableCell className="text-right">{row.volume}</TableCell>
                                    <TableCell className="rounded-r-md text-right">{row.price}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Card>
        </section>
    )
}

export default LeaderboardTable
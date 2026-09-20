import * as React from "react"
import { BarChart3 } from "lucide-react"

import { Avatar } from "../../../components/ui/avatar"
import { Card, CardHeader, CardTitle } from "../../../components/ui/card"
import { CopyAddress } from "../../../components/ui/copy-address"
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
import { LEADERBOARD_ROWS } from "../../../mocks/leaderboard"

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

const LeaderboardTable = () => {
    const [chain, setChain] = React.useState<Chain>("bnb")

    return (
        <section aria-labelledby="top-creators-title">
            <Card className="border-teal-600/60 bg-teal-50/30 shadow-none">
                <CardHeader className="flex-wrap p-4">
                    <CardTitle id="top-creators-title" className="flex items-center gap-2 font-medium">
                        <BarChart3 className="size-3.5 text-teal-600" aria-hidden="true" />
                        Top 50 Creators
                    </CardTitle>
                    <Tabs options={CHAINS} value={chain} onChange={setChain} />
                </CardHeader>

                {/* Bảng cuộn ngang trên mobile/tablet nhờ wrapper overflow-x-auto của Table */}
                <div className="px-2 pb-2 sm:px-4 sm:pb-4">
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
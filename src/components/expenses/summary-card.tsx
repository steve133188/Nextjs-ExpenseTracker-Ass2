"use client"

import { format, parseISO } from "date-fns"
import { TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"
import type { Expense } from "@/lib/schema"

function periodLabel(from?: string, to?: string): string {
  if (!from && !to) return "All time"
  const fmt = (s: string) => format(parseISO(s), "MMM d, yyyy")
  if (from && to)   return `${fmt(from)} – ${fmt(to)}`
  if (from)         return `From ${fmt(from)}`
  return `Until ${fmt(to!)}`
}

interface SummaryCardProps {
  expenses: Expense[]
  from?: string
  to?: string
  isLoading: boolean
  isFetching: boolean
}

export function SummaryCard({ expenses, from, to, isLoading, isFetching }: SummaryCardProps) {
  const total = expenses.reduce((sum, e) => sum + e.amount, 0)
  const count = expenses.length
  const label = periodLabel(from, to)

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          Total Spending
          {isFetching && <Spinner className="size-3 text-muted-foreground" />}
        </CardTitle>
        <TrendingUp className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-9 w-40 mb-2" />
            <Skeleton className="h-4 w-56" />
          </>
        ) : (
          <>
            <div className="text-3xl font-bold tabular-nums">
              ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              {count} {count === 1 ? "expense" : "expenses"} · {label}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useMemo, useState } from "react"
import { Plus, RefreshCw, Search, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useExpenses } from "@/hooks/use-expenses"
import { useExpenseFilter } from "@/hooks/use-expense-filter"
import { ExpenseFilters } from "@/components/expenses/filters/expense-filters"
import { SummaryCard } from "@/components/expenses/summary-card"
import { ExpenseChart } from "@/components/expenses/charts/expense-chart"
import { MonthlyTrendsChart } from "@/components/expenses/charts/monthly-trends-chart"
import { ExpenseTable } from "@/components/expenses/table/expense-table"
import { ExpenseDialog } from "@/components/expenses/expense-dialog"
import { ExpenseListSkeleton } from "@/components/expenses/table/expense-list-skeleton"
import { DonutChartSkeleton, BarChartSkeleton } from "@/components/expenses/charts/chart-skeleton"
import { ChartCard } from "@/components/expenses/chart-card"
import { UserMenu } from "@/components/auth/user-menu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

export default function Home() {
  const { user, isLoading: authLoading } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const expenseFilter = useExpenseFilter()
  const { filter }    = expenseFilter

  const query        = useExpenses({ categories: filter.categories, from: filter.from, to: filter.to })
  const isLoading    = query.isLoading
  const isRefetching = query.isFetching && !query.isLoading

  // Client-side live search over already-fetched expenses — avoids extra round trips
  const expenses = useMemo(() => {
    const all = query.data ?? []
    const q = searchQuery.trim().toLowerCase()
    if (!q) return all
    return all.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        (e.description ?? "").toLowerCase().includes(q)
    )
  }, [query.data, searchQuery])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (!user) return null

  const allExpenses   = query.data ?? []
  const isSearching   = searchQuery.trim().length > 0
  const searchCount   = isSearching ? `${expenses.length} of ${allExpenses.length}` : null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3 max-w-5xl">
          <span className="text-xl font-semibold tracking-tight">
            Expense Tracker
          </span>
          <div className="ml-auto flex items-center gap-2">
            <ExpenseDialog
              mode="add"
              trigger={
                <Button size="sm">
                  <Plus className="size-4" />
                  Add Expense
                </Button>
              }
            />
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-5xl space-y-4">
        <div className="rounded-lg border bg-card px-4 py-2.5">
          <ExpenseFilters {...expenseFilter} />
        </div>

        <SummaryCard
          expenses={expenses}
          from={filter.from}
          to={filter.to}
          isLoading={isLoading}
          isFetching={query.isFetching}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard
            title="Spending by Category"
            skeleton={<DonutChartSkeleton />}
            isLoading={isLoading}
            isRefetching={isRefetching}
          >
            <ExpenseChart expenses={expenses} />
          </ChartCard>

          <ChartCard
            title="Expenses Trend"
            skeleton={<BarChartSkeleton />}
            isLoading={isLoading}
            isRefetching={isRefetching}
          >
            <MonthlyTrendsChart
              expenses={expenses}
              from={filter.from}
              to={filter.to}
              period={filter.period}
            />
          </ChartCard>
        </div>

        <Card>
          <CardHeader className="flex flex-wrap items-center gap-2 py-3 px-4">
            <CardTitle className="text-base flex items-center gap-2 shrink-0">
              {isLoading ? <Skeleton className="h-5 w-24" /> : (
                <>
                  Expenses
                  {searchCount && <span className="text-sm font-normal text-muted-foreground">{searchCount}</span>}
                  {isRefetching && <Spinner className="size-3.5 text-muted-foreground" />}
                </>
              )}
            </CardTitle>

            {/* Live search — filters already-fetched expenses without a server round trip */}
            <div className="relative w-full sm:max-w-xs sm:ml-auto">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                className="pl-8 pr-8 h-9 text-sm"
                placeholder="Search expenses…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </CardHeader>

          {isLoading ? (
            <CardContent className="pt-0"><ExpenseListSkeleton /></CardContent>
          ) : query.isError ? (
            <CardContent className="pt-0">
              <div className="flex flex-col items-center gap-3 py-10 text-muted-foreground">
                <p className="text-sm">Failed to load expenses.</p>
                <Button variant="outline" size="sm" onClick={() => query.refetch()}>
                  <RefreshCw className="size-4" /> Retry
                </Button>
              </div>
            </CardContent>
          ) : (
            <div className={cn("transition-opacity duration-200", isRefetching && "opacity-50")}>
              {/* key resets sort/page state when filters or search change */}
              <ExpenseTable
                key={`${searchQuery}|${filter.categories.join(",")}|${filter.from ?? ""}|${filter.to ?? ""}`}
                expenses={expenses}
              />
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}

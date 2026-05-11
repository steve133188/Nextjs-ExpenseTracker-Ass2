"use client"

import { useMemo, useState } from "react"
import { Plus, RefreshCw, Search } from "lucide-react"
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
import { AdminPanel } from "@/components/admin/admin-panel"
import { UserMenu } from "@/components/auth/user-menu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Spinner } from "@/components/ui/spinner"

type Tab = "expenses" | "admin"

function ChartCard({
  title, skeleton, isLoading, isRefetching, children,
}: {
  title: string
  skeleton: React.ReactNode
  isLoading: boolean
  isRefetching: boolean
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
          {isLoading ? <Skeleton className="h-4 w-32" /> : (
            <>
              {title}
              {isRefetching && <Spinner className="size-3 text-muted-foreground" />}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? skeleton : (
          <div className={cn("transition-opacity duration-200", isRefetching && "opacity-50")}>
            {children}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Home() {
  const { user, isLoading: authLoading } = useAuth()
  const [tab, setTab]               = useState<Tab>("expenses")
  const [searchQuery, setSearchQuery] = useState("")

  const expenseFilter = useExpenseFilter()
  const { filter }    = expenseFilter

  const query         = useExpenses({ categories: filter.categories, from: filter.from, to: filter.to })
  const isLoading     = query.isLoading
  const isRefetching  = query.isFetching && !query.isLoading

  // Client-side live search over already-fetched expenses
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

  // Show full-screen spinner while checking auth session
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  // Middleware handles redirect, but guard against null during hydration
  if (!user) return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3 max-w-5xl">
          <span className="text-xl font-semibold tracking-tight">
            Ledger
          </span>
          <span className="hidden sm:block text-xs text-muted-foreground font-mono tracking-widest uppercase pt-0.5">
            Expense Tracker
          </span>

          {/* Tab switcher — only visible to admins who have multiple tabs */}
          {user.role === "admin" && (
            <div className="flex items-center ml-4 bg-muted rounded-lg p-1 gap-0.5">
              <button
                onClick={() => setTab("expenses")}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-all",
                  tab === "expenses"
                    ? "bg-background shadow-sm text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                My Expenses
              </button>
              <button
                onClick={() => setTab("admin")}
                className={cn(
                  "px-3 py-1 text-sm rounded-md transition-all",
                  tab === "admin"
                    ? "bg-background shadow-sm text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                Admin
              </button>
            </div>
          )}

          <div className="ml-auto flex items-center gap-2">
            {tab === "expenses" && (
              <ExpenseDialog
                mode="add"
                trigger={
                  <Button size="sm">
                    <Plus className="size-4" />
                    Add Expense
                  </Button>
                }
              />
            )}
            <UserMenu />
          </div>
        </div>
      </header>

      {tab === "admin" && user.role === "admin" ? (
        <main className="container mx-auto px-4 py-6 max-w-5xl">
          <AdminPanel currentUserId={user.id} />
        </main>
      ) : (
        <main className="container mx-auto px-4 py-6 max-w-5xl space-y-4">
          {/* Live search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              className="pl-9"
              placeholder="Search expenses by title or description…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

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
            <CardHeader className="flex flex-row items-center justify-between py-3 px-4">
              <CardTitle className="text-base flex items-center gap-2">
                {isLoading ? <Skeleton className="h-5 w-24" /> : (
                  <>
                    Expenses
                    {isRefetching && <Spinner className="size-3.5 text-muted-foreground" />}
                  </>
                )}
              </CardTitle>
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
                <ExpenseTable
                  key={`${searchQuery}|${filter.categories.join(",")}|${filter.from ?? ""}|${filter.to ?? ""}`}
                  expenses={expenses}
                />
              </div>
            )}
          </Card>
        </main>
      )}
    </div>
  )
}

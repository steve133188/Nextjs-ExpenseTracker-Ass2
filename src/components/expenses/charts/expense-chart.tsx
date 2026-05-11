"use client"

import { useMemo } from "react"
import { PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip } from "@/components/ui/chart"
import { CATEGORY_COLORS } from "@/lib/category-colors"
import type { Expense } from "@/lib/schema"

const FALLBACK_COLORS = ["#f97316", "#3b82f6", "#ec4899", "#a855f7", "#64748b"]

function categoryChartColor(category: string, index: number): string {
  return CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS]?.chart ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]
}

interface ExpenseChartProps {
  expenses: Expense[]
}

export function ExpenseChart({ expenses }: ExpenseChartProps) {
  const { chartData, chartConfig } = useMemo(() => {
    const totals = expenses.reduce<Record<string, number>>((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {})

    const data = Object.entries(totals)
      .sort(([, a], [, b]) => b - a)
      .map(([category, total], index) => ({
        category,
        total: Math.round(total * 100) / 100,
        fill: categoryChartColor(category, index),
      }))

    const config = Object.fromEntries(
      data.map((item) => [item.category, { label: item.category, color: item.fill }])
    )

    return { chartData: data, chartConfig: config }
  }, [expenses])

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[180px] text-muted-foreground text-sm">
        No data to display yet.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <ChartContainer config={chartConfig} className="mx-auto h-[180px] w-full">
        <PieChart>
          <ChartTooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null
              const { name, value, payload: p } = payload[0] as { name: string; value: number; payload: { fill: string } }
              return (
                <div className="rounded-lg border bg-background px-3 py-2 text-xs shadow-xl">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="size-2.5 shrink-0 rounded-full" style={{ background: p.fill }} />
                    <span className="font-medium text-foreground">{name}</span>
                  </div>
                  <span className="font-mono font-semibold text-foreground tabular-nums pl-4">
                    ${Number(value).toFixed(2)}
                  </span>
                </div>
              )
            }}
          />
          <Pie data={chartData} dataKey="total" nameKey="category" innerRadius={50} outerRadius={75}>
            {chartData.map((entry) => (
              <Cell key={entry.category} fill={entry.fill} />
            ))}
          </Pie>
        </PieChart>
      </ChartContainer>

      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
        {chartData.map((entry) => (
          <div key={entry.category} className="flex items-center gap-1.5 min-w-0">
            <span className="size-2 shrink-0 rounded-full" style={{ background: entry.fill }} />
            <span className="truncate text-xs text-muted-foreground">{entry.category}</span>
            <span className="ml-auto text-xs font-medium tabular-nums shrink-0">
              ${entry.total.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

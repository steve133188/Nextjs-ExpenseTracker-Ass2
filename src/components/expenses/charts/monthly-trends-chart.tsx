"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, LabelList, ReferenceLine, Cell } from "recharts"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useTrendsChartData } from "@/hooks/use-trends-chart-data"
import type { Expense } from "@/lib/schema"
import type { Period } from "@/lib/chart-utils"

const chartConfig = { total: { label: "Spending" } }

interface MonthlyTrendsChartProps {
  expenses: Expense[]
  from: string
  to: string
  period: Period
}

export function MonthlyTrendsChart({ expenses, from, to, period }: MonthlyTrendsChartProps) {
  const { chartData, average, trend, grouping, unitLabel } = useTrendsChartData(expenses, from, to, period)

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[200px] text-muted-foreground text-sm">
        No data to display yet.
      </div>
    )
  }

  const rotateLabels = grouping === "month" && chartData.length > 6
  const xInterval =
    (grouping === "day"  && chartData.length > 14) ? Math.ceil(chartData.length / 8) - 1 :
    (grouping === "week" && chartData.length > 8)  ? Math.ceil(chartData.length / 6) - 1 :
    0
  const bottomMargin  = rotateLabels ? 36 : 4
  const showLabelList = chartData.length <= 7
  const TrendIcon     = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus

  return (
    <div className="space-y-3">
      <ChartContainer config={chartConfig} className="w-full" style={{ height: rotateLabels ? 236 : 200 }}>
        <BarChart data={chartData} margin={{ top: 20, right: 8, left: 0, bottom: bottomMargin }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="label"
            tickLine={false}
            axisLine={false}
            interval={xInterval}
            tick={rotateLabels
              ? { fontSize: 10, angle: -40, textAnchor: "end" as const, dy: 4 }
              : { fontSize: 11 }
            }
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11 }}
            tickFormatter={(v: number) => `$${v >= 1000 ? (v / 1000).toFixed(0) + "k" : v}`}
            width={46}
          />
          <ReferenceLine y={average} stroke="var(--muted-foreground)" strokeDasharray="4 3" strokeOpacity={0.5} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value) => [`$${Number(value).toFixed(2)}`, "Spending"]}
              />
            }
          />
          <Bar dataKey="total" radius={[4, 4, 0, 0]}>
            {chartData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            {showLabelList && (
              <LabelList
                dataKey="total"
                position="top"
                className="fill-foreground"
                style={{ fontSize: 10 }}
                formatter={(v: unknown) => { const n = v as number; return n > 0 ? `$${n >= 1000 ? (n / 1000).toFixed(1) + "k" : n}` : "" }}
              />
            )}
          </Bar>
        </BarChart>
      </ChartContainer>

      <div className="flex items-center justify-between border-t pt-2">
        <span className="text-xs text-muted-foreground">
          Avg / {unitLabel}:{" "}
          <span className="font-semibold text-foreground">${average.toFixed(0)}</span>
        </span>
        {chartData.length >= 2 && (
          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold
            ${trend === "up"
              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
              : trend === "down"
              ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400"
              : "bg-muted text-muted-foreground"
            }`}
          >
            <TrendIcon className="size-3" />
          </span>
        )}
      </div>
    </div>
  )
}

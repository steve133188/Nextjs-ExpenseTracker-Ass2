import { differenceInDays, parseISO } from "date-fns"

export const BAR_COLORS = [
  "var(--chart-1)", "var(--chart-2)", "var(--chart-3)",
  "var(--chart-4)", "var(--chart-5)",
]

export type Grouping = "day" | "week" | "month"
export type Period = "week" | "month" | "quarter" | "year" | null | undefined

export function resolveGrouping(period: Period, from?: string, to?: string): Grouping {
  if (period === "week")    return "day"
  if (period === "month")   return "day"
  if (period === "quarter") return "week"
  if (period === "year")    return "month"
  if (!from || !to)         return "month"
  const days = differenceInDays(parseISO(to), parseISO(from)) + 1
  if (days <= 14) return "day"
  if (days <= 90) return "week"
  return "month"
}

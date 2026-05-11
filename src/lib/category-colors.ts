import type { ExpenseCategory } from "./validations"

type CategoryColor = {
  bg: string
  text: string
  chart: string
}

export const CATEGORY_COLORS: Record<ExpenseCategory, CategoryColor> = {
  "Food & Dining":    { bg: "bg-orange-100 dark:bg-orange-900/40",  text: "text-orange-700 dark:text-orange-300",  chart: "#f97316" },
  "Transportation":   { bg: "bg-blue-100 dark:bg-blue-900/40",      text: "text-blue-700 dark:text-blue-300",      chart: "#3b82f6" },
  "Shopping":         { bg: "bg-pink-100 dark:bg-pink-900/40",      text: "text-pink-700 dark:text-pink-300",      chart: "#ec4899" },
  "Entertainment":    { bg: "bg-purple-100 dark:bg-purple-900/40",  text: "text-purple-700 dark:text-purple-300",  chart: "#a855f7" },
  "Health & Medical": { bg: "bg-red-100 dark:bg-red-900/40",        text: "text-red-700 dark:text-red-300",        chart: "#ef4444" },
  "Housing":          { bg: "bg-yellow-100 dark:bg-yellow-900/40",  text: "text-yellow-700 dark:text-yellow-300",  chart: "#eab308" },
  "Education":        { bg: "bg-cyan-100 dark:bg-cyan-900/40",      text: "text-cyan-700 dark:text-cyan-300",      chart: "#06b6d4" },
  "Travel":           { bg: "bg-teal-100 dark:bg-teal-900/40",      text: "text-teal-700 dark:text-teal-300",      chart: "#14b8a6" },
  "Other":            { bg: "bg-slate-100 dark:bg-slate-800",       text: "text-slate-700 dark:text-slate-300",    chart: "#64748b" },
}

export function categoryBadgeClass(category: string): string {
  const colors = CATEGORY_COLORS[category as ExpenseCategory]
  if (!colors) return "bg-muted text-muted-foreground"
  return `${colors.bg} ${colors.text}`
}

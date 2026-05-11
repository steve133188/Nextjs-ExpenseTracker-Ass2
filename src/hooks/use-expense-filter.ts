"use client"

import { useState } from "react"
import {
  startOfMonth, endOfMonth, startOfYear, endOfYear,
  subDays, subMonths,
  format, parseISO,
} from "date-fns"
import { useIsMobile } from "@/hooks/use-mobile"
import type { DateRange } from "react-day-picker"

const FMT = "yyyy-MM-dd"
const fmt = (d: Date) => format(d, FMT)

export type PeriodKey = "month" | "year"

export interface ExpenseFilter {
  period: PeriodKey | null
  from: string
  to: string
  categories: string[]
}

export interface Shortcut {
  label: string
  from: string
  to: string
}

export function getPeriodDates(key: PeriodKey): { from: string; to: string } {
  const now = new Date()
  switch (key) {
    case "month": return { from: fmt(startOfMonth(now)), to: fmt(endOfMonth(now)) }
    case "year":  return { from: fmt(startOfYear(now)),  to: fmt(endOfYear(now))  }
  }
}

function getShortcuts(): Shortcut[] {
  const now = new Date()
  return [
    { label: "Last 7 days",   from: fmt(subDays(now, 6)),                              to: fmt(now) },
    { label: "Last 30 days",  from: fmt(subDays(now, 29)),                             to: fmt(now) },
    { label: "Last 3 months", from: fmt(subDays(now, 89)),                             to: fmt(now) },
    { label: "Last month",    from: fmt(startOfMonth(subMonths(now, 1))),              to: fmt(endOfMonth(subMonths(now, 1))) },
    { label: "Last 6 months", from: fmt(subMonths(now, 6)),                            to: fmt(now) },
    { label: "This year",     from: fmt(startOfYear(now)),                             to: fmt(endOfYear(now)) },
  ]
}

const defaultFilter: ExpenseFilter = { period: "month", ...getPeriodDates("month"), categories: [] }

export function useExpenseFilter() {
  const isMobile = useIsMobile()
  const [filter, setFilter] = useState<ExpenseFilter>(defaultFilter)
  const [calOpen, setCalOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [localRange, setLocalRange] = useState<DateRange | null>(null)

  const hasFilter = !!(filter.period || filter.from || filter.to || filter.categories.length > 0)

  const calendarSelected: DateRange = localRange ?? {
    from: filter.from ? parseISO(filter.from) : undefined,
    to:   filter.to   ? parseISO(filter.to)   : undefined,
  }

  const dateLabel = filter.from && filter.to
    ? `${format(parseISO(filter.from), "MMM d")} – ${format(parseISO(filter.to), "MMM d, yyyy")}`
    : null

  const rangeHint = !localRange?.from
    ? "Pick a start date."
    : !localRange?.to
    ? "Now pick an end date."
    : `${format(localRange.from, "MMM d")} – ${format(localRange.to, "MMM d, yyyy")}`

  const shortcuts = getShortcuts()

  function handlePeriod(key: PeriodKey) {
    if (filter.period === key) {
      setFilter(f => ({ ...f, period: null, from: "", to: "" }))
    } else {
      setFilter(f => ({ ...f, period: key, ...getPeriodDates(key) }))
    }
  }

  function handleCalOpen(open: boolean) {
    setCalOpen(open)
    if (open) setLocalRange(null)
  }

  function handleRangeSelect(range: DateRange | undefined) {
    setLocalRange(range ?? null)
  }

  function applyRange() {
    if (!localRange?.from || !localRange?.to) return
    setFilter(f => ({ ...f, period: null, from: fmt(localRange.from!), to: fmt(localRange.to!) }))
    setCalOpen(false)
    setLocalRange(null)
  }

  function applyShortcut({ from, to }: { from: string; to: string }) {
    setFilter(f => ({ ...f, period: null, from, to }))
    setCalOpen(false)
    setLocalRange(null)
  }

  function toggleCategory(cat: string) {
    setFilter(f => ({
      ...f,
      categories: f.categories.includes(cat)
        ? f.categories.filter(c => c !== cat)
        : [...f.categories, cat],
    }))
  }

  function clearAll() {
    setFilter({ period: "month", ...getPeriodDates("month"), categories: [] })
    setLocalRange(null)
  }

  return {
    filter,
    isMobile,
    calOpen,
    catOpen,
    setCatOpen,
    localRange,
    hasFilter,
    calendarSelected,
    dateLabel,
    rangeHint,
    shortcuts,
    handlePeriod,
    handleCalOpen,
    handleRangeSelect,
    applyRange,
    applyShortcut,
    toggleCategory,
    clearAll,
  }
}

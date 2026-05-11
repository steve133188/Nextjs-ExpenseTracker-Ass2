"use client"

import { useState, useMemo } from "react"
import { useDeleteExpense } from "@/hooks/use-expenses"
import type { Expense } from "@/lib/schema"

const PAGE_SIZE = 10

type SortKey = "date" | "amount"
type SortDir = "asc" | "desc"

export function useExpenseTable(expenses: Expense[]) {
  const deleteExpense = useDeleteExpense()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [sortKey, setSortKey] = useState<SortKey>("date")
  const [sortDir, setSortDir] = useState<SortDir>("desc")
  const [page, setPage] = useState(1)

  function handleSort(column: SortKey) {
    if (sortKey === column) {
      setSortDir(d => d === "asc" ? "desc" : "asc")
    } else {
      setSortKey(column)
      setSortDir("asc")
    }
    setPage(1)
  }

  const sorted = useMemo(() => {
    return [...expenses].sort((a, b) => {
      const aVal = sortKey === "amount" ? a.amount : a.date
      const bVal = sortKey === "amount" ? b.amount : b.date
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1
      return (b.createdAt ?? 0) - (a.createdAt ?? 0)
    })
  }, [expenses, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function handleDelete(id: string) {
    setDeletingId(id)
    deleteExpense.mutate(id, { onSettled: () => setDeletingId(null) })
  }

  return {
    paginated,
    page,
    setPage,
    totalPages,
    sortKey,
    sortDir,
    handleSort,
    deletingId,
    handleDelete,
    pageSize: PAGE_SIZE,
    totalCount: sorted.length,
  }
}

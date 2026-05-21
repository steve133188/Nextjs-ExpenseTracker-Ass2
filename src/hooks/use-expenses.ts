"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { Expense } from "@/lib/schema"
import type { ExpenseFormData } from "@/lib/validations"

const QUERY_KEY = ["expenses"]

interface ExpenseFilters {
  categories?: string[]
  from?: string
  to?: string
}

function buildUrl(filters: ExpenseFilters = {}): string {
  const params = new URLSearchParams()
  ;(filters.categories ?? []).forEach((cat) => params.append("category", cat))
  if (filters.from) params.set("from", filters.from)
  if (filters.to)   params.set("to",   filters.to)
  const qs = params.toString()
  return qs ? `/api/expenses?${qs}` : "/api/expenses"
}

async function fetchExpenses(filters: ExpenseFilters): Promise<Expense[]> {
  const res = await fetch(buildUrl(filters))
  if (!res.ok) throw new Error("Failed to fetch expenses")
  return res.json()
}

async function throwWithMessage(res: Response, fallback: string): Promise<never> {
  const body = await res.json().catch(() => null)
  throw new Error(typeof body?.error === "string" ? body.error : fallback)
}

export function useExpenses(filters: ExpenseFilters = {}) {
  return useQuery({
    queryKey: [...QUERY_KEY, filters],
    queryFn: () => fetchExpenses(filters),
    // skip the request until a date range is set — the API requires both bounds
    enabled: !!(filters.from && filters.to),
  })
}

export function useCreateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) await throwWithMessage(res, "Failed to create expense")
      return res.json() as Promise<Expense>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Expense added")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useUpdateExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: ExpenseFormData & { id: string }) => {
      const res = await fetch(`/api/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) await throwWithMessage(res, "Failed to update expense")
      return res.json() as Promise<Expense>
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Expense updated")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useDeleteExpense() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/expenses/${id}`, { method: "DELETE" })
      if (!res.ok) await throwWithMessage(res, "Failed to delete expense")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY })
      toast.success("Expense deleted")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

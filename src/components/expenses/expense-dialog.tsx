"use client"

import { useState } from "react"
import { ExpenseForm } from "@/components/expenses/expense-form"
import { useCreateExpense, useUpdateExpense } from "@/hooks/use-expenses"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import type { Expense } from "@/lib/schema"
import type { ExpenseFormData } from "@/lib/validations"

const FORM_ID = "expense-form"

type Props =
  | { mode: "add"; trigger: React.ReactNode; expense?: never }
  | { mode: "edit"; expense: Expense; trigger: React.ReactNode }

export function ExpenseDialog({ mode, expense, trigger }: Props) {
  const [open, setOpen] = useState(false)
  const [isFormValid, setIsFormValid] = useState(mode === "edit")
  const createExpense = useCreateExpense()
  const updateExpense = useUpdateExpense()

  const mutation = mode === "edit" ? updateExpense : createExpense
  const isPending = mutation.isPending

  const defaultValues: Partial<ExpenseFormData> | undefined = mode === "edit"
    ? { title: expense.title, amount: expense.amount, category: expense.category as ExpenseFormData["category"], date: expense.date, description: expense.description ?? "" }
    : undefined

  function handleSubmit(data: ExpenseFormData) {
    if (mode === "edit") {
      updateExpense.mutate({ id: expense.id, ...data }, { onSuccess: () => setOpen(false) })
    } else {
      createExpense.mutate(data, { onSuccess: () => setOpen(false) })
    }
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!isPending) setOpen(val) }}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{mode === "edit" ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>
        <ExpenseForm
          id={FORM_ID}
          defaultValues={defaultValues}
          onSubmit={handleSubmit}
          isPending={isPending}
          onValidityChange={setIsFormValid}
        />
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={isPending}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form={FORM_ID} disabled={isPending || !isFormValid}>
            {isPending ? "Saving..." : mode === "edit" ? "Save Changes" : "Add Expense"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

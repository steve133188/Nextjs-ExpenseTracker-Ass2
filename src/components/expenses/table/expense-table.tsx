"use client"

import { format, parseISO } from "date-fns"
import { Pencil, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { useExpenseTable, type SortKey, type SortDir } from "@/hooks/use-expense-table"
import { ExpenseDialog } from "@/components/expenses/expense-dialog"
import { ExpenseDeleteDialog } from "@/components/expenses/table/expense-delete-dialog"
import { ExpenseTablePagination } from "@/components/expenses/table/expense-table-pagination"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { categoryBadgeClass } from "@/lib/category-colors"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Expense } from "@/lib/schema"

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey; sortDir: SortDir }) {
  if (sortKey !== column) return <ArrowUpDown className="size-3.5 opacity-40" />
  if (sortDir === "asc")  return <ArrowUp className="size-3.5" />
  return <ArrowDown className="size-3.5" />
}

export function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  const {
    paginated, page, setPage, totalPages,
    sortKey, sortDir, handleSort,
    deletingId, handleDelete,
    totalCount,
  } = useExpenseTable(expenses)

  if (expenses.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground text-sm">
        No expenses found. Try a different filter or add a new expense.
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" size="sm" className="-ml-3 h-8 gap-1 font-medium" onClick={() => handleSort("date")}>
                  Date <SortIcon column="date" sortKey={sortKey} sortDir={sortDir} />
                </Button>
              </TableHead>
              <TableHead>Title</TableHead>
              <TableHead className="hidden sm:table-cell">Category</TableHead>
              <TableHead className="text-right">
                <Button variant="ghost" size="sm" className="h-8 gap-1 font-medium ml-auto flex" onClick={() => handleSort("amount")}>
                  Amount <SortIcon column="amount" sortKey={sortKey} sortDir={sortDir} />
                </Button>
              </TableHead>
              <TableHead className="w-[80px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                  {/* parseISO requires a time component to treat the value as local midnight rather than UTC */}
                  {format(parseISO(expense.date + "T00:00:00"), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{expense.title}</div>
                  {expense.description && (
                    <div className="text-muted-foreground text-xs truncate max-w-[180px]">{expense.description}</div>
                  )}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge className={`border-0 font-medium ${categoryBadgeClass(expense.category)}`}>
                    {expense.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-medium tabular-nums">
                  ${expense.amount.toFixed(2)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 justify-end">
                    <ExpenseDialog
                      mode="edit"
                      expense={expense}
                      trigger={
                        <Button variant="ghost" size="icon" className="size-8">
                          <Pencil className="size-3.5" />
                          <span className="sr-only">Edit</span>
                        </Button>
                      }
                    />
                    <ExpenseDeleteDialog
                      expenseTitle={expense.title}
                      disabled={deletingId === expense.id}
                      onConfirm={() => handleDelete(expense.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ExpenseTablePagination
        page={page}
        totalPages={totalPages}
        totalCount={totalCount}
        onPageChange={setPage}
      />
    </div>
  )
}

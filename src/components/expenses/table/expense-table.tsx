"use client"

import { format, parseISO } from "date-fns"
import { Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react"
import { useExpenseTable, type SortKey, type SortDir } from "@/hooks/use-expense-table"
import { ExpenseDialog } from "@/components/expenses/expense-dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { categoryBadgeClass } from "@/lib/category-colors"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader,
  AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
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
    pageSize, totalCount,
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
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:text-destructive"
                          disabled={deletingId === expense.id}
                        >
                          <Trash2 className="size-3.5" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete expense?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete &quot;{expense.title}&quot;. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(expense.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="border-t px-4 py-3 flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, totalCount)} of {totalCount}
          </p>
          <Pagination className="w-auto mx-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  aria-disabled={page === 1}
                  className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
                .reduce<(number | "ellipsis")[]>((acc, n, idx, arr) => {
                  if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("ellipsis")
                  acc.push(n)
                  return acc
                }, [])
                .map((item, idx) =>
                  item === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}><PaginationEllipsis /></PaginationItem>
                  ) : (
                    <PaginationItem key={item}>
                      <Button
                        variant={item === page ? "outline" : "ghost"}
                        size="icon"
                        className="size-8"
                        onClick={() => setPage(item as number)}
                      >
                        {item}
                      </Button>
                    </PaginationItem>
                  )
                )
              }
              <PaginationItem>
                <PaginationNext
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  aria-disabled={page === totalPages}
                  className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  )
}

import {
  Pagination, PaginationContent, PaginationEllipsis,
  PaginationItem, PaginationNext, PaginationPrevious,
} from "@/components/ui/pagination"
import { Button } from "@/components/ui/button"
import { PAGE_SIZE } from "@/hooks/use-expense-table"

interface ExpenseTablePaginationProps {
  page: number
  totalPages: number
  totalCount: number
  onPageChange: (page: number) => void
}

export function ExpenseTablePagination({ page, totalPages, totalCount, onPageChange }: ExpenseTablePaginationProps) {
  if (totalPages <= 1) return null

  const from = (page - 1) * PAGE_SIZE + 1
  const to   = Math.min(page * PAGE_SIZE, totalCount)

  // Build page number list with ellipsis markers where gaps exist
  const pageItems = Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter(n => n === 1 || n === totalPages || Math.abs(n - page) <= 1)
    .reduce<(number | "ellipsis")[]>((acc, n, idx, arr) => {
      if (idx > 0 && n - (arr[idx - 1] as number) > 1) acc.push("ellipsis")
      acc.push(n)
      return acc
    }, [])

  return (
    <div className="border-t px-4 py-3 flex items-center justify-between gap-4">
      <p className="text-xs text-muted-foreground">
        {from}–{to} of {totalCount}
      </p>
      <Pagination className="w-auto mx-0">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() => onPageChange(Math.max(1, page - 1))}
              aria-disabled={page === 1}
              className={page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
          {pageItems.map((item, idx) =>
            item === "ellipsis" ? (
              <PaginationItem key={`ellipsis-${idx}`}><PaginationEllipsis /></PaginationItem>
            ) : (
              <PaginationItem key={item}>
                <Button
                  variant={item === page ? "outline" : "ghost"}
                  size="icon"
                  className="size-8"
                  onClick={() => onPageChange(item as number)}
                >
                  {item}
                </Button>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              aria-disabled={page === totalPages}
              className={page === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

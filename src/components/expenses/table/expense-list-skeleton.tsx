import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function ExpenseListSkeleton() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="hidden sm:table-cell">Category</TableHead>
          <TableHead className="text-right">Amount</TableHead>
          <TableHead className="w-[80px]" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, i) => (
          <TableRow key={i}>
            <TableCell><Skeleton className="h-4 w-20" /></TableCell>
            <TableCell><Skeleton className="h-4 w-32" /></TableCell>
            <TableCell className="hidden sm:table-cell"><Skeleton className="h-5 w-24 rounded-full" /></TableCell>
            <TableCell className="text-right"><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
            <TableCell><Skeleton className="h-7 w-16 ml-auto" /></TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

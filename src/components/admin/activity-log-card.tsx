"use client"

import { useState } from "react"
import { format } from "date-fns"
import { ChevronLeft, ChevronRight, RefreshCw } from "lucide-react"
import { useAdminActivities } from "@/hooks/use-admin"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

const PAGE_SIZE = 20

export function ActivityLogCard() {
  const [page, setPage] = useState(0)
  const activitiesQuery = useAdminActivities(page, PAGE_SIZE)

  const rows       = activitiesQuery.data?.rows  ?? []
  const total      = activitiesQuery.data?.total ?? 0
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const from       = page * PAGE_SIZE + 1
  const to         = Math.min((page + 1) * PAGE_SIZE, total)

  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Activity Log</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            disabled={activitiesQuery.isFetching}
            onClick={() => activitiesQuery.refetch()}
          >
            <RefreshCw className={`size-3.5 ${activitiesQuery.isFetching ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Detail</TableHead>
              <TableHead className="pr-4">Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activitiesQuery.isLoading
              ? Array.from({ length: PAGE_SIZE }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-4"><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-full" /></TableCell>
                    <TableCell className="pr-4"><Skeleton className="h-4 w-full" /></TableCell>
                  </TableRow>
                ))
              : activitiesQuery.isError
              ? (
                  <TableRow>
                    <TableCell colSpan={4} className="pl-4 py-8 text-sm text-muted-foreground">
                      Failed to load activity log.{" "}
                      <button className="underline" onClick={() => activitiesQuery.refetch()}>Retry</button>
                    </TableCell>
                  </TableRow>
                )
              : rows.length === 0
              ? (
                  <TableRow>
                    <TableCell colSpan={4} className="pl-4 py-8 text-sm text-muted-foreground">
                      No activity yet.
                    </TableCell>
                  </TableRow>
                )
              : rows.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium pl-4">{activity.username}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-mono">
                        {activity.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground whitespace-normal break-words min-w-[100px]">
                      {activity.detail || null}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground pr-4 whitespace-nowrap">
                      <span className="sm:hidden">{format(new Date(activity.createdAt), "HH:mm")}</span>
                      <span className="hidden sm:inline">{format(new Date(activity.createdAt), "dd MMM yyyy HH:mm")}</span>
                    </TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
      </CardContent>
      {total > PAGE_SIZE && (
        <CardFooter className="flex items-center justify-between border-t px-4 py-3">
          <span className="text-xs text-muted-foreground">
            {total === 0 ? "No entries" : `Showing ${from}–${to} of ${total}`}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1"
              disabled={page === 0 || activitiesQuery.isFetching}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="size-3.5" />
              Prev
            </Button>
            <span className="text-xs text-muted-foreground">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1"
              disabled={page >= totalPages - 1 || activitiesQuery.isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
              <ChevronRight className="size-3.5" />
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  )
}

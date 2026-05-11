"use client"

import { format } from "date-fns"
import { useAdminActivities } from "@/hooks/use-admin"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

export function ActivityLogCard() {
  const activitiesQuery = useAdminActivities()

  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-base">Activity Log</CardTitle>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <Table>
          <colgroup>
            <col className="w-[15%]" />
            <col className="w-[20%]" />
            <col className="w-[45%]" />
            <col className="w-[20%]" />
          </colgroup>
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
              ? Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 4 }).map((_, j) => (
                      <TableCell key={j} className={j === 0 ? "pl-4" : j === 3 ? "pr-4" : ""}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
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
              : (activitiesQuery.data ?? []).map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium pl-4">{activity.username}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="text-xs font-mono">
                        {activity.action}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {activity.detail || null}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground pr-4">
                      {format(new Date(activity.createdAt), "dd MMM HH:mm")}
                    </TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

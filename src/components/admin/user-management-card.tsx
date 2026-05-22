"use client"

import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ChevronRight } from "lucide-react"
import { useAdminUsers } from "@/hooks/use-admin"
import { CreateUserDialog } from "@/components/admin/create-user-dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function UserManagementCard({ currentUserId }: { currentUserId: string }) {
  const router     = useRouter()
  const usersQuery = useAdminUsers()

  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">User Management</CardTitle>
          <CreateUserDialog />
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Username</TableHead>
              <TableHead className="hidden sm:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="hidden sm:table-cell">Joined</TableHead>
              <TableHead className="w-10" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersQuery.isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j} className={j === 0 ? "pl-4" : ""}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              : usersQuery.isError
              ? (
                  <TableRow>
                    <TableCell colSpan={5} className="pl-4 py-8 text-sm text-muted-foreground">
                      Failed to load users.{" "}
                      <button className="underline" onClick={() => usersQuery.refetch()}>Retry</button>
                    </TableCell>
                  </TableRow>
                )
              : (usersQuery.data ?? []).map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => router.push(`/admin/users/${user.id}`)}
                  >
                    <TableCell className="font-medium pl-4">
                      {user.username}
                      {user.id === currentUserId && (
                        <span className="ml-2 text-xs text-muted-foreground italic">you</span>
                      )}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"} className="text-xs">
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="pr-3">
                      <ChevronRight className="size-4 text-muted-foreground ml-auto" />
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

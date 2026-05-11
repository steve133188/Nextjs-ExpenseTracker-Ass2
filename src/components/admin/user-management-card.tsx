"use client"

import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { useAdminUsers, useChangeRole, useDeleteUser } from "@/hooks/use-admin"
import { CreateUserDialog } from "@/components/admin/create-user-dialog"
import { ResetPasswordDialog } from "@/components/admin/reset-password-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

export function UserManagementCard({ currentUserId }: { currentUserId: string }) {
  const usersQuery  = useAdminUsers()
  const changeRole  = useChangeRole()
  const deleteUser  = useDeleteUser()

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
          <colgroup>
            <col className="w-[13%]" />
            <col className="w-[28%]" />
            <col className="w-[9%]" />
            <col className="w-[13%]" />
            <col className="w-[37%]" />
          </colgroup>
          <TableHeader>
            <TableRow>
              <TableHead className="pl-4">Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right pr-4">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {usersQuery.isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <TableRow key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <TableCell key={j} className={j === 0 ? "pl-4" : j === 4 ? "pr-4" : ""}>
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
                  <TableRow key={user.id}>
                    <TableCell className="font-medium pl-4">{user.username}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 text-xs"
                          disabled={user.id === currentUserId || changeRole.isPending}
                          onClick={() =>
                            changeRole.mutate({ id: user.id, role: user.role === "admin" ? "user" : "admin" })
                          }
                        >
                          {user.role === "admin" ? "→ user" : "→ admin"}
                        </Button>
                        <ResetPasswordDialog userId={user.id} username={user.username} />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          disabled={user.id === currentUserId || deleteUser.isPending}
                          onClick={() => deleteUser.mutate(user.id)}
                        >
                          <Trash2 className="size-3.5" />
                        </Button>
                      </div>
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

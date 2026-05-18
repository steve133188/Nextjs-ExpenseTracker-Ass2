"use client"

import { format } from "date-fns"
import { Trash2 } from "lucide-react"
import { useAdminUsers, useChangeRole, useDeleteUser } from "@/hooks/use-admin"
import { CreateUserDialog } from "@/components/admin/create-user-dialog"
import { ResetPasswordDialog } from "@/components/admin/reset-password-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

export function UserManagementCard({ currentUserId }: { currentUserId: string }) {
  const usersQuery = useAdminUsers()
  const changeRole = useChangeRole()
  const deleteUser = useDeleteUser()

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
            <col className="w-[12%]" />
            <col className="w-[13%]" />
            <col className="w-[34%]" />
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
                      {user.id === currentUserId ? (
                        <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                          {user.role}
                        </Badge>
                      ) : (
                        <Select
                          value={user.role}
                          disabled={changeRole.isPending}
                          onValueChange={(role) => changeRole.mutate({ id: user.id, role })}
                        >
                          <SelectTrigger className="h-7 w-24 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="user">user</SelectItem>
                            <SelectItem value="admin">admin</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(user.createdAt), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="text-right pr-4">
                      {user.id === currentUserId ? (
                        <span className="text-xs text-muted-foreground italic">you</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <ResetPasswordDialog userId={user.id} username={user.username} />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-destructive hover:text-destructive"
                            disabled={deleteUser.isPending}
                            onClick={() => deleteUser.mutate(user.id)}
                          >
                            <Trash2 className="size-3.5" />
                          </Button>
                        </div>
                      )}
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

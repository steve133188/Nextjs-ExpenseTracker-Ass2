"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Trash2, UserPlus } from "lucide-react"
import { toast } from "sonner"
import { adminCreateUserSchema, type AdminCreateUserFormData } from "@/lib/validations"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"

interface AdminUser {
  id:        string
  username:  string
  email:     string
  role:      string
  createdAt: number
}

interface Activity {
  id:        string
  username:  string
  action:    string
  detail:    string
  createdAt: number
}

function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ["admin", "users"],
    queryFn:  () => fetch("/api/admin/users").then((r) => r.json()),
  })
}

function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AdminCreateUserFormData) =>
      fetch("/api/admin/users", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }).then(async (r) => {
        const json = await r.json()
        if (!r.ok) throw new Error(json.error ?? "Failed to create user")
        return json
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })
      toast.success("User created")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

function CreateUserDialog() {
  const [open, setOpen] = useState(false)
  const createUser = useCreateUser()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isValid } } =
    useForm<AdminCreateUserFormData>({
      resolver: zodResolver(adminCreateUserSchema),
      mode: "onChange",
      defaultValues: { username: "", email: "", password: "", role: "user" },
    })

  const role = watch("role")

  function onSubmit(data: AdminCreateUserFormData) {
    createUser.mutate(data, {
      onSuccess: () => { setOpen(false); reset() },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!createUser.isPending) { setOpen(val); if (!val) reset() } }}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 text-xs gap-1">
          <UserPlus className="size-3.5" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <form id="create-user-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cu-username">Username</Label>
            <Input id="cu-username" placeholder="e.g. john" disabled={createUser.isPending} {...register("username")} />
            {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cu-email">Email</Label>
            <Input id="cu-email" type="email" placeholder="e.g. john@example.com" disabled={createUser.isPending} {...register("email")} />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cu-password">Password</Label>
            <Input id="cu-password" type="password" placeholder="Min 8 characters" disabled={createUser.isPending} {...register("password")} />
            {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setValue("role", v as "user" | "admin", { shouldValidate: true })} disabled={createUser.isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">user</SelectItem>
                <SelectItem value="admin">admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={createUser.isPending}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="create-user-form" disabled={createUser.isPending || !isValid}>
            {createUser.isPending ? "Creating..." : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function useAdminActivities() {
  return useQuery<Activity[]>({
    queryKey: ["admin", "activities"],
    queryFn:  () => fetch("/api/admin/activities").then((r) => r.json()),
  })
}

export function AdminPanel({ currentUserId }: { currentUserId: string }) {
  const queryClient      = useQueryClient()
  const usersQuery       = useAdminUsers()
  const activitiesQuery  = useAdminActivities()

  const changeRole = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      fetch(`/api/admin/users/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ role }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      toast.success("Role updated")
    },
    onError: () => toast.error("Failed to update role"),
  })

  const deleteUser = useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/users/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })
      toast.success("User deleted")
    },
    onError: () => toast.error("Failed to delete user"),
  })

  return (
    <div className="space-y-6">
      {/* User Management */}
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
              <col className="w-[15%]" />
              <col className="w-[35%]" />
              <col className="w-[10%]" />
              <col className="w-[15%]" />
              <col className="w-[25%]" />
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
                        <TableCell key={j} className={j === 0 ? "pl-4" : j === 4 ? "pr-4" : ""}><Skeleton className="h-4 w-full" /></TableCell>
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

      {/* Activity Log */}
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
                        <TableCell key={j} className={j === 0 ? "pl-4" : j === 3 ? "pr-4" : ""}><Skeleton className="h-4 w-full" /></TableCell>
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
    </div>
  )
}

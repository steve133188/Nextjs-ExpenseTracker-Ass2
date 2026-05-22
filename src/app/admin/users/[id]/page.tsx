"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { format } from "date-fns"
import { ChevronLeft, Pencil, Check, X } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import {
  useAdminUser, useChangeRole, useAdminChangeUsername,
  useDeleteUser, useResetUserPassword,
} from "@/hooks/use-admin"
import { RoleConfirmDialog } from "@/components/admin/role-confirm-dialog"
import { ResetPasswordDialog } from "@/components/admin/reset-password-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { user: currentUser } = useAuth()

  const userQuery       = useAdminUser(id)
  const changeRole      = useChangeRole()
  const changeUsername  = useAdminChangeUsername()
  const deleteUser      = useDeleteUser()
  const resetPassword   = useResetUserPassword()

  const [editingName, setEditingName] = useState(false)
  const [nameInput,   setNameInput]   = useState("")
  const [roleConfirm, setRoleConfirm] = useState<{ id: string; username: string; newRole: string } | null>(null)
  const [deleteOpen,  setDeleteOpen]  = useState(false)

  const target = userQuery.data
  const isSelf = currentUser?.id === id

  function startEditName() {
    setNameInput(target?.username ?? "")
    setEditingName(true)
  }

  function cancelEditName() {
    setEditingName(false)
    setNameInput("")
  }

  function saveName() {
    if (!nameInput.trim() || nameInput === target?.username) { cancelEditName(); return }
    changeUsername.mutate({ id, username: nameInput.trim() }, {
      onSuccess: () => setEditingName(false),
    })
  }

  function handleDelete() {
    deleteUser.mutate(id, {
      onSuccess: () => router.push("/admin/users"),
    })
  }

  return (
    <>
      <div className="mb-4">
        <button
          onClick={() => router.push("/admin/users")}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="size-4" />
          Users
        </button>
      </div>

      <div className="space-y-4">
        <Card>
          <CardHeader className="py-3 px-4">
            <CardTitle className="text-base">User Details</CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4 space-y-4">
            {userQuery.isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-5 w-full" />)}
              </div>
            ) : userQuery.isError ? (
              <p className="text-sm text-muted-foreground">Failed to load user.</p>
            ) : target ? (
              <>
                {/* Username */}
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-muted-foreground w-24 shrink-0">Username</span>
                  {editingName ? (
                    <div className="flex items-center gap-2 flex-1">
                      <Input
                        className="h-8 text-sm"
                        value={nameInput}
                        onChange={e => setNameInput(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") saveName(); if (e.key === "Escape") cancelEditName() }}
                        autoFocus
                        disabled={changeUsername.isPending}
                      />
                      <Button size="icon" className="size-8 shrink-0" onClick={saveName} disabled={changeUsername.isPending}>
                        <Check className="size-3.5" />
                      </Button>
                      <Button size="icon" variant="ghost" className="size-8 shrink-0" onClick={cancelEditName}>
                        <X className="size-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1 justify-between">
                      <span className="text-sm font-medium">{target.username}</span>
                      {!isSelf && (
                        <Button size="icon" variant="ghost" className="size-7" onClick={startEditName}>
                          <Pencil className="size-3.5" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                <Separator />

                {/* Email */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-24 shrink-0">Email</span>
                  <span className="text-sm">{target.email}</span>
                </div>

                <Separator />

                {/* Role */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-24 shrink-0">Role</span>
                  {isSelf ? (
                    <Badge variant={target.role === "admin" ? "default" : "secondary"}>{target.role}</Badge>
                  ) : (
                    <Select
                      value={target.role}
                      disabled={changeRole.isPending}
                      onValueChange={(newRole) => setRoleConfirm({ id, username: target.username, newRole })}
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
                </div>

                <Separator />

                {/* Joined */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground w-24 shrink-0">Joined</span>
                  <span className="text-sm">{format(new Date(target.createdAt), "dd MMM yyyy")}</span>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>

        {!isSelf && target && (
          <Card className="border-destructive/30">
            <CardHeader className="py-3 px-4">
              <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 flex flex-wrap gap-2">
              <ResetPasswordDialog userId={id} username={target.username} />
              <Button
                variant="destructive"
                size="sm"
                disabled={deleteUser.isPending}
                onClick={() => setDeleteOpen(true)}
              >
                Delete User
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <RoleConfirmDialog
        target={roleConfirm}
        onConfirm={(uid, role) => { changeRole.mutate({ id: uid, role }); setRoleConfirm(null) }}
        onCancel={() => setRoleConfirm(null)}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{target?.username}</strong> and all their expenses. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

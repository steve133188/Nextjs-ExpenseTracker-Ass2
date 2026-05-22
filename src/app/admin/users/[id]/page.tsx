"use client"

import { useParams, useRouter } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useAdminUser, useChangeRole, useAdminChangeUsername, useDeleteUser } from "@/hooks/use-admin"
import { useInlineEdit } from "@/hooks/use-inline-edit"
import { UserInfoCard } from "@/components/admin/user-info-card"
import { UserDangerZoneCard } from "@/components/admin/user-danger-zone-card"

export default function UserDetailPage() {
  const { id }             = useParams<{ id: string }>()
  const router             = useRouter()
  const { user: currentUser } = useAuth()

  const userQuery      = useAdminUser(id)
  const changeRole     = useChangeRole()
  const changeUsername = useAdminChangeUsername()
  const deleteUser     = useDeleteUser()

  const nameEdit = useInlineEdit()
  const roleEdit = useInlineEdit()

  const target = userQuery.data
  const isSelf = currentUser?.id === id

  function saveName() {
    if (!nameEdit.value.trim() || nameEdit.value === target?.username) { nameEdit.cancel(); return }
    changeUsername.mutate({ id, username: nameEdit.value.trim() }, { onSuccess: nameEdit.cancel })
  }

  function saveRole() {
    if (!roleEdit.value || roleEdit.value === target?.role) { roleEdit.cancel(); return }
    changeRole.mutate({ id, role: roleEdit.value }, { onSuccess: roleEdit.cancel })
  }

  function handleDelete() {
    deleteUser.mutate(id, { onSuccess: () => router.push("/admin/users") })
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
        <UserInfoCard
          isLoading={userQuery.isLoading}
          isError={userQuery.isError}
          target={target}
          isSelf={isSelf}
          nameEdit={nameEdit}
          roleEdit={roleEdit}
          onSaveName={saveName}
          onSaveRole={saveRole}
          isChangingUsername={changeUsername.isPending}
          isChangingRole={changeRole.isPending}
        />

        {!isSelf && target && (
          <UserDangerZoneCard
            userId={id}
            username={target.username}
            isDeleting={deleteUser.isPending}
            onDelete={handleDelete}
          />
        )}
      </div>
    </>
  )
}

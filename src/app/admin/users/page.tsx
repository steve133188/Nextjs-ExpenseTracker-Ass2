"use client"

import { useAuth } from "@/hooks/use-auth"
import { UserManagementCard } from "@/components/admin/user-management-card"
import { Spinner } from "@/components/ui/spinner"

export default function UsersPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (!user) return null

  return <UserManagementCard currentUserId={user.id} />
}

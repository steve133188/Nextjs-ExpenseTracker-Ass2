"use client"

import { useAuth } from "@/hooks/use-auth"
import { UserManagementCard } from "@/components/admin/user-management-card"

export default function UsersPage() {
  const { user } = useAuth()
  if (!user) return null
  return <UserManagementCard currentUserId={user.id} />
}

"use client"

import { UserManagementCard } from "@/components/admin/user-management-card"
import { ActivityLogCard } from "@/components/admin/activity-log-card"

export function AdminPanel({ currentUserId }: { currentUserId: string }) {
  return (
    <div className="space-y-6">
      <UserManagementCard currentUserId={currentUserId} />
      <ActivityLogCard />
    </div>
  )
}

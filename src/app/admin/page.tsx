"use client"

import { useState } from "react"
import Link from "next/link"
import { Users, FileText, ChevronLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { UserManagementCard } from "@/components/admin/user-management-card"
import { ActivityLogCard } from "@/components/admin/activity-log-card"
import { UserMenu } from "@/components/auth/user-menu"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

type AdminTab = "users" | "activity"

export default function AdminPage() {
  const { user, isLoading } = useAuth()
  const [tab, setTab] = useState<AdminTab>("users")

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="size-6 text-muted-foreground" />
      </div>
    )
  }

  if (!user || user.role !== "admin") return null

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3 max-w-5xl">
          <span className="text-xl font-semibold tracking-tight">Ledger</span>
          <span className="hidden sm:block text-xs text-muted-foreground font-mono tracking-widest uppercase pt-0.5">
            Admin Panel
          </span>
          <div className="ml-auto flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="size-4" />
              My Expenses
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

      <div className="border-b bg-background sticky top-[53px] z-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-2 sm:flex">
            <button
              onClick={() => setTab("users")}
              className={cn(
                "flex items-center justify-center sm:justify-start gap-2 px-4 py-3 text-sm border-b-2 transition-colors",
                tab === "users"
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Users className="size-4" />
              Users
            </button>
            <button
              onClick={() => setTab("activity")}
              className={cn(
                "flex items-center justify-center sm:justify-start gap-2 px-4 py-3 text-sm border-b-2 transition-colors",
                tab === "activity"
                  ? "border-foreground font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <FileText className="size-4" />
              Activity Log
            </button>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {tab === "users" ? (
          <UserManagementCard currentUserId={user.id} />
        ) : (
          <ActivityLogCard />
        )}
      </main>
    </div>
  )
}

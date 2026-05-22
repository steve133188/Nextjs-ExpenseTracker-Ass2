"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, FileText, ChevronLeft } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { UserMenu } from "@/components/auth/user-menu"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"

const tabs = [
  { href: "/admin/users",      label: "Users",        icon: Users },
  { href: "/admin/activities", label: "Activity Log", icon: FileText },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const pathname = usePathname()

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
          <span className="text-xl font-semibold tracking-tight">Expense Tracker</span>
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
            {tabs.map(({ href, label, icon: Icon }) => {
              const active = pathname === href || pathname.startsWith(href + "/")
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "flex items-center justify-center sm:justify-start gap-2 px-4 py-3 text-sm border-b-2 transition-colors",
                    active
                      ? "border-foreground font-medium text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-6 max-w-5xl">
        {children}
      </main>
    </div>
  )
}

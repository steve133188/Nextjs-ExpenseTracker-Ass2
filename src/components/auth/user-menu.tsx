"use client"

import { useState } from "react"
import Link from "next/link"
import { useTheme } from "next-themes"
import { Sun, Moon, KeyRound, LogOut, ChevronDown, LayoutDashboard, UserPen } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { ChangePasswordDialog } from "@/components/auth/change-password-dialog"
import { ChangeUsernameDialog } from "@/components/auth/change-username-dialog"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

export function UserMenu() {
  const { theme, setTheme } = useTheme()
  const { user, logout }    = useAuth()
  const [passwordOpen, setPasswordOpen] = useState(false)
  const [usernameOpen, setUsernameOpen] = useState(false)

  if (!user) return null

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-1.5 text-sm">
            {user.username}
            <ChevronDown className="size-3.5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44">
          <DropdownMenuLabel className="font-normal text-xs text-muted-foreground truncate">
            {user.username}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user.role === "admin" && (
            <DropdownMenuItem asChild>
              <Link href="/admin/users" className="flex items-center gap-2">
                <LayoutDashboard className="size-4" />
                Admin Panel
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark"
              ? <><Sun className="size-4" /> Light mode</>
              : <><Moon className="size-4" /> Dark mode</>
            }
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setUsernameOpen(true)}>
            <UserPen className="size-4" />
            Change username
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPasswordOpen(true)}>
            <KeyRound className="size-4" />
            Change password
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
            <LogOut className="size-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ChangeUsernameDialog
        open={usernameOpen}
        onOpenChange={setUsernameOpen}
        currentUsername={user.username}
      />
      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />
    </>
  )
}

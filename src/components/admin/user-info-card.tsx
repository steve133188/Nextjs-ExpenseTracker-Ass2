"use client"

import { format } from "date-fns"
import { Pencil, Check, X } from "lucide-react"
import type { useInlineEdit } from "@/hooks/use-inline-edit"
import type { AdminUser } from "@/hooks/use-admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

type InlineEdit = ReturnType<typeof useInlineEdit>

interface UserInfoCardProps {
  isLoading:          boolean
  isError:            boolean
  target:             AdminUser | undefined
  isSelf:             boolean
  nameEdit:           InlineEdit
  roleEdit:           InlineEdit
  onSaveName:         () => void
  onSaveRole:         () => void
  isChangingUsername: boolean
  isChangingRole:     boolean
}

export function UserInfoCard({
  isLoading, isError, target, isSelf,
  nameEdit, roleEdit, onSaveName, onSaveRole,
  isChangingUsername, isChangingRole,
}: UserInfoCardProps) {
  return (
    <Card>
      <CardHeader className="py-3 px-4">
        <CardTitle className="text-base">User Details</CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-5 w-full" />)}
          </div>
        ) : isError ? (
          <p className="text-sm text-muted-foreground">Failed to load user.</p>
        ) : target ? (
          <>
            {/* Username */}
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground w-24 shrink-0">Username</span>
              {nameEdit.editing ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input
                    className="h-8 text-sm"
                    value={nameEdit.value}
                    onChange={e => nameEdit.setValue(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") onSaveName(); if (e.key === "Escape") nameEdit.cancel() }}
                    autoFocus
                    disabled={isChangingUsername}
                  />
                  <Button size="icon" className="size-8 shrink-0" onClick={onSaveName} disabled={isChangingUsername}>
                    <Check className="size-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="size-8 shrink-0" onClick={nameEdit.cancel}>
                    <X className="size-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1 justify-between">
                  <span className="text-sm font-medium">{target.username}</span>
                  <Button size="icon" variant="ghost" className="size-7" onClick={() => nameEdit.start(target.username)}>
                    <Pencil className="size-3.5" />
                  </Button>
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
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm text-muted-foreground w-24 shrink-0">Role</span>
              {isSelf ? (
                <div className="flex-1">
                  <Badge variant={target.role === "admin" ? "default" : "secondary"}>{target.role}</Badge>
                </div>
              ) : roleEdit.editing ? (
                <div className="flex items-center gap-2 flex-1">
                  <Select value={roleEdit.value} onValueChange={roleEdit.setValue} disabled={isChangingRole}>
                    <SelectTrigger className="h-8 text-sm flex-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">user</SelectItem>
                      <SelectItem value="admin">admin</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="icon" className="size-8 shrink-0" onClick={onSaveRole} disabled={isChangingRole}>
                    <Check className="size-3.5" />
                  </Button>
                  <Button size="icon" variant="ghost" className="size-8 shrink-0" onClick={roleEdit.cancel}>
                    <X className="size-3.5" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2 flex-1 justify-between">
                  <Badge variant={target.role === "admin" ? "default" : "secondary"}>{target.role}</Badge>
                  <Button size="icon" variant="ghost" className="size-7" onClick={() => roleEdit.start(target.role)}>
                    <Pencil className="size-3.5" />
                  </Button>
                </div>
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
  )
}

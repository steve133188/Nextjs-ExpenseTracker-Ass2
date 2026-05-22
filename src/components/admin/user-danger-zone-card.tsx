"use client"

import { useState } from "react"
import { ResetPasswordDialog } from "@/components/admin/reset-password-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserDangerZoneCardProps {
  userId:    string
  username:  string
  isDeleting: boolean
  onDelete:  () => void
}

export function UserDangerZoneCard({ userId, username, isDeleting, onDelete }: UserDangerZoneCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Card className="border-destructive/30">
        <CardHeader className="py-3 px-4">
          <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="px-4 pb-4 flex flex-wrap gap-2">
          <ResetPasswordDialog userId={userId} username={username} />
          <Button
            variant="destructive"
            size="sm"
            disabled={isDeleting}
            onClick={() => setOpen(true)}
          >
            Delete User
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete user?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{username}</strong> and all their expenses. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={onDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

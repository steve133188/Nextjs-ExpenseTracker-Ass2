"use client"

import { useState } from "react"
import { KeyRound, Copy, Check } from "lucide-react"
import { useResetUserPassword } from "@/hooks/use-admin"
import { Button } from "@/components/ui/button"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogClose, DialogDescription,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export function ResetPasswordDialog({ userId, username }: { userId: string; username: string }) {
  const [open, setOpen]       = useState(false)
  const [generated, setGenerated] = useState<string | null>(null)
  const [copied, setCopied]   = useState(false)
  const resetPassword         = useResetUserPassword()

  function handleReset() {
    resetPassword.mutate(userId, {
      onSuccess: (data) => setGenerated(data.password),
    })
  }

  function handleCopy() {
    if (!generated) return
    navigator.clipboard.writeText(generated)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleOpenChange(val: boolean) {
    if (resetPassword.isPending) return
    setOpen(val)
    if (!val) { setGenerated(null); setCopied(false) }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Reset password for ${username}`}>
          <KeyRound className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Reset Password — {username}</DialogTitle>
          <DialogDescription>
            {generated
              ? "Share this temporary password with the user. It cannot be retrieved again."
              : "A new random password will be generated for this user."}
          </DialogDescription>
        </DialogHeader>

        {generated ? (
          <div className="flex gap-2">
            <Input value={generated} readOnly className="font-mono text-sm" />
            <Button variant="outline" size="icon" onClick={handleCopy} aria-label="Copy password">
              {copied ? <Check className="size-4 text-green-600" /> : <Copy className="size-4" />}
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            The user's current password will be replaced immediately.
          </p>
        )}

        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={resetPassword.isPending}>
              {generated ? "Close" : "Cancel"}
            </Button>
          </DialogClose>
          {!generated && (
            <Button onClick={handleReset} disabled={resetPassword.isPending}>
              {resetPassword.isPending ? "Generating..." : "Generate Password"}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

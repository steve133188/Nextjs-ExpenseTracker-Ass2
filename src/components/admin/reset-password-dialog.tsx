"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound } from "lucide-react"
import { adminResetPasswordSchema, type AdminResetPasswordFormData } from "@/lib/validations"
import { useResetUserPassword } from "@/hooks/use-admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog"

export function ResetPasswordDialog({ userId, username }: { userId: string; username: string }) {
  const [open, setOpen]  = useState(false)
  const resetPassword    = useResetUserPassword()

  const { register, handleSubmit, reset, formState: { errors, isValid } } =
    useForm<AdminResetPasswordFormData>({
      resolver: zodResolver(adminResetPasswordSchema),
      mode: "onChange",
      defaultValues: { newPassword: "" },
    })

  function onSubmit(data: AdminResetPasswordFormData) {
    resetPassword.mutate({ id: userId, ...data }, {
      onSuccess: () => { setOpen(false); reset() },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!resetPassword.isPending) { setOpen(val); if (!val) reset() } }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-7 w-7" aria-label={`Reset password for ${username}`}>
          <KeyRound className="size-3.5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Reset Password — {username}</DialogTitle>
        </DialogHeader>
        <form id="reset-password-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="rp-new">New Password</Label>
            <Input id="rp-new" type="password" placeholder="Min 8 characters" disabled={resetPassword.isPending} {...register("newPassword")} />
            {errors.newPassword && <p className="text-destructive text-sm">{errors.newPassword.message}</p>}
          </div>
        </form>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={resetPassword.isPending}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="reset-password-form" disabled={resetPassword.isPending || !isValid}>
            {resetPassword.isPending ? "Resetting..." : "Reset Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { changePasswordSchema, type ChangePasswordFormData } from "@/lib/validations"
import { useChangePassword } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogFooter, DialogClose,
} from "@/components/ui/dialog"

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ChangePasswordDialog({ open, onOpenChange }: Props) {
  const changePassword = useChangePassword()

  const { register, handleSubmit, reset, formState: { errors, isValid } } =
    useForm<ChangePasswordFormData>({
      resolver: zodResolver(changePasswordSchema),
      mode: "onChange",
      defaultValues: { currentPassword: "", newPassword: "", confirmPassword: "" },
    })

  useEffect(() => { if (!open) reset() }, [open, reset])

  function onSubmit({ confirmPassword: _, ...data }: ChangePasswordFormData) {
    changePassword.mutate(data, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!changePassword.isPending) onOpenChange(val) }}>
      <DialogContent className="sm:max-w-sm" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
        </DialogHeader>
        <form id="change-password-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cp-current">Current Password</Label>
            <Input id="cp-current" type="password" disabled={changePassword.isPending} {...register("currentPassword")} />
            {errors.currentPassword && <p className="text-destructive text-sm">{errors.currentPassword.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cp-new">New Password</Label>
            <Input id="cp-new" type="password" placeholder="Min 8 characters" disabled={changePassword.isPending} {...register("newPassword")} />
            {errors.newPassword && <p className="text-destructive text-sm">{errors.newPassword.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cp-confirm">Confirm New Password</Label>
            <Input id="cp-confirm" type="password" placeholder="Re-enter new password" disabled={changePassword.isPending} {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword.message}</p>}
          </div>
        </form>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={changePassword.isPending}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="change-password-form" disabled={changePassword.isPending || !isValid}>
            {changePassword.isPending ? "Saving..." : "Change Password"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

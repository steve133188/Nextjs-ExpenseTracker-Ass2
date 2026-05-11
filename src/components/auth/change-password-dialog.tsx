"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { KeyRound } from "lucide-react"
import { changePasswordSchema, type ChangePasswordFormData } from "@/lib/validations"
import { useChangePassword } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog"

export function ChangePasswordDialog() {
  const [open, setOpen] = useState(false)
  const changePassword  = useChangePassword()

  const { register, handleSubmit, reset, formState: { errors, isValid } } =
    useForm<ChangePasswordFormData>({
      resolver: zodResolver(changePasswordSchema),
      mode: "onChange",
      defaultValues: { currentPassword: "", newPassword: "" },
    })

  function onSubmit(data: ChangePasswordFormData) {
    changePassword.mutate(data, {
      onSuccess: () => { setOpen(false); reset() },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!changePassword.isPending) { setOpen(val); if (!val) reset() } }}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Change password">
          <KeyRound className="size-4" />
        </Button>
      </DialogTrigger>
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

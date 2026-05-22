"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { changeUsernameSchema, type ChangeUsernameFormData } from "@/lib/validations"
import { useChangeUsername } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose,
} from "@/components/ui/dialog"

interface Props {
  open:         boolean
  onOpenChange: (open: boolean) => void
  currentUsername: string
}

export function ChangeUsernameDialog({ open, onOpenChange, currentUsername }: Props) {
  const changeUsername = useChangeUsername()

  const { register, handleSubmit, reset, formState: { errors, isValid } } =
    useForm<ChangeUsernameFormData>({
      resolver:      zodResolver(changeUsernameSchema),
      mode:          "onChange",
      defaultValues: { username: currentUsername },
    })

  useEffect(() => {
    if (open) reset({ username: currentUsername })
  }, [open, currentUsername, reset])

  function onSubmit({ username }: ChangeUsernameFormData) {
    changeUsername.mutate(username, {
      onSuccess: () => onOpenChange(false),
    })
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!changeUsername.isPending) onOpenChange(val) }}>
      <DialogContent className="sm:max-w-sm" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Change Username</DialogTitle>
        </DialogHeader>
        <form id="change-username-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cu-username">New Username</Label>
            <Input
              id="cu-username"
              disabled={changeUsername.isPending}
              {...register("username")}
            />
            {errors.username && (
              <p className="text-destructive text-sm">{errors.username.message}</p>
            )}
          </div>
        </form>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={changeUsername.isPending}>Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            form="change-username-form"
            disabled={changeUsername.isPending || !isValid}
          >
            {changeUsername.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

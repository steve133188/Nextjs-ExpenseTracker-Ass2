"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserPlus } from "lucide-react"
import { adminCreateUserSchema, type AdminCreateUserFormData } from "@/lib/validations"
import { useCreateUser } from "@/hooks/use-admin"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
  DialogTrigger, DialogFooter, DialogClose,
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"

export function CreateUserDialog() {
  const [open, setOpen] = useState(false)
  const createUser = useCreateUser()

  const { register, handleSubmit, reset, setValue, watch, formState: { errors, isValid } } =
    useForm<AdminCreateUserFormData>({
      resolver: zodResolver(adminCreateUserSchema),
      mode: "onChange",
      defaultValues: { username: "", email: "", password: "", role: "user" },
    })

  const role = watch("role")

  function onSubmit(data: AdminCreateUserFormData) {
    createUser.mutate(data, {
      onSuccess: () => { setOpen(false); reset() },
    })
  }

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!createUser.isPending) { setOpen(val); if (!val) reset() } }}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 text-xs gap-1">
          <UserPlus className="size-3.5" />
          Create User
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>
        <form id="create-user-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cu-username">Username</Label>
            <Input id="cu-username" placeholder="e.g. john" disabled={createUser.isPending} {...register("username")} />
            {errors.username && <p className="text-destructive text-sm">{errors.username.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cu-email">Email</Label>
            <Input id="cu-email" type="email" placeholder="e.g. john@example.com" disabled={createUser.isPending} {...register("email")} />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="cu-password">Password</Label>
            <Input id="cu-password" type="password" placeholder="Min 8 characters" disabled={createUser.isPending} {...register("password")} />
            {errors.password && <p className="text-destructive text-sm">{errors.password.message}</p>}
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Role</Label>
            <Select value={role} onValueChange={(v) => setValue("role", v as "user" | "admin", { shouldValidate: true })} disabled={createUser.isPending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">user</SelectItem>
                <SelectItem value="admin">admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>
        <DialogFooter className="gap-2">
          <DialogClose asChild>
            <Button variant="outline" disabled={createUser.isPending}>Cancel</Button>
          </DialogClose>
          <Button type="submit" form="create-user-form" disabled={createUser.isPending || !isValid}>
            {createUser.isPending ? "Creating..." : "Create User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

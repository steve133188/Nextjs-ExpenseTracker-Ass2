import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { adminCreateUserSchema, type AdminCreateUserFormData } from "@/lib/validations"

export interface AdminUser {
  id:        string
  username:  string
  email:     string
  role:      string
  createdAt: number
}

export interface Activity {
  id:        string
  username:  string
  action:    string
  detail:    string
  createdAt: number
}

export interface PaginatedActivities {
  rows:  Activity[]
  total: number
}

async function fetchJson<T>(url: string): Promise<T> {
  const r = await fetch(url)
  const json = await r.json()
  if (!r.ok) throw new Error(json.error ?? "Request failed")
  return json as T
}

export function useAdminUsers() {
  return useQuery<AdminUser[]>({
    queryKey: ["admin", "users"],
    queryFn:  () => fetchJson<AdminUser[]>("/api/admin/users"),
  })
}

export function useAdminActivities(page = 0, pageSize = 20) {
  return useQuery<PaginatedActivities>({
    queryKey: ["admin", "activities", page],
    queryFn:  () =>
      fetchJson<PaginatedActivities>(`/api/admin/activities?limit=${pageSize}&offset=${page * pageSize}`),
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: AdminCreateUserFormData) =>
      fetch("/api/admin/users", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }).then(async (r) => {
        const json = await r.json()
        if (!r.ok) throw new Error(json.error ?? "Failed to create user")
        return json
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })
      toast.success("User created")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useChangeRole() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) =>
      fetch(`/api/admin/users/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ role }),
      }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      toast.success("Role updated")
    },
    onError: () => toast.error("Failed to update role"),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/users/${id}`, { method: "DELETE" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })
      toast.success("User deleted")
    },
    onError: () => toast.error("Failed to delete user"),
  })
}

export function useResetUserPassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      fetch(`/api/admin/users/${id}/reset-password`, { method: "POST" })
        .then(async (r) => {
          const json = await r.json()
          if (!r.ok) throw new Error(json.error ?? "Failed to reset password")
          return json as { password: string }
        }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

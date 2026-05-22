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

async function mutateJson<T>(url: string, method: string, body?: unknown): Promise<T> {
  const r = await fetch(url, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body:    body ? JSON.stringify(body) : undefined,
  })
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

export function useAdminUser(id: string) {
  return useQuery<AdminUser>({
    queryKey: ["admin", "users", id],
    queryFn:  () => fetchJson<AdminUser>(`/api/admin/users/${id}`),
    enabled:  !!id,
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
      mutateJson("/api/admin/users", "POST", data),
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
      mutateJson(`/api/admin/users/${id}`, "PATCH", { role }),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "users", id] })
      toast.success("Role updated")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useAdminChangeUsername() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, username }: { id: string; username: string }) =>
      mutateJson(`/api/admin/users/${id}`, "PATCH", { username }),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "users", id] })
      toast.success("Username updated")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => mutateJson(`/api/admin/users/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] })
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })
      toast.success("User deleted")
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export function useResetUserPassword() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) =>
      mutateJson<{ password: string }>(`/api/admin/users/${id}/reset-password`, "POST"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "activities"] })
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

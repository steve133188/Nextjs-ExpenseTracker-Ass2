"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import type { ChangePasswordFormData } from "@/lib/validations"

export interface AuthUser {
  id:       string
  username: string
  role:     string
}

async function fetchCurrentUser(): Promise<AuthUser | null> {
  const res = await fetch("/api/auth/me")
  if (!res.ok) return null
  return res.json()
}

export function useAuth() {
  const queryClient = useQueryClient()

  const query = useQuery<AuthUser | null>({
    queryKey:  ["auth"],
    queryFn:   fetchCurrentUser,
    retry:     false,
    staleTime: 5 * 60 * 1000,
  })

  const logoutMutation = useMutation({
    mutationFn: () => fetch("/api/auth/logout", { method: "POST" }).then((r) => r.json()),
    onSuccess: () => {
      queryClient.clear()
      window.location.href = "/login"
    },
    onError: () => toast.error("Logout failed"),
  })

  return {
    user:      query.data   ?? null,
    isLoading: query.isLoading,
    logout:    () => logoutMutation.mutate(),
  }
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordFormData) =>
      fetch("/api/auth/me", {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(data),
      }).then(async (r) => {
        const json = await r.json()
        if (!r.ok) throw new Error(json.error ?? "Failed to change password")
        return json
      }),
    onSuccess: () => toast.success("Password changed"),
    onError:   (err: Error) => toast.error(err.message),
  })
}

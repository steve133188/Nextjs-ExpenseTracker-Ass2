"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

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

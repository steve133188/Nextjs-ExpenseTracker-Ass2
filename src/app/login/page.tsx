"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

export default function LoginPage() {
  const [tab, setTab]   = useState<"login" | "register">("login")
  const router          = useRouter()
  const queryClient     = useQueryClient()

  function handleSuccess() {
    queryClient.invalidateQueries({ queryKey: ["auth"] })
    router.push("/")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center pb-4">
          <CardTitle className="text-2xl">Expense Tracker</CardTitle>
          <CardDescription>Personal Expense Tracker</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex rounded-lg border p-1 mb-6 gap-1">
            {(["login", "register"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-1.5 text-sm rounded-md transition-colors font-medium ${
                  tab === t
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t === "login" ? "Sign in" : "Register"}
              </button>
            ))}
          </div>

          {tab === "login"
            ? <LoginForm    onSuccess={handleSuccess} />
            : <RegisterForm onSuccess={handleSuccess} />
          }
        </CardContent>
      </Card>
    </div>
  )
}

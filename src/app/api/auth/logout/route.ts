import { NextResponse } from "next/server"
import { clearCookieHeader } from "@/lib/auth"
import { logActivity } from "@/lib/activity"

export async function POST(request: Request) {
  const userId   = request.headers.get("x-user-id")
  const username = request.headers.get("x-username")

  // Always clear the cookie — never let activity logging block logout
  try {
    if (userId) logActivity(userId, "logout", `${username ?? "User"} signed out`)
  } catch {}

  return NextResponse.json(
    { success: true },
    { headers: { "Set-Cookie": clearCookieHeader() } }
  )
}

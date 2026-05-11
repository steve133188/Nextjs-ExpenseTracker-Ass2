import { NextResponse } from "next/server"
import { clearCookieHeader } from "@/lib/auth"
import { logActivity } from "@/lib/activity"

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id")
    if (userId) logActivity(userId, "logout")
    return NextResponse.json(
      { success: true },
      { headers: { "Set-Cookie": clearCookieHeader() } }
    )
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

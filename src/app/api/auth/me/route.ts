import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { logActivity } from "@/lib/activity"
import { signToken, setCookieHeader } from "@/lib/auth"

export async function GET(request: Request) {
  const userId   = request.headers.get("x-user-id")
  const username = request.headers.get("x-username")
  const role     = request.headers.get("x-user-role")
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ id: userId, username, role })
}

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8),
})

const usernameSchema = z.object({
  username: z.string().trim().min(3).max(30),
})

export async function PATCH(request: Request) {
  try {
    const userId = request.headers.get("x-user-id")!
    const role   = request.headers.get("x-user-role")!
    const body   = await request.json()

    // Username change
    if ("username" in body) {
      const result = usernameSchema.safeParse(body)
      if (!result.success) return NextResponse.json({ error: "Invalid username" }, { status: 400 })

      const taken = db.select().from(users).where(eq(users.username, result.data.username)).get()
      if (taken && taken.id !== userId) {
        return NextResponse.json({ error: "Username already taken" }, { status: 409 })
      }

      const updated = db.update(users).set({ username: result.data.username }).where(eq(users.id, userId)).returning().get()
      if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 })

      logActivity(userId, "change_username", `Username changed to ${result.data.username}`)

      // Re-issue JWT so the cookie reflects the new username
      const token = await signToken({ userId, username: updated.username, role })
      const res   = NextResponse.json({ success: true, username: updated.username })
      res.headers.set("Set-Cookie", setCookieHeader(token))
      return res
    }

    // Password change
    const result = passwordSchema.safeParse(body)
    if (!result.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

    const { currentPassword, newPassword } = result.data
    const user = db.select().from(users).where(eq(users.id, userId)).get()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })

    const same = await bcrypt.compare(newPassword, user.passwordHash)
    if (same) return NextResponse.json({ error: "New password must be different from current password" }, { status: 400 })

    const passwordHash = await bcrypt.hash(newPassword, 10)
    db.update(users).set({ passwordHash }).where(eq(users.id, userId)).run()
    logActivity(userId, "change_password", `${user.username} changed their password`)

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

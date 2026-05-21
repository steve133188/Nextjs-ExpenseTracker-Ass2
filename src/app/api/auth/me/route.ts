import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { logActivity } from "@/lib/activity"
import { z } from "zod"

export async function GET(request: Request) {
  const userId   = request.headers.get("x-user-id")
  const username = request.headers.get("x-username")
  const role     = request.headers.get("x-user-role")
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  return NextResponse.json({ id: userId, username, role })
}

const patchSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword:     z.string().min(8),
})

export async function PATCH(request: Request) {
  try {
    const userId = request.headers.get("x-user-id")!
    const body   = await request.json()
    const result = patchSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    }
    const { currentPassword, newPassword } = result.data

    const user = db.select().from(users).where(eq(users.id, userId)).get()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const valid = await bcrypt.compare(currentPassword, user.passwordHash)
    if (!valid) return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 })

    const passwordHash = await bcrypt.hash(newPassword, 10)
    db.update(users).set({ passwordHash }).where(eq(users.id, userId)).run()
    logActivity(userId, "change_password", `${user.username} changed their password`)

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

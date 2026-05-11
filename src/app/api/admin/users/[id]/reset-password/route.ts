import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { logActivity } from "@/lib/activity"
import { adminResetPasswordSchema } from "@/lib/validations"

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = request.headers.get("x-user-id")!
    const { id }  = await params
    const body    = await request.json()
    const result  = adminResetPasswordSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }

    const user = db.select().from(users).where(eq(users.id, id)).get()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const passwordHash = await bcrypt.hash(result.data.newPassword, 10)
    db.update(users).set({ passwordHash }).where(eq(users.id, id)).run()
    logActivity(adminId, "reset_password", `Admin reset password for ${user.username}`)

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { logActivity } from "@/lib/activity"

function generatePassword(length = 12): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789"
  return Array.from(crypto.getRandomValues(new Uint8Array(length)))
    .map((b) => chars[b % chars.length])
    .join("")
}

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = request.headers.get("x-user-id")!
    const { id }  = await params

    const user = db.select().from(users).where(eq(users.id, id)).get()
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    const newPassword  = generatePassword()
    const passwordHash = await bcrypt.hash(newPassword, 10)
    db.update(users).set({ passwordHash }).where(eq(users.id, id)).run()
    logActivity(adminId, "reset_password", `Admin reset password for ${user.username}`)

    return NextResponse.json({ password: newPassword })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

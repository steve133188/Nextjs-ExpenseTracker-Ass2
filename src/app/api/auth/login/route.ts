import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { signToken, setCookieHeader } from "@/lib/auth"
import { logActivity } from "@/lib/activity"
import { loginSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = loginSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 400 })
    }
    const { email, password } = result.data

    const user = db.select().from(users).where(eq(users.email, email)).get()
    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    logActivity(user.id, "login", `Signed in as ${user.username}`)
    const token = await signToken({ userId: user.id, username: user.username, role: user.role })
    return NextResponse.json(
      { id: user.id, username: user.username, email: user.email, role: user.role },
      { headers: { "Set-Cookie": setCookieHeader(token) } }
    )
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

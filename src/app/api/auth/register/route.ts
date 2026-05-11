import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { or, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { signToken, setCookieHeader } from "@/lib/auth"
import { logActivity } from "@/lib/activity"
import { registerSchema } from "@/lib/validations"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const result = registerSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    const { username, email, password } = result.data

    const existing = db.select().from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .get()
    if (existing) {
      const field = existing.email === email ? "Email" : "Username"
      return NextResponse.json({ error: `${field} already in use` }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const id = crypto.randomUUID()
    db.insert(users).values({ id, username, email, passwordHash, role: "user", createdAt: Date.now() }).run()
    logActivity(id, "register")

    const token = await signToken({ userId: id, username, role: "user" })
    return NextResponse.json(
      { id, username, email, role: "user" },
      { status: 201, headers: { "Set-Cookie": setCookieHeader(token) } }
    )
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

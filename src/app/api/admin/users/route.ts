import { NextResponse } from "next/server"
import { or, eq } from "drizzle-orm"
import bcrypt from "bcryptjs"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"
import { logActivity } from "@/lib/activity"
import { adminCreateUserSchema } from "@/lib/validations"

export async function GET() {
  try {
    const rows = db.select({
      id:        users.id,
      username:  users.username,
      email:     users.email,
      role:      users.role,
      createdAt: users.createdAt,
    }).from(users).all()
    return NextResponse.json(rows)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const adminId = request.headers.get("x-user-id")!
    const body    = await request.json()
    const result  = adminCreateUserSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    const { username, email, password, role } = result.data

    const existing = db.select().from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .get()
    if (existing) {
      const field = existing.email === email ? "Email" : "Username"
      return NextResponse.json({ error: `${field} already in use` }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const id = crypto.randomUUID()
    db.insert(users).values({ id, username, email, passwordHash, role, createdAt: Date.now() }).run()
    logActivity(adminId, "create_user", `Created account for ${username} (${role})`)

    return NextResponse.json({ id, username, email, role }, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

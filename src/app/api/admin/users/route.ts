import { NextResponse } from "next/server"
import { db } from "@/lib/db"
import { users } from "@/lib/schema"

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

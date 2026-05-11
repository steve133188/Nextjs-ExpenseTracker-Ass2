import { NextResponse } from "next/server"
import { desc, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { userActivities, users } from "@/lib/schema"

export async function GET() {
  try {
    const rows = db.select({
      id:        userActivities.id,
      username:  users.username,
      action:    userActivities.action,
      detail:    userActivities.detail,
      createdAt: userActivities.createdAt,
    })
    .from(userActivities)
    .innerJoin(users, eq(userActivities.userId, users.id))
    .orderBy(desc(userActivities.createdAt))
    .all()
    return NextResponse.json(rows)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

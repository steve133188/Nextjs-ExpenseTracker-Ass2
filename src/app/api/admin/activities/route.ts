import { NextRequest, NextResponse } from "next/server"
import { desc, eq, sql } from "drizzle-orm"
import { db } from "@/lib/db"
import { userActivities, users } from "@/lib/schema"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const limit  = Math.min(Math.max(parseInt(searchParams.get("limit")  ?? "20", 10), 1), 100)
    const offset = Math.max(parseInt(searchParams.get("offset") ?? "0",  10), 0)

    const [{ total }] = db
      .select({ total: sql<number>`count(*)` })
      .from(userActivities)
      .all()

    const rows = db
      .select({
        id:        userActivities.id,
        username:  users.username,
        action:    userActivities.action,
        detail:    userActivities.detail,
        createdAt: userActivities.createdAt,
      })
      .from(userActivities)
      .innerJoin(users, eq(userActivities.userId, users.id))
      .orderBy(desc(userActivities.createdAt))
      .limit(limit)
      .offset(offset)
      .all()

    return NextResponse.json({ rows, total })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

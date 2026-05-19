import { NextResponse } from "next/server"
import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { users, expenses, userActivities } from "@/lib/schema"
import { logActivity } from "@/lib/activity"
import { z } from "zod"

const patchSchema = z.object({ role: z.enum(["user", "admin"]) })

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = request.headers.get("x-user-id")!
    const { id }  = await params
    const body    = await request.json()
    const result  = patchSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: "role must be 'user' or 'admin'" }, { status: 400 })
    }
    const updated = db.update(users).set({ role: result.data.role }).where(eq(users.id, id)).returning().get()
    if (!updated) return NextResponse.json({ error: "User not found" }, { status: 404 })
    logActivity(adminId, "change_role", `Changed ${updated.username}'s role to ${result.data.role}`)
    return NextResponse.json({ id: updated.id, username: updated.username, role: updated.role })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const adminId = request.headers.get("x-user-id")!
    const { id }  = await params
    const target  = db.select().from(users).where(eq(users.id, id)).get()
    if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 })
    // Cascade delete: activities → expenses → user
    db.delete(userActivities).where(eq(userActivities.userId, id)).run()
    db.delete(expenses).where(eq(expenses.userId, id)).run()
    db.delete(users).where(eq(users.id, id)).run()
    logActivity(adminId, "delete_user", `Deleted account: ${target.username}`)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

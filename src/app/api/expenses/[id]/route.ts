import { NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { expenses } from "@/lib/schema"
import { expenseSchema } from "@/lib/validations"
import { logActivity } from "@/lib/activity"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = _request.headers.get("x-user-id")!
    const { id } = await params
    const row = db.select().from(expenses).where(and(eq(expenses.id, id), eq(expenses.userId, userId))).get()
    if (!row) return NextResponse.json({ error: "Expense not found" }, { status: 404 })
    return NextResponse.json(row)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = request.headers.get("x-user-id")!
    const { id } = await params
    const existing = db.select().from(expenses).where(and(eq(expenses.id, id), eq(expenses.userId, userId))).get()
    if (!existing) return NextResponse.json({ error: "Expense not found" }, { status: 404 })

    const body = await request.json()
    const result = expenseSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    const updated = db.update(expenses).set(result.data).where(eq(expenses.id, id)).returning().get()
    logActivity(userId, "update_expense", `Updated expense: ${result.data.title} ($${result.data.amount.toFixed(2)})`)
    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const userId = _request.headers.get("x-user-id")!
    const { id } = await params
    const existing = db.select().from(expenses).where(and(eq(expenses.id, id), eq(expenses.userId, userId))).get()
    if (!existing) return NextResponse.json({ error: "Expense not found" }, { status: 404 })

    db.delete(expenses).where(eq(expenses.id, id)).run()
    logActivity(userId, "delete_expense", `Deleted expense: ${existing.title} ($${existing.amount.toFixed(2)})`)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

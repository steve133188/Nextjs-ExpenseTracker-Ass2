import { NextResponse } from "next/server"
import { and, eq, inArray, gte, lte } from "drizzle-orm"
import { db } from "@/lib/db"
import { expenses } from "@/lib/schema"
import { expenseSchema, EXPENSE_CATEGORIES } from "@/lib/validations"
import { logActivity } from "@/lib/activity"

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id")!
    const { searchParams } = new URL(request.url)
    const rawCategories = searchParams.getAll("category")
    const categories    = rawCategories.filter((c): c is typeof EXPENSE_CATEGORIES[number] =>
      (EXPENSE_CATEGORIES as readonly string[]).includes(c)
    )
    const from = searchParams.get("from")
    const to   = searchParams.get("to")

    const conditions = [eq(expenses.userId, userId)]
    if (categories.length > 0) conditions.push(inArray(expenses.category, categories))
    if (from) conditions.push(gte(expenses.date, from))
    if (to)   conditions.push(lte(expenses.date, to))

    const rows = db.select().from(expenses).where(and(...conditions)).all()
    return NextResponse.json(rows)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const userId = request.headers.get("x-user-id")!
    const body = await request.json()
    const result = expenseSchema.safeParse(body)
    if (!result.success) {
      return NextResponse.json({ error: result.error.flatten() }, { status: 400 })
    }
    const newExpense = { id: crypto.randomUUID(), userId, createdAt: Date.now(), ...result.data }
    db.insert(expenses).values(newExpense).run()
    logActivity(userId, "create_expense", `Added expense: ${result.data.title} ($${result.data.amount.toFixed(2)})`)
    return NextResponse.json(newExpense, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

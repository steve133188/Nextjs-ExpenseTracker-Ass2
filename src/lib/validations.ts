import { z } from "zod"

export const EXPENSE_CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Health & Medical",
  "Housing",
  "Education",
  "Travel",
  "Other",
] as const

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

export const expenseSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100),
  amount: z
    .number({ error: "Amount must be a number" })
    .positive("Amount must be greater than 0"),
  category: z.enum(EXPENSE_CATEGORIES, { error: "Required" }),
  date: z.string().min(1, "Date is required").refine(
    (d) => d <= new Date().toISOString().slice(0, 10),
    "Date cannot be in the future"
  ),
  description: z.string().trim().max(500).optional().or(z.literal("")),
})

export type ExpenseFormData = z.infer<typeof expenseSchema>

export const loginSchema = z.object({
  email:    z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
})

export const registerSchema = z.object({
  username: z.string().trim().min(3, "Min 3 characters").max(30),
  email:    z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
})

export const adminCreateUserSchema = z.object({
  username: z.string().trim().min(3, "Min 3 characters").max(30),
  email:    z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 characters"),
  role:     z.enum(["user", "admin"]),
})

export type LoginFormData          = z.infer<typeof loginSchema>
export type RegisterFormData       = z.infer<typeof registerSchema>
export type AdminCreateUserFormData = z.infer<typeof adminCreateUserSchema>

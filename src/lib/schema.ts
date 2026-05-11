import { sqliteTable, text, real, integer } from "drizzle-orm/sqlite-core"

export const users = sqliteTable("users", {
  id:           text("id").primaryKey(),
  username:     text("username").notNull().unique(),
  email:        text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role:         text("role").notNull().default("user"),
  createdAt:    integer("created_at").notNull().$defaultFn(() => Date.now()),
})

export const userActivities = sqliteTable("user_activities", {
  id:        text("id").primaryKey(),
  userId:    text("user_id").notNull().references(() => users.id),
  action:    text("action").notNull(),
  detail:    text("detail").default(""),
  createdAt: integer("created_at").notNull().$defaultFn(() => Date.now()),
})

export const expenses = sqliteTable("expenses", {
  id:          text("id").primaryKey(),
  userId:      text("user_id").notNull().references(() => users.id),
  title:       text("title").notNull(),
  amount:      real("amount").notNull(),
  category:    text("category").notNull(),
  date:        text("date").notNull(),
  description: text("description").default(""),
  createdAt:   integer("created_at").notNull().$defaultFn(() => Date.now()),
})

export type User = typeof users.$inferSelect
export type Expense = typeof expenses.$inferSelect
export type NewExpense = typeof expenses.$inferInsert
export type UserActivity = typeof userActivities.$inferSelect

/**
 * seed-db.js
 * Run with: npm run db:seed
 */
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import bcrypt from "bcryptjs"
import { users, expenses, userActivities } from "../src/lib/schema.js"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath    = path.join(__dirname, "..", "data", "expenses.db")
const sqlite    = new Database(dbPath)
const db        = drizzle(sqlite)

db.delete(userActivities).run()
db.delete(expenses).run()
db.delete(users).run()

const NOW = Date.now()
const DAY = 24 * 60 * 60 * 1000

const adminId = crypto.randomUUID()
const demoId  = crypto.randomUUID()

db.insert(users).values({
  id:           adminId,
  username:     "root",
  email:        "root@test.com",
  passwordHash: bcrypt.hashSync("admin1234", 10),
  role:         "admin",
  createdAt:    NOW - 130 * DAY,
}).run()

db.insert(users).values({
  id:           demoId,
  username:     "demo1",
  email:        "demo1@test.com",
  passwordHash: bcrypt.hashSync("demo1234", 10),
  role:         "user",
  createdAt:    NOW - 120 * DAY,
}).run()

const SEED_DATA = [
  // March 2026
  { title: "Rent",               amount: 1800.00, category: "Housing",          date: "2026-03-01", description: "" },
  { title: "Groceries",          amount: 88.90,   category: "Food & Dining",    date: "2026-03-03", description: "Weekly grocery run" },
  { title: "Bus pass",           amount: 50.00,   category: "Transportation",   date: "2026-03-05", description: "Monthly top-up" },
  { title: "Gym membership",     amount: 59.90,   category: "Health & Medical", date: "2026-03-07", description: "" },
  { title: "Return flights",     amount: 218.00,  category: "Travel",           date: "2026-03-08", description: "Weekend trip" },
  { title: "Hotel stay",         amount: 312.00,  category: "Travel",           date: "2026-03-09", description: "3 nights" },
  { title: "Lunch",              amount: 67.50,   category: "Food & Dining",    date: "2026-03-12", description: "Office lunches" },
  { title: "Petrol",             amount: 78.20,   category: "Transportation",   date: "2026-03-15", description: "Full tank" },
  { title: "Streaming services", amount: 32.98,   category: "Entertainment",    date: "2026-03-17", description: "Spotify + Netflix" },
  { title: "Running shoes",      amount: 219.99,  category: "Shopping",         date: "2026-03-22", description: "" },
  // April 2026
  { title: "Rent",               amount: 1800.00, category: "Housing",          date: "2026-04-01", description: "" },
  { title: "Groceries",          amount: 82.40,   category: "Food & Dining",    date: "2026-04-03", description: "Weekly grocery run" },
  { title: "Bus pass",           amount: 50.00,   category: "Transportation",   date: "2026-04-04", description: "Monthly top-up" },
  { title: "Morning coffees",    amount: 27.50,   category: "Food & Dining",    date: "2026-04-07", description: "Coffee x5" },
  { title: "Gym membership",     amount: 59.90,   category: "Health & Medical", date: "2026-04-07", description: "" },
  { title: "Lunch",              amount: 54.00,   category: "Food & Dining",    date: "2026-04-10", description: "Office lunches" },
  { title: "Streaming services", amount: 32.98,   category: "Entertainment",    date: "2026-04-17", description: "Spotify + Netflix" },
  { title: "Electricity bill",   amount: 74.20,   category: "Housing",          date: "2026-04-23", description: "April utility bill" },
  { title: "Pharmacy",           amount: 38.60,   category: "Health & Medical", date: "2026-04-25", description: "Vitamins and allergy medicine" },
  { title: "Day trip",           amount: 95.00,   category: "Travel",           date: "2026-04-27", description: "Petrol and parking" },
  // May 2026
  { title: "Rent",               amount: 1800.00, category: "Housing",          date: "2026-05-01", description: "" },
  { title: "Groceries",          amount: 91.15,   category: "Food & Dining",    date: "2026-05-03", description: "Weekly grocery run" },
  { title: "Bus pass",           amount: 50.00,   category: "Transportation",   date: "2026-05-05", description: "Monthly top-up" },
  { title: "Gym membership",     amount: 59.90,   category: "Health & Medical", date: "2026-05-05", description: "" },
  { title: "Breakfast",          amount: 28.50,   category: "Food & Dining",    date: "2026-05-07", description: "Cafe breakfast" },
  { title: "Lunch",              amount: 42.00,   category: "Food & Dining",    date: "2026-05-08", description: "Office lunches" },
  { title: "Mechanical keyboard", amount: 139.00, category: "Shopping",         date: "2026-05-09", description: "" },
  { title: "Electricity bill",   amount: 66.80,   category: "Housing",          date: "2026-05-10", description: "May utility bill" },
  { title: "Streaming services", amount: 32.98,   category: "Entertainment",    date: "2026-05-11", description: "Spotify + Netflix" },
]

for (let i = 0; i < SEED_DATA.length; i++) {
  const record    = SEED_DATA[i]
  const createdAt = new Date(record.date + "T09:00:00").getTime() + i * 60_000
  db.insert(expenses).values({ id: crypto.randomUUID(), userId: demoId, createdAt, ...record }).run()
}

sqlite.close()
console.log(`✓ Seeded ${SEED_DATA.length} expenses (Jan – May 2026).`)
console.log("  root@test.com / admin1234  (admin)")
console.log("  demo1@test.com / demo1234   (user)")

/**
 * seed-db.js
 * Run with: npm run db:seed
 *
 * Accounts:
 *   alice.wong92@gmail.com  / admin1234  (admin)
 *   james.hl.lee@gmail.com  / demo1234   (user)
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
  username:     "alice",
  email:        "alice.wong92@gmail.com",
  passwordHash: bcrypt.hashSync("admin1234", 10),
  role:         "admin",
  createdAt:    NOW - 130 * DAY,
}).run()

db.insert(users).values({
  id:           demoId,
  username:     "james",
  email:        "james.hl.lee@gmail.com",
  passwordHash: bcrypt.hashSync("demo1234", 10),
  role:         "user",
  createdAt:    NOW - 120 * DAY,
}).run()

const SEED_DATA = [
  // March 2026
  { title: "Rent",                  amount: 1800.00, category: "Housing",          date: "2026-03-01", description: "" },
  { title: "Groceries",             amount: 88.90,   category: "Food & Dining",    date: "2026-03-03", description: "Woolworths" },
  { title: "Opal card top-up",      amount: 50.00,   category: "Transportation",   date: "2026-03-05", description: "" },
  { title: "Gym",                   amount: 59.90,   category: "Health & Medical", date: "2026-03-07", description: "" },
  { title: "Flights to Melbourne",  amount: 218.00,  category: "Travel",           date: "2026-03-08", description: "Jetstar return" },
  { title: "Airbnb Melbourne",      amount: 312.00,  category: "Travel",           date: "2026-03-09", description: "3 nights" },
  { title: "Lunch x5",             amount: 67.50,   category: "Food & Dining",    date: "2026-03-12", description: "Office week" },
  { title: "Petrol",                amount: 78.20,   category: "Transportation",   date: "2026-03-15", description: "Full tank" },
  { title: "Spotify + Netflix",     amount: 32.98,   category: "Entertainment",    date: "2026-03-17", description: "" },
  { title: "Nike Pegasus 41",       amount: 219.99,  category: "Shopping",         date: "2026-03-22", description: "" },
  // April 2026
  { title: "Rent",                  amount: 1800.00, category: "Housing",          date: "2026-04-01", description: "" },
  { title: "Groceries",             amount: 82.40,   category: "Food & Dining",    date: "2026-04-03", description: "Coles" },
  { title: "Opal card top-up",      amount: 50.00,   category: "Transportation",   date: "2026-04-04", description: "" },
  { title: "Flat white x5",         amount: 27.50,   category: "Food & Dining",    date: "2026-04-07", description: "Morning coffees" },
  { title: "Gym",                   amount: 59.90,   category: "Health & Medical", date: "2026-04-07", description: "" },
  { title: "Lunch x4",             amount: 54.00,   category: "Food & Dining",    date: "2026-04-10", description: "" },
  { title: "Spotify + Netflix",     amount: 32.98,   category: "Entertainment",    date: "2026-04-17", description: "" },
  { title: "Electricity",           amount: 74.20,   category: "Housing",          date: "2026-04-23", description: "Ausgrid Apr" },
  { title: "Chemist Warehouse",     amount: 38.60,   category: "Health & Medical", date: "2026-04-25", description: "Vitamins + allergy tabs" },
  { title: "Blue Mountains trip",   amount: 95.00,   category: "Travel",           date: "2026-04-27", description: "Petrol + parking" },
  // May 2026
  { title: "Rent",                  amount: 1800.00, category: "Housing",          date: "2026-05-01", description: "" },
  { title: "Groceries",             amount: 91.15,   category: "Food & Dining",    date: "2026-05-03", description: "Woolworths" },
  { title: "Opal card top-up",      amount: 50.00,   category: "Transportation",   date: "2026-05-05", description: "" },
  { title: "Gym",                   amount: 59.90,   category: "Health & Medical", date: "2026-05-05", description: "" },
  { title: "Café breakfast",        amount: 28.50,   category: "Food & Dining",    date: "2026-05-07", description: "Artificer Surry Hills" },
  { title: "Lunch x3",             amount: 42.00,   category: "Food & Dining",    date: "2026-05-08", description: "" },
  { title: "Keychron K2",           amount: 139.00,  category: "Shopping",         date: "2026-05-09", description: "" },
  { title: "Electricity",           amount: 66.80,   category: "Housing",          date: "2026-05-10", description: "Ausgrid May" },
  { title: "Spotify + Netflix",     amount: 32.98,   category: "Entertainment",    date: "2026-05-11", description: "" },
]

for (let i = 0; i < SEED_DATA.length; i++) {
  const record    = SEED_DATA[i]
  const createdAt = new Date(record.date + "T09:00:00").getTime() + i * 60_000
  db.insert(expenses).values({ id: crypto.randomUUID(), userId: demoId, createdAt, ...record }).run()
}

sqlite.close()
console.log(`✓ Seeded ${SEED_DATA.length} expenses (Jan – May 2026).`)
console.log("  alice.wong92@gmail.com / admin1234  (admin)")
console.log("  james.hl.lee@gmail.com / demo1234   (user)")

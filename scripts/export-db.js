/**
 * export-db.js
 * Exports all data from the SQLite database to a JSON file.
 * Run with: npm run db:export
 * Output: data/db-export.json
 */
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { users, expenses, userActivities } from "../src/lib/schema.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root       = path.join(__dirname, "..")
const dbPath     = path.join(root, "data", "expenses.db")
const outputPath = path.join(root, "data", "db-export.json")

if (!fs.existsSync(dbPath)) {
  console.error("No database found at data/expenses.db — run npm run dev first.")
  process.exit(1)
}

const sqlite = new Database(dbPath, { readonly: true })
const db     = drizzle(sqlite)

const allUsers      = db.select().from(users).all()
const allExpenses   = db.select().from(expenses).all()
const allActivities = db.select().from(userActivities).all()

sqlite.close()

const output = {
  exportedAt:  new Date().toISOString(),
  users:       allUsers.map(({ passwordHash: _, ...u }) => u),
  expenses:    allExpenses,
  activities:  allActivities,
}

fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8")
console.log(`✓ Exported to data/db-export.json`)
console.log(`  ${allUsers.length} users, ${allExpenses.length} expenses, ${allActivities.length} activities`)

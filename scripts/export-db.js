/**
 * export-db.js
 * Exports all expense records from the SQLite database to a JSON file.
 * Run with: npm run db:export
 * Output: data/expenses-export.json
 */
import Database from "better-sqlite3"
import { drizzle } from "drizzle-orm/better-sqlite3"
import { expenses } from "../src/lib/schema.js"
import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, "..")
const dbPath = path.join(root, "data", "expenses.db")
const outputPath = path.join(root, "data", "expenses-export.json")

if (!fs.existsSync(dbPath)) {
  console.error("No database found at data/expenses.db — run npm run dev first.")
  process.exit(1)
}

const sqlite = new Database(dbPath, { readonly: true })
const db = drizzle(sqlite)
const rows = db.select().from(expenses).all()
sqlite.close()

fs.writeFileSync(outputPath, JSON.stringify(rows, null, 2), "utf-8")
console.log(`✓ Exported ${rows.length} expense(s) to data/expenses-export.json`)

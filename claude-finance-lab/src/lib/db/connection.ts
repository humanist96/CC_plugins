import Database from "better-sqlite3"
import path from "path"

let db: Database.Database | null = null

export function getDb(): Database.Database {
  if (db) return db

  const dbPath = path.join(process.cwd(), "data", "finance-lab.db")
  db = new Database(dbPath)

  // Enable WAL mode for better concurrent read performance
  db.pragma("journal_mode = WAL")
  db.pragma("foreign_keys = ON")

  return db
}

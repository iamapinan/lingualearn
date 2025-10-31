import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import * as schema from "./schema"
import path from "path"
// Check if we're in a production environment
const isProd = process.env.NODE_ENV === "production"

// Use the DATABASE_URL from environment variables
const databaseUrl = path.join(process.cwd(), process.env.DATABASE_URL!);

// Create a singleton instance of the database
let db: ReturnType<typeof createDatabase>

function createDatabase() {
  const sqlite = new Database(databaseUrl)
  return drizzle(sqlite, { schema })
}

// Get the database instance (creates it if it doesn't exist)
export function getDb() {
  try {
    if (!db) {
      db = createDatabase()
    }
  } catch (error) {
    console.error("Error creating database", error)
  }
  return db
}

// Export the schema for use in other files
export { schema }

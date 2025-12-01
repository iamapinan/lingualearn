import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import * as schema from "./schema"

let pool: mysql.Pool | null = null
let db: ReturnType<typeof drizzle> | null = null

export async function getConnection() {
  if (pool) {
    return pool
  }

  pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lingualearn_db",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })

  return pool
}

export async function getDb() {
  if (db) {
    return db
  }

  const pool = await getConnection()
  db = drizzle(pool, { schema, mode: "default" })

  return db
}

export async function closeConnection() {
  if (pool) {
    await pool.end()
    pool = null
    db = null
  }
}


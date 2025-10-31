import { drizzle } from "drizzle-orm/mysql2"
import mysql from "mysql2/promise"
import * as schema from "./schema"

let connection: mysql.Connection | null = null
let db: ReturnType<typeof drizzle> | null = null

export async function getConnection() {
  if (connection) {
    return connection
  }

  connection = await mysql.createConnection({
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "lingualearn_db",
  })

  return connection
}

export async function getDb() {
  if (db) {
    return db
  }

  const conn = await getConnection()
  db = drizzle(conn, { schema, mode: "default" })

  return db
}

export async function closeConnection() {
  if (connection) {
    await connection.end()
    connection = null
    db = null
  }
}


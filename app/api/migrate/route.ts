import { NextResponse } from "next/server"
import { migrateDatabase } from "@/lib/db/migrate"

export async function GET() {
  try {
    await migrateDatabase()
    return NextResponse.json({ success: true, message: "Database migrated successfully" })
  } catch (error) {
    console.error("Error migrating database:", error)
    return NextResponse.json(
      { success: false, message: "Failed to migrate database", error: String(error) },
      { status: 500 },
    )
  }
}

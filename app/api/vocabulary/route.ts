import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const db = getDb()
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, message: "userId is required" }, { status: 400 })
    }

    const vocabulary = await db
      .select()
      .from(schema.vocabulary)
      .where(eq(schema.vocabulary.userId, Number.parseInt(userId)))
    return NextResponse.json(vocabulary)
  } catch (error) {
    console.error("Error fetching vocabulary:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch vocabulary", error: String(error) },
      { status: 500 },
    )
  }
}

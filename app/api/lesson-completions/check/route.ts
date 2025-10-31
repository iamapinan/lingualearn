import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq, and } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const db = await getDb()
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")
    const lessonId = searchParams.get("lessonId")

    if (!userId || !lessonId) {
      return NextResponse.json({ success: false, message: "userId and lessonId are required" }, { status: 400 })
    }

    const completion = await db
      .select()
      .from(schema.lessonCompletions)
      .where(
        and(
          eq(schema.lessonCompletions.userId, Number.parseInt(userId)),
          eq(schema.lessonCompletions.lessonId, Number.parseInt(lessonId)),
        ),
      )
      .limit(1)

    return NextResponse.json(completion.length > 0)
  } catch (error) {
    console.error("Error checking lesson completion:", error)
    return NextResponse.json(
      { success: false, message: "Failed to check lesson completion", error: String(error) },
      { status: 500 },
    )
  }
}

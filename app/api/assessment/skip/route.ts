import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "userId is required" }, { status: 400 })
    }

    // Get user
    const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1)
    if (user.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Create a basic assessment result with skipped flag
    const assessmentResult = {
      score: 0,
      level: 1,
      recommendedLessonId: 1, // Start at the beginning
      completedAt: new Date().toISOString(),
      skipped: true,
      history: [],
    }

    // Update user with skipped assessment
    await db
      .update(schema.users)
      .set({
        assessment: JSON.stringify(assessmentResult),
        recommendedStartingLesson: 1,
        totalXp: (user[0].totalXp || 0) + 10,
        totalPoints: (user[0].totalPoints || 0) + 10,
      })
      .where(eq(schema.users.id, userId))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error skipping assessment:", error)
    return NextResponse.json(
      { success: false, message: "Failed to skip assessment", error: String(error) },
      { status: 500 },
    )
  }
}

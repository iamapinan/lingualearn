import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = await getDb()
    const id = Number.parseInt(params.id)

    const lesson = await db.select().from(schema.lessons).where(eq(schema.lessons.id, id)).limit(1)

    if (lesson.length === 0) {
      // If lesson doesn't exist, create a mock one
      const languageId = 1 // Default to English
      const name = `English Basics ${id}`

      const mockLesson = {
        id,
        languageId,
        name,
        totalQuestions: 5,
        order: id,
        difficulty: 1,
        description: `Lesson ${id} for ${name}`,
      }

      // Add it to the database
      await db.insert(schema.lessons).values(mockLesson)

      return NextResponse.json(mockLesson)
    }

    return NextResponse.json(lesson[0])
  } catch (error) {
    console.error("Error fetching lesson:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch lesson", error: String(error) },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq } from "drizzle-orm"
import { getMockQuestionsForLesson } from "@/lib/mock-questions"

export async function GET(request: NextRequest) {
  try {
    const db = getDb()
    const searchParams = request.nextUrl.searchParams
    const lessonId = searchParams.get("lessonId")

    if (!lessonId) {
      return NextResponse.json({ success: false, message: "lessonId is required" }, { status: 400 })
    }

    const questions = await db
      .select()
      .from(schema.questions)
      .where(eq(schema.questions.lessonId, Number.parseInt(lessonId)))

    if (questions.length === 0) {
      // If no questions found, return mock questions
      const mockQuestions = getMockQuestionsForLesson(Number.parseInt(lessonId))

      // Add mock questions to database
      await db.insert(schema.questions).values(mockQuestions)

      return NextResponse.json(mockQuestions)
    }

    return NextResponse.json(questions)
  } catch (error) {
    console.error("Error fetching questions:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch questions", error: String(error) },
      { status: 500 },
    )
  }
}

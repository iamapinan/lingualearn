import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq, and } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    const { userId, ...result } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "userId is required" }, { status: 400 })
    }

    // Get user
    const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1)
    if (user.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    const userData = user[0]
    let leveledUp = false

    // Parse assessment data
    let assessment = null
    if (userData.assessment) {
      assessment = JSON.parse(userData.assessment as string)
    }

    // Create new assessment data
    const newAssessment = {
      ...result,
      history: [...(assessment?.history || []), result],
    }

    // Update user data
    const updateData: any = {
      assessment: JSON.stringify(newAssessment),
      recommendedStartingLesson: result.recommendedLessonId,
    }

    // Award XP if specified
    if (result.xpAwarded) {
      const oldLevel = userData.level || 1
      const totalXp = (userData.totalXp || 0) + result.xpAwarded
      const totalPoints = (userData.totalPoints || 0) + result.xpAwarded

      // Check if user should level up
      const newLevel = 1 + Math.floor(totalPoints / 1000)
      if (newLevel > oldLevel) {
        leveledUp = true
        updateData.level = newLevel
      }

      updateData.totalXp = totalXp
      updateData.totalPoints = totalPoints
    }

    // Auto-unlock lessons if specified
    if (result.autoUnlock) {
      // Get all lessons
      const lessons = await db.select().from(schema.lessons)

      // Find lessons to auto-unlock (all lessons up to recommended lesson)
      const lessonsToUnlock = lessons.filter(
        (lesson) => lesson.id < result.recommendedLessonId && lesson.languageId === 6, // English
      )

      // Mark early lessons as completed based on level
      const numLessonsToComplete = Math.min(result.level * 2, 6)
      const earlyLessons = lessonsToUnlock.slice(0, numLessonsToComplete)

      // Process each lesson
      for (const lesson of earlyLessons) {
        // Check if already completed
        const existingCompletion = await db
          .select()
          .from(schema.lessonCompletions)
          .where(and(eq(schema.lessonCompletions.userId, userId), eq(schema.lessonCompletions.lessonId, lesson.id)))
          .limit(1)

        if (existingCompletion.length === 0) {
          // Only add if not already completed
          await db.insert(schema.lessonCompletions).values({
            userId,
            lessonId: lesson.id,
            completed: true,
            completedAt: new Date().toISOString(),
            score: 100, // Perfect score for auto-completed lessons
            totalQuestions: 5,
            correctAnswers: 5,
          })
        }
      }
    }

    // Update user
    await db.update(schema.users).set(updateData).where(eq(schema.users.id, userId))

    return NextResponse.json({ success: true, leveledUp })
  } catch (error) {
    console.error("Error saving assessment result:", error)
    return NextResponse.json(
      { success: false, message: "Failed to save assessment result", error: String(error) },
      { status: 500 },
    )
  }
}

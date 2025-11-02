import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { lessonCompletions, users } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { eq, and } from "drizzle-orm"
import { updateStreak, updatePerfectLessonStreak } from "@/lib/streak-utils"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "ไม่พบ token การยืนยันตัวตน" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: "Token ไม่ถูกต้องหรือหมดอายุ" },
        { status: 401 }
      )
    }

    const db = await getDb()
    const completions = await db
      .select()
      .from(lessonCompletions)
      .where(eq(lessonCompletions.userId, payload.userId))

    return NextResponse.json({
      success: true,
      completions,
    })
  } catch (error) {
    console.error("Get lesson completions error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "ไม่พบ token การยืนยันตัวตน" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: "Token ไม่ถูกต้องหรือหมดอายุ" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { lessonId, score, totalQuestions, correctAnswers, xpEarned } = body

    if (!lessonId || score === undefined || !totalQuestions || correctAnswers === undefined) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const userId = payload.userId

    // Check if completion already exists
    const existingCompletion = await db
      .select()
      .from(lessonCompletions)
      .where(
        and(
          eq(lessonCompletions.userId, userId),
          eq(lessonCompletions.lessonId, lessonId)
        )
      )
      .limit(1)

    if (existingCompletion.length > 0) {
      // Update if new score is better
      if (score > existingCompletion[0].score) {
        await db
          .update(lessonCompletions)
          .set({
            score,
            correctAnswers,
            completedAt: new Date(),
          })
          .where(eq(lessonCompletions.id, existingCompletion[0].id))
      }

      // อัปเดต streak และ perfect lesson streak แม้จะเป็นบทเรียนเดิม
      await updateStreak(userId)
      if (score === 100) {
        await updatePerfectLessonStreak(userId, true)
      } else {
        await updatePerfectLessonStreak(userId, false)
      }
    } else {
      // Create new completion
      await db.insert(lessonCompletions).values({
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
        score,
        totalQuestions,
        correctAnswers,
      })

      // Update user's completed lessons count
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

      if (user) {
        let completedLessonsList: number[] = []
        if (user.completedLessons) {
          try {
            completedLessonsList = JSON.parse(user.completedLessons as string)
          } catch (e) {
            completedLessonsList = []
          }
        }

        if (!completedLessonsList.includes(lessonId)) {
          completedLessonsList.push(lessonId)
          await db
            .update(users)
            .set({
              lessonsCompleted: (user.lessonsCompleted || 0) + 1,
              completedLessons: JSON.stringify(completedLessonsList),
              totalXp: (user.totalXp || 0) + (xpEarned || 0),
              totalPoints: (user.totalPoints || 0) + (xpEarned || 0),
              level: Math.max(user.level || 1, 1 + Math.floor(((user.totalPoints || 0) + (xpEarned || 0)) / 1000)),
            })
            .where(eq(users.id, userId))

          // อัปเดต streak เมื่อเสร็จบทเรียน
          await updateStreak(userId)
        }

        // อัปเดต perfect lesson streak ถ้าได้คะแนน 100%
        if (score === 100) {
          await updatePerfectLessonStreak(userId, true)
        } else {
          await updatePerfectLessonStreak(userId, false)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "บันทึกข้อมูลสำเร็จ",
    })
  } catch (error) {
    console.error("Save lesson completion error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    )
  }
}

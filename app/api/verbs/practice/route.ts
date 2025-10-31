import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { verbs } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { eq } from "drizzle-orm"

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
    const { verbId, correct } = body

    if (!verbId || typeof correct !== "boolean") {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const [verb] = await db
      .select()
      .from(verbs)
      .where(eq(verbs.id, verbId))
      .limit(1)

    if (!verb) {
      return NextResponse.json(
        { error: "ไม่พบ verb" },
        { status: 404 }
      )
    }

    const now = new Date()
    let nextReviewDate = new Date(now)
    
    if (correct) {
      const daysToAdd = Math.min(30, (verb.correctCount + 1) * 2)
      nextReviewDate.setDate(nextReviewDate.getDate() + daysToAdd)
      
      await db
        .update(verbs)
        .set({
          correctCount: verb.correctCount + 1,
          lastReviewed: now,
          nextReview: nextReviewDate,
          difficulty: Math.max(1, verb.difficulty - 0.1),
        })
        .where(eq(verbs.id, verbId))
    } else {
      nextReviewDate.setDate(nextReviewDate.getDate() + 1)
      
      await db
        .update(verbs)
        .set({
          incorrectCount: verb.incorrectCount + 1,
          lastReviewed: now,
          nextReview: nextReviewDate,
          difficulty: Math.min(3, verb.difficulty + 0.2),
        })
        .where(eq(verbs.id, verbId))
    }

    const [updatedVerb] = await db
      .select()
      .from(verbs)
      .where(eq(verbs.id, verbId))
      .limit(1)

    return NextResponse.json({
      success: true,
      verb: updatedVerb,
      message: correct ? "ถูกต้อง!" : "ลองใหม่อีกครั้ง",
    })
  } catch (error) {
    console.error("Practice verb error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกผลการฝึก" },
      { status: 500 }
    )
  }
}


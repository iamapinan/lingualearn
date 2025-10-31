import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { verbs } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { eq, and, lte } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    let userId: number | null = null
    
    // Try to get user from token if provided
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const payload = verifyToken(token)
      if (payload) {
        userId = payload.userId
      }
    }

    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category")
    const difficulty = searchParams.get("difficulty")
    const languageId = searchParams.get("languageId")
    const needsReview = searchParams.get("needsReview")

    const db = await getDb()
    
    // If no user, get all verbs with userId=1 (default)
    // If user exists, get their verbs
    const targetUserId = userId || 1
    let query = db.select().from(verbs).where(eq(verbs.userId, targetUserId))

    if (category) {
      query = query.where(and(
        eq(verbs.userId, targetUserId),
        eq(verbs.category, category as "regular" | "irregular")
      ))
    }

    if (difficulty) {
      query = query.where(and(
        eq(verbs.userId, targetUserId),
        eq(verbs.difficulty, parseInt(difficulty))
      ))
    }

    if (languageId) {
      query = query.where(and(
        eq(verbs.userId, targetUserId),
        eq(verbs.languageId, parseInt(languageId))
      ))
    }

    if (needsReview === "true") {
      query = query.where(and(
        eq(verbs.userId, targetUserId),
        lte(verbs.nextReview, new Date())
      ))
    }

    const userVerbs = await query

    return NextResponse.json({
      success: true,
      verbs: userVerbs,
      total: userVerbs.length,
    })
  } catch (error) {
    console.error("Get verbs error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล verbs" },
      { status: 500 }
    )
  }
}


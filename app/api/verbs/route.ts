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
    
    // Get all verbs first (without userId filter) since they might be shared
    let conditions = []
    
    if (category) {
      conditions.push(eq(verbs.category, category as "regular" | "irregular"))
    }

    if (difficulty) {
      conditions.push(eq(verbs.difficulty, parseInt(difficulty)))
    }

    if (languageId) {
      conditions.push(eq(verbs.languageId, parseInt(languageId)))
    }

    if (needsReview === "true") {
      conditions.push(lte(verbs.nextReview, new Date()))
    }

    let userVerbs
    if (conditions.length > 0) {
      userVerbs = await db.select().from(verbs).where(and(...conditions))
    } else {
      userVerbs = await db.select().from(verbs)
    }

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


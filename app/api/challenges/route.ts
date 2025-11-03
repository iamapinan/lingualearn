import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { challenges, userChallenges } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { eq, sql } from "drizzle-orm"

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
    
    const allChallengesRaw = await db
      .select({
        id: challenges.id,
        title: challenges.title,
        description: challenges.description,
        type: challenges.type,
        xpReward: challenges.xpReward,
        requirementCount: challenges.requirementCount,
        expiresAt: challenges.expiresAt,
        progress: sql<number>`COALESCE(${userChallenges.progress}, 0)`,
        completed: sql<boolean>`COALESCE(${userChallenges.completed}, false)`,
      })
      .from(challenges)
      .leftJoin(
        userChallenges,
        sql`${challenges.id} = ${userChallenges.challengeId} AND ${userChallenges.userId} = ${payload.userId}`
      )

    // Ensure all values are properly formatted
    const allChallenges = allChallengesRaw.map((challenge) => ({
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      type: challenge.type,
      xpReward: challenge.xpReward || 0,
      requirementCount: challenge.requirementCount || 1,
      expiresAt: challenge.expiresAt,
      progress: Number(challenge.progress) || 0,
      completed: Boolean(challenge.completed),
    }))

    return NextResponse.json({
      success: true,
      challenges: allChallenges,
    })
  } catch (error) {
    console.error("Get challenges error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    )
  }
}

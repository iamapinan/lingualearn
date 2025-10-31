import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { missions, userMissions } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { eq, sql, asc } from "drizzle-orm"

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
    
    const allMissions = await db
      .select({
        id: missions.id,
        title: missions.title,
        description: missions.description,
        type: missions.type,
        requirements: missions.requirements,
        xpReward: missions.xpReward,
        pointsReward: missions.pointsReward,
        badgeId: missions.badgeId,
        expiresAt: missions.expiresAt,
        missionOrder: missions.missionOrder,
        category: missions.category,
        progress: sql<number>`COALESCE(${userMissions.progress}, 0)`,
        requirementCount: sql<number>`COALESCE(${userMissions.requirementCount}, 0)`,
        completed: sql<boolean>`COALESCE(${userMissions.completed}, false)`,
        claimed: sql<boolean>`COALESCE(${userMissions.claimed}, false)`,
      })
      .from(missions)
      .leftJoin(
        userMissions,
        sql`${missions.id} = ${userMissions.missionId} AND ${userMissions.userId} = ${payload.userId}`
      )
      .orderBy(asc(missions.missionOrder))

    return NextResponse.json({
      success: true,
      missions: allMissions,
    })
  } catch (error) {
    console.error("Get missions error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    )
  }
}


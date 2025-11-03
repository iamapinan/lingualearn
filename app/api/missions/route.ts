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
    
    // Get missions with requirementCount from userMissions or parse from requirements
    const allMissionsRaw = await db
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
        requirementCountFromUser: sql<number>`${userMissions.requirementCount}`,
        completed: sql<boolean>`COALESCE(${userMissions.completed}, false)`,
        claimed: sql<boolean>`COALESCE(${userMissions.claimed}, false)`,
      })
      .from(missions)
      .leftJoin(
        userMissions,
        sql`${missions.id} = ${userMissions.missionId} AND ${userMissions.userId} = ${payload.userId}`
      )
      .orderBy(asc(missions.missionOrder))

    // Parse requirements JSON to get requirementCount if needed
    const allMissions = allMissionsRaw.map((mission) => {
      // Try to get requirementCount from userMissions first
      let requirementCount = mission.requirementCountFromUser
      
      // If requirementCount is null or 0, try to parse from requirements JSON
      if (!requirementCount && mission.requirements) {
        try {
          const req = typeof mission.requirements === 'string' ? JSON.parse(mission.requirements) : mission.requirements
          requirementCount = req.count || req.requirementCount || 1
        } catch {
          requirementCount = 1
        }
      }
      
      // Ensure we have a valid requirementCount
      if (!requirementCount || requirementCount <= 0) {
        requirementCount = 1
      }
      
      return {
        id: mission.id,
        title: mission.title,
        description: mission.description,
        type: mission.type,
        requirements: mission.requirements,
        xpReward: Number(mission.xpReward) || 0,
        pointsReward: Number(mission.pointsReward) || 0,
        badgeId: mission.badgeId || null,
        expiresAt: mission.expiresAt,
        missionOrder: mission.missionOrder,
        category: mission.category,
        progress: Number(mission.progress) || 0,
        requirementCount: Number(requirementCount) || 1,
        completed: Boolean(mission.completed),
        claimed: Boolean(mission.claimed),
      }
    })

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


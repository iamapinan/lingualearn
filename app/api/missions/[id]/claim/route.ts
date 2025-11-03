import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq, and } from "drizzle-orm"
import { verifyToken } from "@/lib/auth/jwt"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
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
    const missionId = Number.parseInt(params.id)
    const userId = payload.userId

    // Get the mission to determine rewards
    const mission = await db.select().from(schema.missions).where(eq(schema.missions.id, missionId)).limit(1)
    if (mission.length === 0) {
      return NextResponse.json({ success: false, message: "Mission not found" }, { status: 404 })
    }

    // Get or create user mission entry
    let userMission = await db
      .select()
      .from(schema.userMissions)
      .where(and(eq(schema.userMissions.userId, userId), eq(schema.userMissions.missionId, missionId)))
      .limit(1)

    if (userMission.length === 0) {
      // Parse requirementCount from requirements if needed
      let requirementCount = 1
      if (mission[0].requirements) {
        try {
          const req = typeof mission[0].requirements === 'string' 
            ? JSON.parse(mission[0].requirements) 
            : mission[0].requirements
          requirementCount = req.count || req.requirementCount || 1
        } catch {
          requirementCount = 1
        }
      }

      // Create user mission entry if it doesn't exist
      const [newUserMission] = await db
        .insert(schema.userMissions)
        .values({
          userId,
          missionId,
          progress: requirementCount,
          requirementCount,
          completed: true,
          completedAt: new Date().toISOString(),
          claimed: true,
        })
        .returning()
      userMission = [newUserMission]
    } else {
      const userMissionData = userMission[0]

      if (!userMissionData.completed) {
        return NextResponse.json(
          { success: false, message: "Mission not completed yet" },
          { status: 400 }
        )
      }

      if (userMissionData.claimed) {
        return NextResponse.json(
          { success: false, message: "Mission reward already claimed" },
          { status: 400 }
        )
      }

      // Mark as claimed
      await db
        .update(schema.userMissions)
        .set({
          claimed: true,
        })
        .where(eq(schema.userMissions.id, userMissionData.id))
    }

    // Award XP and points to user
    const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1)
    if (user.length > 0) {
      const userData = user[0]
      const totalXp = (userData.totalXp || 0) + (mission[0].xpReward || 0)
      const totalPoints = (userData.totalPoints || 0) + (mission[0].pointsReward || 0)

      // Check if user should level up (every 100 XP = 1 level)
      const newLevel = 1 + Math.floor(totalPoints / 100)

      await db
        .update(schema.users)
        .set({
          totalXp,
          totalPoints,
          level: newLevel > userData.level ? newLevel : userData.level,
        })
        .where(eq(schema.users.id, userId))

      // Award badge if applicable
      if (mission[0].badgeId) {
        // Check if user already has this badge
        const existingBadge = await db
          .select()
          .from(schema.userBadges)
          .where(
            and(eq(schema.userBadges.userId, userId), eq(schema.userBadges.badgeId, mission[0].badgeId))
          )
          .limit(1)

        if (existingBadge.length === 0) {
          // Award badge to user
          await db.insert(schema.userBadges).values({
            userId,
            badgeId: mission[0].badgeId,
            earnedAt: new Date().toISOString(),
            displayed: true,
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error claiming mission reward:", error)
    return NextResponse.json(
      { success: false, message: "Failed to claim mission reward", error: String(error) },
      { status: 500 }
    )
  }
}


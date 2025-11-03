import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { missions, userMissions, users, userBadges, lessonCompletions } from "@/lib/db/schema"
import { eq, and } from "drizzle-orm"
import { verifyToken } from "@/lib/auth/jwt"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const resolvedParams = await params
    const db = await getDb()
    const missionId = Number.parseInt(resolvedParams.id)
    const userId = payload.userId

    // Get the mission to determine rewards
    const mission = await db.select().from(missions).where(eq(missions.id, missionId)).limit(1)
    if (mission.length === 0) {
      return NextResponse.json({ success: false, message: "Mission not found" }, { status: 404 })
    }

    // Get or create user mission entry
    let userMission = await db
      .select()
      .from(userMissions)
      .where(and(eq(userMissions.userId, userId), eq(userMissions.missionId, missionId)))
      .limit(1)

    if (userMission.length === 0) {
      // Mission progress entry doesn't exist - check actual progress
      // For lesson missions, check actual lesson completions
      const requirements = typeof mission[0].requirements === 'string' 
        ? JSON.parse(mission[0].requirements) 
        : mission[0].requirements

      if (requirements.type === "lesson") {
        const lessonCompletionsData = await db
          .select()
          .from(lessonCompletions)
          .where(eq(lessonCompletions.userId, userId))
        
        const uniqueLessons = new Set(lessonCompletionsData.map(lc => lc.lessonId))
        const actualProgress = uniqueLessons.size
        const requiredCount = requirements.count || 1

        if (actualProgress < requiredCount) {
          return NextResponse.json(
            { success: false, message: `Mission not completed. Progress: ${actualProgress}/${requiredCount}` },
            { status: 400 }
          )
        }

        // Create user mission entry with actual progress
        await db.insert(userMissions).values({
          userId,
          missionId,
          progress: Math.min(actualProgress, requiredCount),
          requirementCount: requiredCount,
          completed: true,
          completedAt: new Date().toISOString(),
          claimed: true,
        })
      } else {
        // For other mission types, require progress >= requirementCount
        return NextResponse.json(
          { success: false, message: "Mission progress not found. Please complete the mission first." },
          { status: 400 }
        )
      }
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
        .update(userMissions)
        .set({
          claimed: true,
        })
        .where(eq(userMissions.id, userMissionData.id))
    }

    // Award XP and points to user
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (user.length > 0) {
      const userData = user[0]
      const totalXp = (userData.totalXp || 0) + (mission[0].xpReward || 0)
      const totalPoints = (userData.totalPoints || 0) + (mission[0].pointsReward || 0)

      // Check if user should level up (every 100 XP = 1 level)
      const newLevel = 1 + Math.floor(totalPoints / 100)

      await db
        .update(users)
        .set({
          totalXp,
          totalPoints,
          level: newLevel > userData.level ? newLevel : userData.level,
        })
        .where(eq(users.id, userId))

      // Award badge if applicable
      if (mission[0].badgeId) {
        // Check if user already has this badge
        const existingBadge = await db
          .select()
          .from(userBadges)
          .where(
            and(eq(userBadges.userId, userId), eq(userBadges.badgeId, mission[0].badgeId))
          )
          .limit(1)

        if (existingBadge.length === 0) {
          // Award badge to user
          await db.insert(userBadges).values({
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


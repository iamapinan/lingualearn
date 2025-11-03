import { type NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { challenges, userChallenges, users, lessonCompletions } from "@/lib/db/schema"
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
    const challengeId = Number.parseInt(resolvedParams.id)
    const userId = payload.userId

    // Get the challenge to determine XP reward
    const challenge = await db.select().from(challenges).where(eq(challenges.id, challengeId)).limit(1)
    if (challenge.length === 0) {
      return NextResponse.json({ success: false, message: "Challenge not found" }, { status: 404 })
    }

    // Get user challenge entry
    const userChallenge = await db
      .select()
      .from(userChallenges)
      .where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challengeId)))
      .limit(1)

    if (userChallenge.length === 0) {
      // Check if user has enough progress to claim
      // For lesson challenge, we need to check actual lesson completions
      if (challenge[0].type === "lesson") {
        const lessonCompletionsData = await db
          .select()
          .from(lessonCompletions)
          .where(eq(lessonCompletions.userId, userId))
        
        const uniqueLessons = new Set(lessonCompletionsData.map(lc => lc.lessonId))
        const actualProgress = uniqueLessons.size

        if (actualProgress < challenge[0].requirementCount) {
          return NextResponse.json(
            { success: false, message: `Challenge not completed. Progress: ${actualProgress}/${challenge[0].requirementCount}` },
            { status: 400 }
          )
        }

        // Create user challenge entry with actual progress
        await db.insert(userChallenges).values({
          userId,
          challengeId,
          progress: Math.min(actualProgress, challenge[0].requirementCount),
          completed: true,
          completedAt: new Date().toISOString(),
        })
      } else {
        // For other challenge types, require progress >= requirementCount
        return NextResponse.json(
          { success: false, message: "Challenge progress not found. Please complete the challenge first." },
          { status: 400 }
        )
      }
    } else {
      const challengeData = userChallenge[0]

      // Check if challenge is already completed and claimed
      if (challengeData.completed) {
        return NextResponse.json(
          { success: false, message: "Reward already claimed" },
          { status: 400 }
        )
      }

      // Check if progress meets requirement
      if (challengeData.progress < challenge[0].requirementCount) {
        return NextResponse.json(
          { success: false, message: `Challenge not completed. Progress: ${challengeData.progress}/${challenge[0].requirementCount}` },
          { status: 400 }
        )
      }

      // Mark as completed
      await db
        .update(userChallenges)
        .set({
          completed: true,
          completedAt: new Date().toISOString(),
          progress: Math.min(challengeData.progress, challenge[0].requirementCount),
        })
        .where(eq(userChallenges.id, challengeData.id))
    }

    // Award XP to user
    const user = await db.select().from(users).where(eq(users.id, userId)).limit(1)
    if (user.length > 0) {
      const userData = user[0]
      const totalXp = (userData.totalXp || 0) + challenge[0].xpReward
      const totalPoints = (userData.totalPoints || 0) + challenge[0].xpReward

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
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error completing challenge:", error)
    return NextResponse.json(
      { success: false, message: "Failed to complete challenge", error: String(error) },
      { status: 500 },
    )
  }
}

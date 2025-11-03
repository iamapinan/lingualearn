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
    const challengeId = Number.parseInt(params.id)
    const userId = payload.userId

    // Get the challenge to determine XP reward
    const challenge = await db.select().from(schema.challenges).where(eq(schema.challenges.id, challengeId)).limit(1)
    if (challenge.length === 0) {
      return NextResponse.json({ success: false, message: "Challenge not found" }, { status: 404 })
    }

    // Get or create user challenge entry
    let userChallenge = await db
      .select()
      .from(schema.userChallenges)
      .where(and(eq(schema.userChallenges.userId, userId), eq(schema.userChallenges.challengeId, challengeId)))
      .limit(1)

    if (userChallenge.length === 0) {
      // Create user challenge entry if it doesn't exist
      const [newUserChallenge] = await db
        .insert(schema.userChallenges)
        .values({
          userId,
          challengeId,
          progress: challenge[0].requirementCount,
          completed: true,
          completedAt: new Date().toISOString(),
        })
        .returning()
      userChallenge = [newUserChallenge]
    } else {
      // Check if already completed
      if (userChallenge[0].completed) {
        return NextResponse.json({ success: false, message: "Challenge already completed" }, { status: 400 })
      }

      // Mark as completed
      await db
        .update(schema.userChallenges)
        .set({
          completed: true,
          completedAt: new Date().toISOString(),
          progress: challenge[0].requirementCount, // Ensure progress matches requirement
        })
        .where(eq(schema.userChallenges.id, userChallenge[0].id))
    }

    // Award XP to user
    const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1)
    if (user.length > 0) {
      const userData = user[0]
      const totalXp = (userData.totalXp || 0) + challenge[0].xpReward
      const totalPoints = (userData.totalPoints || 0) + challenge[0].xpReward

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

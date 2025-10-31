import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq, and } from "drizzle-orm"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb()
    const challengeId = Number.parseInt(params.id)
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ success: false, message: "userId is required" }, { status: 400 })
    }

    // Get the challenge to determine XP reward
    const challenge = await db.select().from(schema.challenges).where(eq(schema.challenges.id, challengeId)).limit(1)
    if (challenge.length === 0) {
      return NextResponse.json({ success: false, message: "Challenge not found" }, { status: 404 })
    }

    // Get user challenge entry
    const userChallenge = await db
      .select()
      .from(schema.userChallenges)
      .where(and(eq(schema.userChallenges.userId, userId), eq(schema.userChallenges.challengeId, challengeId)))
      .limit(1)

    if (userChallenge.length === 0) {
      return NextResponse.json({ success: false, message: "User challenge not found" }, { status: 404 })
    }

    // Mark as completed
    await db
      .update(schema.userChallenges)
      .set({
        completed: true,
        completedAt: new Date().toISOString(),
      })
      .where(eq(schema.userChallenges.id, userChallenge[0].id))

    // Award XP to user
    const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1)
    if (user.length > 0) {
      const userData = user[0]
      const totalXp = (userData.totalXp || 0) + challenge[0].xpReward
      const totalPoints = (userData.totalPoints || 0) + challenge[0].xpReward

      // Check if user should level up
      const newLevel = 1 + Math.floor(totalPoints / 1000)

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

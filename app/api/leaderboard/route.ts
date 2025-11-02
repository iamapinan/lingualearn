import { NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

export async function GET() {
  try {
    const db = await getDb()
    
    // Get all active users
    const allUsers = await db
      .select({
        id: users.id,
        name: users.name,
        totalXp: users.totalXp,
        totalPoints: users.totalPoints,
        level: users.level,
        lessonsCompleted: users.lessonsCompleted,
        streak: users.streak,
        games: users.games,
        practiceStats: users.practiceStats,
      })
      .from(users)
      .where(eq(users.isActive, true))

    // Calculate activity count for each user
    const usersWithActivity = allUsers.map((user) => {
      let activityCount = 0

      // Add lessons completed
      activityCount += user.lessonsCompleted || 0

      // Add games played
      if (user.games) {
        try {
          const games = typeof user.games === "string" ? JSON.parse(user.games) : user.games
          if (games && typeof games === "object") {
            Object.values(games).forEach((game: any) => {
              if (game && typeof game === "object" && game.timesPlayed) {
                activityCount += game.timesPlayed || 0
              }
            })
          }
        } catch (e) {
          // Ignore parse errors
          console.error("Error parsing games:", e)
        }
      }

      // Add practice sessions
      if (user.practiceStats) {
        try {
          const stats = typeof user.practiceStats === "string" ? JSON.parse(user.practiceStats) : user.practiceStats
          if (stats && typeof stats === "object") {
            activityCount += stats.listening?.completed || 0
            activityCount += stats.speaking?.completed || 0
            activityCount += stats.reading?.completed || 0
            activityCount += stats.writing?.completed || 0
          }
        } catch (e) {
          // Ignore parse errors
          console.error("Error parsing practiceStats:", e)
        }
      }

      return {
        id: user.id,
        name: user.name,
        totalXp: user.totalXp || 0,
        totalPoints: user.totalPoints || 0,
        level: user.level || 1,
        lessonsCompleted: user.lessonsCompleted || 0,
        activityCount,
        streak: user.streak || 0,
      }
    })

    // Sort by total points (XP leaderboard)
    const xpLeaderboard = [...usersWithActivity]
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, 100)

    // Sort by activity count
    const activityLeaderboard = [...usersWithActivity]
      .sort((a, b) => b.activityCount - a.activityCount)
      .slice(0, 100)

    return NextResponse.json({
      xpLeaderboard,
      activityLeaderboard,
    })
  } catch (error) {
    console.error("Error fetching leaderboard:", error)
    return NextResponse.json({ error: "Failed to fetch leaderboard" }, { status: 500 })
  }
}


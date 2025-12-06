import { NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq } from "drizzle-orm"
import { verifyToken } from "@/lib/auth/jwt"
import { updateStreak } from "@/lib/streak-utils"

export async function POST(request: NextRequest) {
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

    const body = await request.json()
    const { gameType, score, details } = body

    if (!gameType || score === undefined) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const userId = payload.userId

    // Get current user data
    const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1)
    
    if (user.length === 0) {
      return NextResponse.json(
        { error: "ไม่พบผู้ใช้งาน" },
        { status: 404 }
      )
    }

    const userData = user[0]
    
    // Parse games data
    let gamesData: any = {}
    if (userData.games) {
      try {
        gamesData = JSON.parse(userData.games as string)
      } catch (e) {
        gamesData = {}
      }
    }

    // Initialize specific game data if it doesn't exist
    if (!gamesData[gameType]) {
      gamesData[gameType] = {
        bestScore: 0,
        timesPlayed: 0,
        history: [],
      }
    }

    // Update game stats
    gamesData[gameType].timesPlayed += 1
    if (score > gamesData[gameType].bestScore) {
      gamesData[gameType].bestScore = score
    }

    // Add to history (keep last 20 entries)
    gamesData[gameType].history.push({
      score,
      details,
      timestamp: new Date().toISOString(),
    })

    if (gamesData[gameType].history.length > 20) {
      gamesData[gameType].history = gamesData[gameType].history.slice(-20)
    }

    // Calculate XP
    // Base XP: score / 10, minimum 5 XP for playing
    const xpEarned = Math.max(5, Math.floor(score / 10))
    
    const newTotalXp = (userData.totalXp || 0) + xpEarned
    const newTotalPoints = (userData.totalPoints || 0) + xpEarned
    const newLevel = 1 + Math.floor(newTotalPoints / 100)

    // Update user in database
    await db.update(schema.users).set({
      games: JSON.stringify(gamesData),
      totalXp: newTotalXp,
      totalPoints: newTotalPoints,
      level: newLevel,
      lastLoginAt: new Date(), // Update activity timestamp
    }).where(eq(schema.users.id, userId))

    // Update streak
    await updateStreak(userId)

    return NextResponse.json({
      success: true,
      xpEarned,
      newTotalXp,
      newLevel,
      newTotalPoints
    })

  } catch (error) {
    console.error("Save game result error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    )
  }
}

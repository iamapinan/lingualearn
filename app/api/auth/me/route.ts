import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { users } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { eq } from "drizzle-orm"

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
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: "ไม่พบผู้ใช้งาน" },
        { status: 404 }
      )
    }

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      totalXp: user.totalXp,
      lessonsCompleted: user.lessonsCompleted,
      level: user.level,
      totalPoints: user.totalPoints,
      streak: user.streak,
      perfectLessonStreak: user.perfectLessonStreak,
      joinedDate: user.joinedDate,
      emailVerified: user.emailVerified,
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
    })
  } catch (error) {
    console.error("Get user error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" },
      { status: 500 }
    )
  }
}


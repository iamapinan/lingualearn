import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { users } from "@/lib/db/schema"
import { hashPassword } from "@/lib/auth/hash"
import { signToken } from "@/lib/auth/jwt"
import { registerSchema } from "@/lib/auth/validation"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = registerSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ถูกต้อง", details: validation.error.errors },
        { status: 400 }
      )
    }

    const { name, email, password } = validation.data
    const db = await getDb()

    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "อีเมลนี้มีผู้ใช้งานแล้ว" },
        { status: 400 }
      )
    }

    const passwordHash = await hashPassword(password)
    const joinedDate = new Date()

    const [newUser] = await db.insert(users).values({
      name,
      email,
      passwordHash,
      totalXp: 0,
      lessonsCompleted: 0,
      level: 1,
      totalPoints: 0,
      streak: 0,
      perfectLessonStreak: 0,
      isActive: true,
      emailVerified: false,
      joinedDate,
      lastLoginAt: new Date(),
    })

    const userId = newUser.insertId

    const token = signToken({
      userId: Number(userId),
      email,
      name,
    })

    const userResponse = {
      id: Number(userId),
      name,
      email,
      totalXp: 0,
      lessonsCompleted: 0,
      level: 1,
      totalPoints: 0,
      streak: 0,
      joinedDate: joinedDate.toISOString().split('T')[0],
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลงทะเบียน" },
      { status: 500 }
    )
  }
}


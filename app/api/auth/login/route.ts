import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { users } from "@/lib/db/schema"
import { verifyPassword } from "@/lib/auth/hash"
import { signToken } from "@/lib/auth/jwt"
import { loginSchema } from "@/lib/auth/validation"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const validation = loginSchema.safeParse(body)
    if (!validation.success) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ถูกต้อง", details: validation.error.errors },
        { status: 400 }
      )
    }

    const { email, password } = validation.data
    const db = await getDb()

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)

    if (!user) {
      return NextResponse.json(
        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { error: "บัญชีนี้ถูกระงับการใช้งาน" },
        { status: 403 }
      )
    }

    const isPasswordValid = await verifyPassword(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "อีเมลหรือรหัสผ่านไม่ถูกต้อง" },
        { status: 401 }
      )
    }

    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id))

    const token = signToken({
      userId: user.id,
      email: user.email,
      name: user.name,
    })

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
      joinedDate: user.joinedDate,
    }

    return NextResponse.json({
      success: true,
      user: userResponse,
      token,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเข้าสู่ระบบ" },
      { status: 500 }
    )
  }
}


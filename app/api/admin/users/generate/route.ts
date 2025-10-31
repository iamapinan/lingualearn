import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { users } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { hashPassword } from "@/lib/auth/hash"
import { signToken } from "@/lib/auth/jwt"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const db = await getDb()
    const adminUser = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1)
    
    if (!adminUser[0] || adminUser[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const body = await request.json()
    const { count, prefix, domain, password } = body

    if (!count || !prefix || !domain || !password) {
      return NextResponse.json({ 
        error: "ต้องระบุ count, prefix, domain และ password" 
      }, { status: 400 })
    }

    if (count < 1 || count > 1000) {
      return NextResponse.json({ 
        error: "จำนวนผู้ใช้ต้องอยู่ระหว่าง 1-1000" 
      }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    const joinedDate = new Date()
    const generatedUsers = []
    const tokens = []

    for (let i = 1; i <= count; i++) {
      const email = `${prefix}${i}@${domain}`
      const name = `${prefix}${i}`

      const [newUser] = await db.insert(users).values({
        name,
        email,
        passwordHash,
        role: "user",
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

      const userId = Number(newUser.insertId)
      const userToken = signToken({
        userId,
        email,
        name,
      })

      generatedUsers.push({
        id: userId,
        name,
        email,
        role: "user",
      })

      tokens.push({
        id: userId,
        name,
        email,
        token: userToken,
      })
    }

    return NextResponse.json({
      success: true,
      message: `สร้างผู้ใช้สำเร็จ ${count} ราย`,
      users: generatedUsers,
      tokens,
    })
  } catch (error: any) {
    console.error("Generate users error:", error)
    
    if (error.code === "ER_DUP_ENTRY") {
      return NextResponse.json(
        { error: "มีอีเมลที่ซ้ำกัน กรุณาเปลี่ยน prefix หรือ domain" },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างผู้ใช้" },
      { status: 500 }
    )
  }
}


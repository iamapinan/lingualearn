import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { users } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { hashPassword } from "@/lib/auth/hash"
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
    const { name, email, password, role = "user" } = body

    if (!name || !email || !password) {
      return NextResponse.json({ error: "ต้องระบุ name, email และ password" }, { status: 400 })
    }

    // Check if email already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email)).limit(1)
    
    if (existingUser.length > 0) {
      return NextResponse.json({ error: "อีเมลนี้มีผู้ใช้งานแล้ว" }, { status: 400 })
    }

    const passwordHash = await hashPassword(password)
    const joinedDate = new Date()

    const [newUser] = await db.insert(users).values({
      name,
      email,
      passwordHash,
      role: role as "user" | "admin",
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

    return NextResponse.json({
      success: true,
      message: "สร้างผู้ใช้สำเร็จ",
      userId: Number(newUser.insertId),
    })
  } catch (error) {
    console.error("Create user error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการสร้างผู้ใช้" },
      { status: 500 }
    )
  }
}


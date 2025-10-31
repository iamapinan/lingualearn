import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { users } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
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

    const allUsers = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      totalXp: users.totalXp,
      lessonsCompleted: users.lessonsCompleted,
      level: users.level,
      totalPoints: users.totalPoints,
      isActive: users.isActive,
      emailVerified: users.emailVerified,
      joinedDate: users.joinedDate,
      lastLoginAt: users.lastLoginAt,
      createdAt: users.createdAt,
    }).from(users)

    return NextResponse.json({
      success: true,
      users: allUsers,
    })
  } catch (error) {
    console.error("Get users error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลผู้ใช้" },
      { status: 500 }
    )
  }
}

export async function PATCH(request: NextRequest) {
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
    const { userId, updates } = body

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    await db.update(users)
      .set(updates)
      .where(eq(users.id, userId))

    return NextResponse.json({
      success: true,
      message: "อัพเดทผู้ใช้สำเร็จ",
    })
  } catch (error) {
    console.error("Update user error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัพเดทผู้ใช้" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    if (parseInt(userId) === payload.userId) {
      return NextResponse.json({ error: "ไม่สามารถลบตัวเองได้" }, { status: 400 })
    }

    await db.delete(users).where(eq(users.id, parseInt(userId)))

    return NextResponse.json({
      success: true,
      message: "ลบผู้ใช้สำเร็จ",
    })
  } catch (error) {
    console.error("Delete user error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการลบผู้ใช้" },
      { status: 500 }
    )
  }
}


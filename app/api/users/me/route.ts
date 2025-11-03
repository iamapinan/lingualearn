import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { users } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { eq } from "drizzle-orm"

export async function PATCH(request: NextRequest) {
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
    const { name, avatar } = body

    const db = await getDb()
    
    // กำหนดค่าที่จะอัปเดต
    const updateData: any = {}
    
    // อัปเดตชื่อถ้ามีการส่งมา
    if (name !== undefined) {
      if (!name || name.trim().length === 0) {
        return NextResponse.json(
          { error: "กรุณาระบุชื่อ" },
          { status: 400 }
        )
      }

      if (name.trim().length < 2) {
        return NextResponse.json(
          { error: "ชื่อต้องมีอย่างน้อย 2 ตัวอักษร" },
          { status: 400 }
        )
      }

      // ตรวจสอบว่ามีชื่อซ้ำหรือไม่ (ยกเว้นผู้ใช้คนเดียวกัน)
      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.name, name.trim()))
        .limit(1)

      if (existingUser.length > 0 && existingUser[0].id !== payload.userId) {
        return NextResponse.json(
          { error: "ชื่อนี้ถูกใช้งานแล้ว" },
          { status: 409 }
        )
      }

      updateData.name = name.trim()
    }
    
    // อัปเดต avatar ถ้ามีการส่งมา
    if (avatar !== undefined) {
      updateData.avatar = avatar
    }

    // ถ้าไม่มีข้อมูลที่จะอัปเดต
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "ไม่มีข้อมูลที่จะอัปเดต" },
        { status: 400 }
      )
    }

    // อัปเดตข้อมูลผู้ใช้
    await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, payload.userId))

    // ดึงข้อมูลผู้ใช้ที่อัปเดตแล้ว
    const [updatedUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, payload.userId))
      .limit(1)

    if (!updatedUser) {
      return NextResponse.json(
        { error: "ไม่พบผู้ใช้งาน" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatar: updatedUser.avatar,
        totalXp: updatedUser.totalXp,
        lessonsCompleted: updatedUser.lessonsCompleted,
        level: updatedUser.level,
        totalPoints: updatedUser.totalPoints,
        streak: updatedUser.streak,
        perfectLessonStreak: updatedUser.perfectLessonStreak,
        joinedDate: updatedUser.joinedDate instanceof Date 
          ? updatedUser.joinedDate.toISOString().split('T')[0] 
          : updatedUser.joinedDate,
        emailVerified: updatedUser.emailVerified,
      },
    })
  } catch (error) {
    console.error("Update user name error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัปเดตชื่อ" },
      { status: 500 }
    )
  }
}


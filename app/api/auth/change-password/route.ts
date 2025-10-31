import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { users } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { hashPassword, verifyPassword } from "@/lib/auth/hash"
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

    const body = await request.json()
    const { oldPassword, newPassword } = body

    if (!oldPassword || !newPassword) {
      return NextResponse.json({ 
        error: "ต้องระบุ oldPassword และ newPassword" 
      }, { status: 400 })
    }

    if (newPassword.length < 4) {
      return NextResponse.json({ 
        error: "รหัสผ่านใหม่ต้องมีอย่างน้อย 4 ตัวอักษร" 
      }, { status: 400 })
    }

    const db = await getDb()
    
    const [user] = await db.select({
      id: users.id,
      passwordHash: users.passwordHash,
    }).from(users).where(eq(users.id, payload.userId)).limit(1)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isOldPasswordValid = await verifyPassword(oldPassword, user.passwordHash)
    if (!isOldPasswordValid) {
      return NextResponse.json(
        { error: "รหัสผ่านเดิมไม่ถูกต้อง" },
        { status: 401 }
      )
    }

    const newPasswordHash = await hashPassword(newPassword)

    await db.update(users)
      .set({ passwordHash: newPasswordHash })
      .where(eq(users.id, payload.userId))

    return NextResponse.json({
      success: true,
      message: "เปลี่ยนรหัสผ่านสำเร็จ",
    })
  } catch (error) {
    console.error("Change password error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน" },
      { status: 500 }
    )
  }
}


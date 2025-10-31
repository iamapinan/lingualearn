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
    const { userId, newPassword } = body

    if (!userId || !newPassword) {
      return NextResponse.json({ 
        error: "ต้องระบุ userId และ newPassword" 
      }, { status: 400 })
    }

    if (newPassword.length < 4) {
      return NextResponse.json({ 
        error: "รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร" 
      }, { status: 400 })
    }

    const passwordHash = await hashPassword(newPassword)

    await db.update(users)
      .set({ passwordHash })
      .where(eq(users.id, userId))

    return NextResponse.json({
      success: true,
      message: "รีเซ็ตรหัสผ่านสำเร็จ",
    })
  } catch (error) {
    console.error("Reset password error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการรีเซ็ตรหัสผ่าน" },
      { status: 500 }
    )
  }
}


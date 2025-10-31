import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { lessonCompletions } from "@/lib/db/schema"
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
    const completions = await db
      .select()
      .from(lessonCompletions)
      .where(eq(lessonCompletions.userId, payload.userId))

    return NextResponse.json({
      success: true,
      completions,
    })
  } catch (error) {
    console.error("Get lesson completions error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    )
  }
}

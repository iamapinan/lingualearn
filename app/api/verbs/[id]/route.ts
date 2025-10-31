import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { verbs } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { eq, and } from "drizzle-orm"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const verbId = parseInt(params.id)
    const db = await getDb()

    const [verb] = await db
      .select()
      .from(verbs)
      .where(and(
        eq(verbs.id, verbId),
        eq(verbs.userId, payload.userId)
      ))
      .limit(1)

    if (!verb) {
      return NextResponse.json(
        { error: "ไม่พบ verb" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      verb,
    })
  } catch (error) {
    console.error("Get verb error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล verb" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const verbId = parseInt(params.id)
    const body = await request.json()
    const db = await getDb()

    const [existingVerb] = await db
      .select()
      .from(verbs)
      .where(and(
        eq(verbs.id, verbId),
        eq(verbs.userId, payload.userId)
      ))
      .limit(1)

    if (!existingVerb) {
      return NextResponse.json(
        { error: "ไม่พบ verb" },
        { status: 404 }
      )
    }

    await db
      .update(verbs)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(verbs.id, verbId))

    const [updatedVerb] = await db
      .select()
      .from(verbs)
      .where(eq(verbs.id, verbId))
      .limit(1)

    return NextResponse.json({
      success: true,
      verb: updatedVerb,
    })
  } catch (error) {
    console.error("Update verb error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการอัพเดท verb" },
      { status: 500 }
    )
  }
}


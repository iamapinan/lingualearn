import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { languages } from "@/lib/db/schema"

export async function GET(request: NextRequest) {
  try {
    const db = await getDb()
    const allLanguages = await db.select().from(languages)

    return NextResponse.json({
      success: true,
      languages: allLanguages,
    })
  } catch (error) {
    console.error("Get languages error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลภาษา" },
      { status: 500 }
    )
  }
}

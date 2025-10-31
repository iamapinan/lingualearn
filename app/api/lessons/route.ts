import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { lessons } from "@/lib/db/schema"
import { eq, asc } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const languageId = searchParams.get("languageId")

    const db = await getDb()
    
    let query = db.select().from(lessons).orderBy(asc(lessons.lessonOrder))
    
    if (languageId) {
      query = query.where(eq(lessons.languageId, parseInt(languageId)))
    }

    const allLessons = await query

    return NextResponse.json({
      success: true,
      lessons: allLessons,
    })
  } catch (error) {
    console.error("Get lessons error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูลบทเรียน" },
      { status: 500 }
    )
  }
}

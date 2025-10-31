import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { verbs } from "@/lib/db/schema"
import { sql } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const db = await getDb()
    
    // Get all verbs without filtering
    const allVerbs = await db.select().from(verbs)
    
    // Count by userId
    const userIdCounts = await db
      .select({
        userId: verbs.userId,
        count: sql<number>`COUNT(*)`,
      })
      .from(verbs)
      .groupBy(verbs.userId)
    
    // Count by category
    const categoryCounts = await db
      .select({
        category: verbs.category,
        count: sql<number>`COUNT(*)`,
      })
      .from(verbs)
      .groupBy(verbs.category)

    return NextResponse.json({
      success: true,
      totalVerbs: allVerbs.length,
      userIdCounts,
      categoryCounts,
      sampleVerbs: allVerbs.slice(0, 5),
    })
  } catch (error: any) {
    console.error("Debug verbs error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message,
        stack: error.stack,
      },
      { status: 500 }
    )
  }
}


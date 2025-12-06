import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { verbs } from "@/lib/db/schema"
import { allVerbs } from "@/lib/db/data/verbs-data"
import { eq } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const db = await getDb()
    
    // Check if verbs already exist
    const existingVerbs = await db.select().from(verbs).limit(1)
    const force = request.nextUrl.searchParams.get("force") === "true"
    
    if (existingVerbs.length > 0 && !force) {
      return NextResponse.json({
        success: false,
        message: "Verbs already exist in database. Use ?force=true to overwrite.",
        count: existingVerbs.length,
      })
    }

    if (force) {
      await db.delete(verbs)
    }

    // Insert all verbs
    const now = new Date()
    const nextReview = new Date(now)
    nextReview.setDate(nextReview.getDate() + 1)

    let insertedCount = 0
    
    for (const verb of allVerbs) {
      try {
        await db.insert(verbs).values({
          userId: 1, // Default user
          baseForm: verb.baseForm,
          pastSimple: verb.pastSimple,
          pastParticiple: verb.pastParticiple,
          translation: verb.translation,
          category: verb.category,
          languageId: 1, // English
          languageCode: "en",
          difficulty: verb.difficulty,
          exampleSentence: verb.exampleSentence,
          lastReviewed: now,
          nextReview: nextReview,
          correctCount: 0,
          incorrectCount: 0,
        })
        insertedCount++
      } catch (error) {
        console.error(`Error inserting verb ${verb.baseForm}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${insertedCount} verbs`,
      total: allVerbs.length,
      inserted: insertedCount,
    })
  } catch (error) {
    console.error("Seed verbs error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "เกิดข้อผิดพลาดในการเพิ่มข้อมูล verbs",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}

// GET to check status
export async function GET(request: NextRequest) {
  try {
    const db = await getDb()
    const allVerbsInDb = await db.select().from(verbs)
    
    // Count by category and difficulty
    const stats = {
      total: allVerbsInDb.length,
      byCategory: {
        regular: allVerbsInDb.filter(v => v.category === "regular").length,
        irregular: allVerbsInDb.filter(v => v.category === "irregular").length,
      },
      byDifficulty: {
        easy: allVerbsInDb.filter(v => v.difficulty === 1).length,
        medium: allVerbsInDb.filter(v => v.difficulty === 2).length,
        hard: allVerbsInDb.filter(v => v.difficulty === 3).length,
      }
    }

    return NextResponse.json({
      success: true,
      stats,
      verbs: allVerbsInDb.slice(0, 5), // Show first 5 verbs
    })
  } catch (error) {
    console.error("Get verbs stats error:", error)
    return NextResponse.json(
      { 
        success: false,
        error: "เกิดข้อผิดพลาดในการดึงข้อมูล",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    )
  }
}


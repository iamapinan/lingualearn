import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const db = getDb()
    const users = await db.select().from(schema.users)
    return NextResponse.json(users)
  } catch (error) {
    console.error("Error fetching users:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb()
    const data = await request.json()

    // Validate required fields
    if (!data.name) {
      return NextResponse.json({ success: false, message: "Name is required" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.name, data.name)).limit(1)
    if (existingUser.length > 0) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 409 })
    }

    // Create new user
    const newUser = {
      name: data.name,
      totalXp: 0,
      lessonsCompleted: 0,
      joinedDate: new Date().toISOString().split("T")[0],
      level: 1,
      totalPoints: 0,
      speakingPractice: JSON.stringify({
        totalPracticed: 0,
        correctCount: 0,
        averageScore: 0,
        history: [],
      }),
      games: JSON.stringify({}),
    }

    const result = await db.insert(schema.users).values(newUser).returning()
    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error creating user:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create user", error: String(error) },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    const db = await getDb()
    const name = params.name

    const user = await db.select().from(schema.users).where(eq(schema.users.name, name)).limit(1)

    if (user.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Parse JSON fields
    const userData = user[0]
    if (userData.speakingPractice) userData.speakingPractice = JSON.parse(userData.speakingPractice as string)
    if (userData.games) userData.games = JSON.parse(userData.games as string)
    if (userData.assessment) userData.assessment = JSON.parse(userData.assessment as string)
    if (userData.practiceStats) userData.practiceStats = JSON.parse(userData.practiceStats as string)
    if (userData.studyTimes) userData.studyTimes = JSON.parse(userData.studyTimes as string)
    if (userData.completedLessons) userData.completedLessons = JSON.parse(userData.completedLessons as string)
    if (userData.timedWriting) userData.timedWriting = JSON.parse(userData.timedWriting as string)

    // Convert Date objects to strings for JSON serialization
    const serializedUserData = {
      ...userData,
      joinedDate: userData.joinedDate instanceof Date 
        ? userData.joinedDate.toISOString().split('T')[0] 
        : userData.joinedDate,
      lastLoginAt: userData.lastLoginAt instanceof Date 
        ? userData.lastLoginAt.toISOString() 
        : userData.lastLoginAt,
      createdAt: userData.createdAt instanceof Date 
        ? userData.createdAt.toISOString() 
        : userData.createdAt,
      updatedAt: userData.updatedAt instanceof Date 
        ? userData.updatedAt.toISOString() 
        : userData.updatedAt,
    }

    return NextResponse.json(serializedUserData)
  } catch (error) {
    console.error("Error fetching user:", error)
    return NextResponse.json({ success: false, message: "Failed to fetch user", error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { name: string } }) {
  try {
    const db = await getDb()
    const name = params.name
    const data = await request.json()

    // Check if user exists
    const existingUser = await db.select().from(schema.users).where(eq(schema.users.name, name)).limit(1)
    if (existingUser.length === 0) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 })
    }

    // Prepare data for update
    const updateData: any = { ...data }

    // Convert complex objects to JSON strings
    if (updateData.speakingPractice) updateData.speakingPractice = JSON.stringify(updateData.speakingPractice)
    if (updateData.games) updateData.games = JSON.stringify(updateData.games)
    if (updateData.assessment) updateData.assessment = JSON.stringify(updateData.assessment)
    if (updateData.practiceStats) updateData.practiceStats = JSON.stringify(updateData.practiceStats)
    if (updateData.studyTimes) updateData.studyTimes = JSON.stringify(updateData.studyTimes)
    if (updateData.completedLessons) updateData.completedLessons = JSON.stringify(updateData.completedLessons)
    if (updateData.timedWriting) updateData.timedWriting = JSON.stringify(updateData.timedWriting)

    // Update user
    await db.update(schema.users).set(updateData).where(eq(schema.users.name, name))

    // Get updated user
    const updatedUser = await db.select().from(schema.users).where(eq(schema.users.name, name)).limit(1)

    // Parse JSON fields for response
    const userData = updatedUser[0]
    if (userData.speakingPractice) userData.speakingPractice = JSON.parse(userData.speakingPractice as string)
    if (userData.games) userData.games = JSON.parse(userData.games as string)
    if (userData.assessment) userData.assessment = JSON.parse(userData.assessment as string)
    if (userData.practiceStats) userData.practiceStats = JSON.parse(userData.practiceStats as string)
    if (userData.studyTimes) userData.studyTimes = JSON.parse(userData.studyTimes as string)
    if (userData.completedLessons) userData.completedLessons = JSON.parse(userData.completedLessons as string)
    if (userData.timedWriting) userData.timedWriting = JSON.parse(userData.timedWriting as string)

    // Convert Date objects to strings for JSON serialization
    const serializedUserData = {
      ...userData,
      joinedDate: userData.joinedDate instanceof Date 
        ? userData.joinedDate.toISOString().split('T')[0] 
        : userData.joinedDate,
      lastLoginAt: userData.lastLoginAt instanceof Date 
        ? userData.lastLoginAt.toISOString() 
        : userData.lastLoginAt,
      createdAt: userData.createdAt instanceof Date 
        ? userData.createdAt.toISOString() 
        : userData.createdAt,
      updatedAt: userData.updatedAt instanceof Date 
        ? userData.updatedAt.toISOString() 
        : userData.updatedAt,
    }

    return NextResponse.json(serializedUserData)
  } catch (error) {
    console.error("Error updating user:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update user", error: String(error) },
      { status: 500 },
    )
  }
}

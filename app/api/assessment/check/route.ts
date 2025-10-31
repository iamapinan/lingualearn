import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const db = getDb()
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ success: false, message: "userId is required" }, { status: 400 })
    }

    const user = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, Number.parseInt(userId)))
      .limit(1)
    if (user.length === 0) {
      return NextResponse.json(false)
    }

    const userData = user[0]

    if (!userData.assessment) {
      return NextResponse.json(false)
    }

    // Parse assessment data
    const assessment = JSON.parse(userData.assessment as string)

    // Check if assessment exists and either it's completed normally or was skipped
    const isCompleted = !!assessment
    const isSkipped = assessment.skipped === true

    return NextResponse.json(isCompleted || isSkipped)
  } catch (error) {
    console.error("Error checking assessment completion:", error)
    return NextResponse.json(
      { success: false, message: "Failed to check assessment completion", error: String(error) },
      { status: 500 },
    )
  }
}

import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq } from "drizzle-orm"

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const db = getDb()
    const id = Number.parseInt(params.id)
    const data = await request.json()

    // Check if vocabulary item exists
    const vocabItem = await db.select().from(schema.vocabulary).where(eq(schema.vocabulary.id, id)).limit(1)
    if (vocabItem.length === 0) {
      return NextResponse.json({ success: false, message: "Vocabulary item not found" }, { status: 404 })
    }

    // Update vocabulary item
    await db.update(schema.vocabulary).set(data).where(eq(schema.vocabulary.id, id))

    // Get updated item
    const updatedItem = await db.select().from(schema.vocabulary).where(eq(schema.vocabulary.id, id)).limit(1)

    return NextResponse.json(updatedItem[0])
  } catch (error) {
    console.error("Error updating vocabulary item:", error)
    return NextResponse.json(
      { success: false, message: "Failed to update vocabulary item", error: String(error) },
      { status: 500 },
    )
  }
}

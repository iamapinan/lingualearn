import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { users } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { eq, like, and, or } from "drizzle-orm"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)
    
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    const db = await getDb()
    const adminUser = await db.select().from(users).where(eq(users.id, payload.userId)).limit(1)
    
    if (!adminUser[0] || adminUser[0].role !== "admin") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || ""
    const roleFilter = searchParams.get("role")
    const statusFilter = searchParams.get("status")

    const conditions = []

    if (search) {
      conditions.push(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`)
        )
      )
    }

    if (roleFilter) {
      conditions.push(eq(users.role, roleFilter))
    }

    if (statusFilter !== null && statusFilter !== undefined) {
      const isActive = statusFilter === "true"
      conditions.push(eq(users.isActive, isActive))
    }

    let allUsers
    if (conditions.length > 0) {
      allUsers = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        totalXp: users.totalXp,
        lessonsCompleted: users.lessonsCompleted,
        level: users.level,
        totalPoints: users.totalPoints,
        streak: users.streak,
        isActive: users.isActive,
        emailVerified: users.emailVerified,
        joinedDate: users.joinedDate,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      }).from(users).where(and(...conditions))
    } else {
      allUsers = await db.select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        totalXp: users.totalXp,
        lessonsCompleted: users.lessonsCompleted,
        level: users.level,
        totalPoints: users.totalPoints,
        streak: users.streak,
        isActive: users.isActive,
        emailVerified: users.emailVerified,
        joinedDate: users.joinedDate,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      }).from(users)
    }

    const csvHeaders = [
      "ID",
      "ชื่อ",
      "อีเมล",
      "Role",
      "Level",
      "XP",
      "Lessons Completed",
      "Points",
      "Streak",
      "สถานะ",
      "อีเมลยืนยันแล้ว",
      "วันที่เข้าร่วม",
      "เข้าสู่ระบบล่าสุด",
      "วันที่สร้าง",
    ]

    const csvRows = allUsers.map((user) => [
      user.id,
      user.name,
      user.email,
      user.role || "user",
      user.level,
      user.totalXp,
      user.lessonsCompleted,
      user.totalPoints,
      user.streak || 0,
      user.isActive ? "Active" : "Inactive",
      user.emailVerified ? "Yes" : "No",
      user.joinedDate ? new Date(user.joinedDate).toLocaleString("th-TH") : "",
      user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString("th-TH") : "",
      user.createdAt ? new Date(user.createdAt).toLocaleString("th-TH") : "",
    ])

    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n")

    const csvBuffer = Buffer.from("\uFEFF" + csvContent, "utf-8")

    return new NextResponse(csvBuffer, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="users-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    })
  } catch (error) {
    console.error("Export users error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการส่งออกข้อมูลผู้ใช้" },
      { status: 500 }
    )
  }
}


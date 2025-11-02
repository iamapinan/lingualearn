import { getDb } from "@/lib/db/connection"
import { users } from "@/lib/db/schema"
import { eq } from "drizzle-orm"

/**
 * อัปเดต streak ของผู้ใช้ตามวันที่ใช้งาน
 * - ถ้าเป็นวันเดียวกัน → ไม่ต้องเพิ่ม streak
 * - ถ้าเป็นวันถัดไป (ต่อเนื่อง) → เพิ่ม streak +1
 * - ถ้าเว้นไปเกิน 1 วัน → รีเซ็ต streak เป็น 0 และเริ่มใหม่ที่ 1
 */
export async function updateStreak(userId: number): Promise<{ streak: number; wasUpdated: boolean }> {
  try {
    const db = await getDb()
    
    // ดึงข้อมูลผู้ใช้
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      return { streak: 0, wasUpdated: false }
    }

    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    
    // ตรวจสอบวันที่ใช้งานล่าสุด
    let lastStudyDate: Date | null = null
    if (user.lastLoginAt) {
      lastStudyDate = new Date(user.lastLoginAt)
    }

    let currentStreak = user.streak || 0
    let wasUpdated = false

    if (!lastStudyDate) {
      // ถ้ายังไม่เคยใช้งาน → เริ่ม streak ที่ 1
      currentStreak = 1
      wasUpdated = true
    } else {
      const lastStudyDay = new Date(
        lastStudyDate.getFullYear(),
        lastStudyDate.getMonth(),
        lastStudyDate.getDate()
      )

      // คำนวณความแตกต่างของวัน
      const daysDiff = Math.floor((today.getTime() - lastStudyDay.getTime()) / (1000 * 60 * 60 * 24))

      if (daysDiff === 0) {
        // วันเดียวกัน → ไม่ต้องอัปเดต streak
        wasUpdated = false
      } else if (daysDiff === 1) {
        // วันถัดไป → เพิ่ม streak
        currentStreak = currentStreak + 1
        wasUpdated = true
      } else {
        // เว้นไปเกิน 1 วัน → รีเซ็ต streak และเริ่มใหม่ที่ 1
        currentStreak = 1
        wasUpdated = true
      }
    }

    // อัปเดต streak และ lastLoginAt
    await db
      .update(users)
      .set({
        streak: currentStreak,
        lastLoginAt: now,
      })
      .where(eq(users.id, userId))

    return { streak: currentStreak, wasUpdated }
  } catch (error) {
    console.error("Error updating streak:", error)
    return { streak: 0, wasUpdated: false }
  }
}

/**
 * อัปเดต perfect lesson streak เมื่อผู้ใช้ได้คะแนน 100%
 */
export async function updatePerfectLessonStreak(
  userId: number,
  isPerfect: boolean
): Promise<{ perfectStreak: number }> {
  try {
    const db = await getDb()
    
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1)

    if (!user) {
      return { perfectStreak: 0 }
    }

    let perfectStreak = user.perfectLessonStreak || 0

    if (isPerfect) {
      // เพิ่ม perfect streak
      perfectStreak = perfectStreak + 1
    } else {
      // รีเซ็ต perfect streak เป็น 0
      perfectStreak = 0
    }

    await db
      .update(users)
      .set({
        perfectLessonStreak: perfectStreak,
      })
      .where(eq(users.id, userId))

    return { perfectStreak }
  } catch (error) {
    console.error("Error updating perfect lesson streak:", error)
    return { perfectStreak: 0 }
  }
}


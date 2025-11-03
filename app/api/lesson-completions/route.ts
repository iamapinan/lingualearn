import { NextRequest, NextResponse } from "next/server"
import { getDb } from "@/lib/db/connection"
import { lessonCompletions, users, challenges, userChallenges, missions, userMissions } from "@/lib/db/schema"
import { verifyToken } from "@/lib/auth/jwt"
import { eq, and } from "drizzle-orm"
import { updateStreak, updatePerfectLessonStreak } from "@/lib/streak-utils"

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "ไม่พบ token การยืนยันตัวตน" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: "Token ไม่ถูกต้องหรือหมดอายุ" },
        { status: 401 }
      )
    }

    const db = await getDb()
    const completions = await db
      .select()
      .from(lessonCompletions)
      .where(eq(lessonCompletions.userId, payload.userId))

    return NextResponse.json({
      success: true,
      completions,
    })
  } catch (error) {
    console.error("Get lesson completions error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการดึงข้อมูล" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "ไม่พบ token การยืนยันตัวตน" },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)
    const payload = verifyToken(token)

    if (!payload) {
      return NextResponse.json(
        { error: "Token ไม่ถูกต้องหรือหมดอายุ" },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { lessonId, score, totalQuestions, correctAnswers, xpEarned } = body

    if (!lessonId || score === undefined || !totalQuestions || correctAnswers === undefined) {
      return NextResponse.json(
        { error: "ข้อมูลไม่ครบถ้วน" },
        { status: 400 }
      )
    }

    const db = await getDb()
    const userId = payload.userId

    // Check if completion already exists
    const existingCompletion = await db
      .select()
      .from(lessonCompletions)
      .where(
        and(
          eq(lessonCompletions.userId, userId),
          eq(lessonCompletions.lessonId, lessonId)
        )
      )
      .limit(1)

    if (existingCompletion.length > 0) {
      // Update if new score is better
      if (score > existingCompletion[0].score) {
        await db
          .update(lessonCompletions)
          .set({
            score,
            correctAnswers,
            completedAt: new Date(),
          })
          .where(eq(lessonCompletions.id, existingCompletion[0].id))
      }

      // อัปเดต streak และ perfect lesson streak แม้จะเป็นบทเรียนเดิม
      await updateStreak(userId)
      if (score === 100) {
        await updatePerfectLessonStreak(userId, true)
      } else {
        await updatePerfectLessonStreak(userId, false)
      }
    } else {
      // Create new completion
      await db.insert(lessonCompletions).values({
        userId,
        lessonId,
        completed: true,
        completedAt: new Date(),
        score,
        totalQuestions,
        correctAnswers,
      })

      // Update user's completed lessons count
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1)

      if (user) {
        let completedLessonsList: number[] = []
        if (user.completedLessons) {
          try {
            completedLessonsList = JSON.parse(user.completedLessons as string)
          } catch (e) {
            completedLessonsList = []
          }
        }

        if (!completedLessonsList.includes(lessonId)) {
          completedLessonsList.push(lessonId)
          const newTotalXp = (user.totalXp || 0) + (xpEarned || 0)
          const newTotalPoints = (user.totalPoints || 0) + (xpEarned || 0)
          
          await db
            .update(users)
            .set({
              lessonsCompleted: (user.lessonsCompleted || 0) + 1,
              completedLessons: JSON.stringify(completedLessonsList),
              totalXp: newTotalXp,
              totalPoints: newTotalPoints,
              level: Math.max(user.level || 1, 1 + Math.floor(newTotalPoints / 100)),
            })
            .where(eq(users.id, userId))

          // อัปเดต streak เมื่อเสร็จบทเรียน
          await updateStreak(userId)

          // อัปเดต challenge progress สำหรับ challenge ประเภท "lesson"
          await updateChallengeProgress(userId, "lesson", 1)

          // อัปเดต mission progress สำหรับ mission ประเภท "lesson"
          await updateMissionProgress(userId, "lesson", 1)
        }

        // อัปเดต perfect lesson streak ถ้าได้คะแนน 100%
        if (score === 100) {
          await updatePerfectLessonStreak(userId, true)
          // อัปเดต challenge progress สำหรับ "Perfect Score" challenge
          await updateChallengeProgress(userId, "perfect_score", 1)
        } else {
          await updatePerfectLessonStreak(userId, false)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "บันทึกข้อมูลสำเร็จ",
    })
  } catch (error) {
    console.error("Save lesson completion error:", error)
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" },
      { status: 500 }
    )
  }
}

async function updateChallengeProgress(userId: number, challengeType: string, amount: number) {
  const db = await getDb()

  // Get challenges of the specified type
  const challengeList = await db.select().from(challenges).where(eq(challenges.type, challengeType))

  for (const challenge of challengeList) {
    // Get user's progress on this challenge
    const userChallenge = await db
      .select()
      .from(userChallenges)
      .where(and(eq(userChallenges.userId, userId), eq(userChallenges.challengeId, challenge.id)))
      .limit(1)

    if (userChallenge.length > 0) {
      // Update existing progress
      const challengeData = userChallenge[0]
      if (!challengeData.completed) {
        const newProgress = challengeData.progress + amount
        const completed = newProgress >= challenge.requirementCount

        await db
          .update(userChallenges)
          .set({
            progress: newProgress,
            completed,
            completedAt: completed ? new Date().toISOString() : challengeData.completedAt,
          })
          .where(eq(userChallenges.id, challengeData.id))
      }
    } else {
      // Create new progress entry
      const completed = amount >= challenge.requirementCount
      await db.insert(userChallenges).values({
        userId,
        challengeId: challenge.id,
        progress: amount,
        completed,
        completedAt: completed ? new Date().toISOString() : null,
      })
    }
  }
}

async function updateMissionProgress(userId: number, missionType: string, amount: number) {
  const db = await getDb()

  // Get missions that match the type
  const missionList = await db.select().from(missions)
  const relevantMissions = missionList.filter((mission) => {
    try {
      const requirements = JSON.parse(mission.requirements as string)
      return requirements.type === missionType
    } catch (e) {
      return false
    }
  })

  for (const mission of relevantMissions) {
    // Get user's progress on this mission
    const userMission = await db
      .select()
      .from(userMissions)
      .where(and(eq(userMissions.userId, userId), eq(userMissions.missionId, mission.id)))
      .limit(1)

    const requirements = JSON.parse(mission.requirements as string)

    if (userMission.length > 0) {
      // Update existing progress
      const missionData = userMission[0]
      if (!missionData.completed) {
        const newProgress = missionData.progress + amount
        const completed = newProgress >= requirements.count

        await db
          .update(userMissions)
          .set({
            progress: newProgress,
            completed,
            completedAt: completed ? new Date().toISOString() : missionData.completedAt,
          })
          .where(eq(userMissions.id, missionData.id))
      }
    } else {
      // Create new progress entry
      const completed = amount >= requirements.count

      await db.insert(userMissions).values({
        userId,
        missionId: mission.id,
        progress: amount,
        requirementCount: requirements.count,
        completed,
        completedAt: completed ? new Date().toISOString() : null,
        claimed: false,
      })
    }
  }
}

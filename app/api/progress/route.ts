import { type NextRequest, NextResponse } from "next/server"
import { getDb, schema } from "@/lib/db"
import { eq, and } from "drizzle-orm"

export async function POST(request: NextRequest) {
  try {
    const db = getDb()
    const data = await request.json()

    // Validate required fields
    if (
      !data.userId ||
      !data.lessonId ||
      !data.questionId ||
      data.completed === undefined ||
      data.correct === undefined
    ) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    // Add timestamp if not provided
    if (!data.timestamp) {
      data.timestamp = new Date().toISOString()
    }

    // Save progress
    const result = await db.insert(schema.userProgress).values(data).returning()

    // Update user XP and lessons completed
    if (data.correct === 1) {
      await updateUserXP(data.userId, data.lessonId, 10)

      // If answer was correct, add to vocabulary
      await addToVocabulary(data.userId, data.lessonId, data.questionId)

      // Update challenge progress
      await updateChallengeProgress(data.userId, "xp", 10)
      await updateMissionProgress(data.userId, "correct_answers", 1)
    }

    // Update challenge progress for lesson
    await updateChallengeProgress(data.userId, "lesson", 1)

    return NextResponse.json(result[0], { status: 201 })
  } catch (error) {
    console.error("Error saving progress:", error)
    return NextResponse.json(
      { success: false, message: "Failed to save progress", error: String(error) },
      { status: 500 },
    )
  }
}

async function updateUserXP(userId: number, lessonId: number, xpEarned: number) {
  const db = getDb()

  // Get user
  const user = await db.select().from(schema.users).where(eq(schema.users.id, userId)).limit(1)
  if (user.length === 0) return

  const userData = user[0]

  // Parse completedLessons
  let completedLessons: number[] = []
  if (userData.completedLessons) {
    completedLessons = JSON.parse(userData.completedLessons as string)
  }

  // Check if this is a new lesson completion
  const isNewLesson = !completedLessons.includes(lessonId)

  // Update user data
  const totalXp = (userData.totalXp || 0) + xpEarned
  const totalPoints = (userData.totalPoints || 0) + xpEarned

  // Calculate new level
  const newLevel = 1 + Math.floor(totalPoints / 1000)

  // Update user
  const updateData: any = {
    totalXp,
    totalPoints,
    level: newLevel,
  }

  if (isNewLesson) {
    const lessonsCompleted = (userData.lessonsCompleted || 0) + 1
    completedLessons.push(lessonId)

    updateData.lessonsCompleted = lessonsCompleted
    updateData.completedLessons = JSON.stringify(completedLessons)

    // Update mission progress for completing a lesson
    await updateMissionProgress(userId, "lesson", 1)
  }

  await db.update(schema.users).set(updateData).where(eq(schema.users.id, userId))
}

async function addToVocabulary(userId: number, lessonId: number, questionId: number) {
  const db = getDb()

  // Get the question
  const question = await db.select().from(schema.questions).where(eq(schema.questions.id, questionId)).limit(1)
  if (question.length === 0) return

  const questionData = question[0]

  // Only add vocabulary for certain question types
  if (!["multiple-choice", "translation"].includes(questionData.type)) return

  // Get the lesson to determine language
  const lesson = await db.select().from(schema.lessons).where(eq(schema.lessons.id, lessonId)).limit(1)
  if (lesson.length === 0) return

  const lessonData = lesson[0]
  const languageId = lessonData.languageId

  // Get language code
  const language = await db.select().from(schema.languages).where(eq(schema.languages.id, languageId)).limit(1)
  if (language.length === 0) return

  const languageData = language[0]

  // Determine word and translation based on question type
  let word, translation

  if (questionData.type === "multiple-choice") {
    // For multiple choice, the correct answer is the word
    word = questionData.correctAnswer
    translation = questionData.prompt.replace("What is '", "").replace("' in English?", "")
  } else if (questionData.type === "translation") {
    // For translation, the prompt contains the word to translate
    word = questionData.prompt.replace("Translate: '", "").replace("'", "")
    translation = questionData.correctAnswer
  } else {
    return
  }

  // Check if this vocabulary item already exists
  const existingVocab = await db
    .select()
    .from(schema.vocabulary)
    .where(
      and(
        eq(schema.vocabulary.userId, userId),
        eq(schema.vocabulary.word, word),
        eq(schema.vocabulary.languageId, languageId),
      ),
    )
    .limit(1)

  if (existingVocab.length > 0) {
    // Update existing item
    const vocabItem = existingVocab[0]
    const correctCount = vocabItem.correctCount + 1
    const difficulty = Math.max(1, vocabItem.difficulty - 0.1)
    const lastReviewed = new Date().toISOString()

    // Calculate next review date
    const nextReview = new Date()
    nextReview.setDate(nextReview.getDate() + Math.ceil(difficulty))

    await db
      .update(schema.vocabulary)
      .set({
        correctCount,
        difficulty,
        lastReviewed,
        nextReview: nextReview.toISOString(),
      })
      .where(eq(schema.vocabulary.id, vocabItem.id))
  } else {
    // Add new vocabulary item
    await db.insert(schema.vocabulary).values({
      userId,
      word,
      translation,
      languageId,
      languageCode: languageData.code,
      difficulty: 3, // Medium difficulty to start
      lastReviewed: new Date().toISOString(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Review tomorrow
      correctCount: 1,
      incorrectCount: 0,
    })

    // Update mission progress for vocabulary
    await updateMissionProgress(userId, "vocabulary", 1)
  }
}

async function updateChallengeProgress(userId: number, challengeType: string, amount: number) {
  const db = getDb()

  // Get challenges of the specified type
  const challenges = await db.select().from(schema.challenges).where(eq(schema.challenges.type, challengeType))

  for (const challenge of challenges) {
    // Get user's progress on this challenge
    const userChallenge = await db
      .select()
      .from(schema.userChallenges)
      .where(and(eq(schema.userChallenges.userId, userId), eq(schema.userChallenges.challengeId, challenge.id)))
      .limit(1)

    if (userChallenge.length > 0) {
      // Update existing progress
      const challengeData = userChallenge[0]
      if (!challengeData.completed) {
        await db
          .update(schema.userChallenges)
          .set({ progress: challengeData.progress + amount })
          .where(eq(schema.userChallenges.id, challengeData.id))
      }
    } else {
      // Create new progress entry
      await db.insert(schema.userChallenges).values({
        userId,
        challengeId: challenge.id,
        progress: amount,
        completed: false,
        completedAt: null,
      })
    }
  }
}

async function updateMissionProgress(userId: number, missionType: string, amount: number) {
  const db = getDb()

  // Get missions that match the type
  const missions = await db.select().from(schema.missions)
  const relevantMissions = missions.filter((mission) => {
    try {
      const requirements = JSON.parse(mission.requirements)
      return requirements.type === missionType
    } catch (e) {
      return false
    }
  })

  for (const mission of relevantMissions) {
    // Get user's progress on this mission
    const userMission = await db
      .select()
      .from(schema.userMissions)
      .where(and(eq(schema.userMissions.userId, userId), eq(schema.userMissions.missionId, mission.id)))
      .limit(1)

    const requirements = JSON.parse(mission.requirements)

    if (userMission.length > 0) {
      // Update existing progress
      const missionData = userMission[0]
      if (!missionData.completed) {
        const newProgress = missionData.progress + amount
        const completed = newProgress >= requirements.count

        await db
          .update(schema.userMissions)
          .set({
            progress: newProgress,
            completed,
            completedAt: completed ? new Date().toISOString() : missionData.completedAt,
          })
          .where(eq(schema.userMissions.id, missionData.id))
      }
    } else {
      // Create new progress entry
      const completed = amount >= requirements.count

      await db.insert(schema.userMissions).values({
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

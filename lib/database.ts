// We'll use IndexedDB for storage
import { languages } from "./db/data/languages-data"
import { englishLessons, englishQuestions } from "./db/data/english-lessons-data"
import { missions, badges } from "./db/data/missions-data"
import { challenges } from "./db/data/challenges-data"
import { vocabulary, VocabularyItem } from "./db/data/vocabulary-data"
import type * as Types from "./database-types"
import { achievements } from "./db/data/achievements-data"

const DB_NAME = "lingualearn_db"
const DB_VERSION = 8 // Increased version to ensure indexes are created

// Types for our data models
// แก้ไขการใช้ interface ให้ import จาก database-types
// เปลี่ยนจาก interface UserStats { ... } เป็น import { UserStats } from './database-types';
// ทำแบบนี้กับทุก interface
interface UserStats {
  id: number
  totalXp: number
  lessonsCompleted: number
  joinedDate: string
  level: number // Added for gamification
  totalPoints: number // Added for gamification
}

interface User {
  id: number
  name: string
  totalXp: number
  lessonsCompleted: number
  joinedDate: string
  level: number // Added for gamification
  totalPoints: number // Added for gamification
  speakingPractice?: {
    totalPracticed: number
    correctCount: number
    averageScore: number
    history: {
      word: string
      correct: boolean
      score: number
      timestamp: string
    }[]
  }
  games?: {
    [gameId: string]: {
      bestScore: number
      timesPlayed: number
      history: {
        score: number
        details: any
        timestamp: string
      }[]
    }
  }
  assessment?: {
    score: number
    level: number
    recommendedLessonId: number
    completedAt: string
    history: AssessmentResult[]
  }
  recommendedStartingLesson?: number
  practiceStats?: {
    listening?: {
      completed: number
      correctCount: number
      history: any[]
    }
    speaking?: {
      completed: number
      correctCount: number
      history: any[]
    }
    reading?: {
      completed: number
      correctCount: number
      history: any[]
    }
    writing?: {
      completed: number
      correctCount: number
      history: any[]
    }
  }
  studyTimes?: {
    afterMidnight?: boolean
    before6am?: boolean
    weekend?: boolean
  }
  streak?: number
  perfectLessonStreak?: number
  completedLessons?: number[]
  timedWriting?: {
    totalCompleted: number
    successfulCompleted: number
    bestTime: number | null
    totalTime: number
    history: {
      challengeId: number
      wordCount: number
      timeTaken: number
      isSuccessful: boolean
      xpEarned: number
      pointsEarned: number
      specialReward?: {
        type: string
        value: string | number
      }
      date: string
      content: string
    }[]
  }
}

// New interface for missions
interface Mission {
  id: number
  title: string
  description: string
  type: string // daily, weekly, achievement, etc.
  requirements: string // JSON string of requirements
  xpReward: number
  pointsReward: number
  badgeId?: number // Optional badge reward
  expiresAt?: string // Optional expiration date
  order: number // For ordering missions
  category: string // For grouping missions
}

// New interface for user mission progress
interface UserMission {
  id?: number
  userId: number
  missionId: number
  progress: number
  requirementCount: number
  completed: boolean
  completedAt: string | null
  claimed: boolean // Whether the reward has been claimed
}

// New interface for badges
interface Badge {
  id: number
  name: string
  description: string
  icon: string
  category: string
  rarity: string // common, uncommon, rare, epic, legendary
}

// New interface for user badges
interface UserBadge {
  id?: number
  userId: number
  badgeId: number
  earnedAt: string
  displayed: boolean // Whether the badge is displayed on profile
}

interface Language {
  id: number
  name: string
  code: string
  icon: string
}

interface Lesson {
  id: number
  languageId: number
  name: string
  totalQuestions: number
  order: number
  difficulty: number
  description: string
}

interface Question {
  id: number
  lessonId: number
  type: string
  prompt: string
  options: string
  correctAnswer: string
  audioUrl?: string // For listening exercises
  imageUrl?: string // For image-based exercises
}

interface UserProgress {
  id?: number
  userId?: number
  lessonId: number
  questionId: number
  completed: number
  correct: number
  timestamp: string
}

interface LessonCompletion {
  id?: number
  userId: number
  lessonId: number
  completed: boolean
  completedAt: string
  score: number
  totalQuestions: number
  correctAnswers: number
}

interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  requirement: string
  xpReward?: number
  pointsReward?: number
}

interface UserAchievement {
  id?: number
  userId: number
  achievementId: number
  unlocked: boolean
  unlockedAt: string | null
  claimed: boolean
}

interface Challenge {
  id: number
  title: string
  description: string
  type: string
  xpReward: number
  requirementCount: number
  expiresAt: string
}

interface UserChallenge {
  id?: number
  userId: number
  challengeId: number
  progress: number
  completed: boolean
  completedAt: string | null
}

// Database initialization
let dbPromise: Promise<IDBDatabase> | null = null

export function initializeDatabase(): Promise<IDBDatabase> {
  if (!dbPromise) {
    dbPromise = new Promise((resolve, reject) => {
      if (!window.indexedDB) {
        reject("IndexedDB not supported")
        return
      }

      const request = window.indexedDB.open(DB_NAME, DB_VERSION)

      request.onerror = (event) => {
        console.error("Error opening database:", event)
        reject("Error opening database")
      }

      request.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        resolve(db)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        const oldVersion = event.oldVersion
        const transaction = (event.target as IDBOpenDBRequest).transaction

        // Create object stores (tables) if they don't exist
        if (oldVersion < 1) {
          // Create initial schema
          if (!db.objectStoreNames.contains("users")) {
            const usersStore = db.createObjectStore("users", { keyPath: "id", autoIncrement: true })
            usersStore.createIndex("name", "name", { unique: true })
          }

          if (!db.objectStoreNames.contains("user_stats")) {
            const userStatsStore = db.createObjectStore("user_stats", { keyPath: "id" })
          }

          if (!db.objectStoreNames.contains("languages")) {
            const languagesStore = db.createObjectStore("languages", { keyPath: "id" })
          }

          if (!db.objectStoreNames.contains("lessons")) {
            const lessonsStore = db.createObjectStore("lessons", { keyPath: "id" })
            lessonsStore.createIndex("languageId", "languageId", { unique: false })
          }

          if (!db.objectStoreNames.contains("questions")) {
            const questionsStore = db.createObjectStore("questions", { keyPath: "id" })
            questionsStore.createIndex("lessonId", "lessonId", { unique: false })
          }

          if (!db.objectStoreNames.contains("user_progress")) {
            const userProgressStore = db.createObjectStore("user_progress", { keyPath: "id", autoIncrement: true })
            userProgressStore.createIndex("lessonId", "lessonId", { unique: false })
            userProgressStore.createIndex("questionId", "questionId", { unique: false })
          }

          if (!db.objectStoreNames.contains("achievements")) {
            const achievementsStore = db.createObjectStore("achievements", { keyPath: "id" })
          }

          if (!db.objectStoreNames.contains("user_achievements")) {
            const userAchievementsStore = db.createObjectStore("user_achievements", {
              keyPath: "id",
              autoIncrement: true,
            })
            userAchievementsStore.createIndex("achievementId", "achievementId", { unique: false })
          }
        }

        // Add vocabulary store in version 2
        if (oldVersion < 2) {
          if (!db.objectStoreNames.contains("vocabulary")) {
            const vocabularyStore = db.createObjectStore("vocabulary", { keyPath: "id", autoIncrement: true })
            vocabularyStore.createIndex("userId", "userId", { unique: false })
            vocabularyStore.createIndex("languageId", "languageId", { unique: false })
          }
        }

        // Add challenges store in version 3
        if (oldVersion < 3) {
          if (!db.objectStoreNames.contains("challenges")) {
            const challengesStore = db.createObjectStore("challenges", { keyPath: "id", autoIncrement: true })
          }

          if (!db.objectStoreNames.contains("user_challenges")) {
            const userChallengesStore = db.createObjectStore("user_challenges", { keyPath: "id", autoIncrement: true })
            userChallengesStore.createIndex("userId", "userId", { unique: false })
            userChallengesStore.createIndex("challengeId", "challengeId", { unique: false })
            userChallengesStore.createIndex("userId_challengeId", ["userId", "challengeId"], { unique: true })
          }
        }

        // Add additional English lessons in version 4
        if (oldVersion < 4) {
          // Update lessons schema if needed
          if (db.objectStoreNames.contains("lessons")) {
            const lessonsStore = transaction!.objectStore("lessons")

            // Check if we need to add new columns to existing lessons
            lessonsStore.openCursor().onsuccess = (e) => {
              const cursor = (e.target as IDBRequest).result
              if (cursor) {
                const lesson = cursor.value
                if (lesson.order === undefined) {
                  lesson.order = lesson.id
                }
                if (lesson.difficulty === undefined) {
                  lesson.difficulty = 1
                }
                if (lesson.description === undefined) {
                  lesson.description = `Lesson ${lesson.id} for ${lesson.name}`
                }
                cursor.update(lesson)
                cursor.continue()
              }
            }
          }
        }

        // Add lesson completion tracking in version 5
        if (oldVersion < 5) {
          if (!db.objectStoreNames.contains("lesson_completions")) {
            const lessonCompletionsStore = db.createObjectStore("lesson_completions", {
              keyPath: "id",
              autoIncrement: true,
            })
            lessonCompletionsStore.createIndex("userId", "userId", { unique: false })
            lessonCompletionsStore.createIndex("lessonId", "lessonId", { unique: false })
            lessonCompletionsStore.createIndex("userId_lessonId", ["userId", "lessonId"], { unique: true })
          }
        }

        // Add missions and badges in version 6
        if (oldVersion < 6) {
          // Default badges
          if (!db.objectStoreNames.contains("missions")) {
            const missionsStore = db.createObjectStore("missions", { keyPath: "id", autoIncrement: true })
            missionsStore.createIndex("type", "type", { unique: false })
            missionsStore.createIndex("category", "category", { unique: false })
          }

          // Add user missions store
          if (!db.objectStoreNames.contains("user_missions")) {
            const userMissionsStore = db.createObjectStore("user_missions", { keyPath: "id", autoIncrement: true })
            userMissionsStore.createIndex("userId", "userId", { unique: false })
            userMissionsStore.createIndex("missionId", "missionId", { unique: false })
            userMissionsStore.createIndex("userId_missionId", ["userId", "missionId"], { unique: true })
          }

          // Add badges store
          if (!db.objectStoreNames.contains("badges")) {
            const badgesStore = db.createObjectStore("badges", { keyPath: "id", autoIncrement: true })
            badgesStore.createIndex("category", "category", { unique: false })
            badgesStore.createIndex("rarity", "rarity", { unique: false })
          }

          // Add user badges store
          if (!db.objectStoreNames.contains("user_badges")) {
            const userBadgesStore = db.createObjectStore("user_badges", { keyPath: "id", autoIncrement: true })
            userBadgesStore.createIndex("userId", "userId", { unique: false })
            userBadgesStore.createIndex("badgeId", "badgeId", { unique: false })
            userBadgesStore.createIndex("userId_badgeId", ["userId", "badgeId"], { unique: true })
          }

          // Update user and user_stats to include level and points
          if (db.objectStoreNames.contains("users")) {
            const usersStore = transaction!.objectStore("users")
            usersStore.openCursor().onsuccess = (e) => {
              const cursor = (e.target as IDBRequest).result
              if (cursor) {
                const user = cursor.value
                if (user.level === undefined) {
                  user.level = 1
                }
                if (user.totalPoints === undefined) {
                  user.totalPoints = user.totalXp || 0
                }
                cursor.update(user)
                cursor.continue()
              }
            }
          }

          if (db.objectStoreNames.contains("user_stats")) {
            const userStatsStore = transaction!.objectStore("user_stats")
            userStatsStore.openCursor().onsuccess = (e) => {
              const cursor = (e.target as IDBRequest).result
              if (cursor) {
                const stats = cursor.value
                if (stats.level === undefined) {
                  stats.level = 1
                }
                if (stats.totalPoints === undefined) {
                  stats.totalPoints = stats.totalXp || 0
                }
                cursor.update(stats)
                cursor.continue()
              }
            }
          }
        }

        // Add English-Thai vocabulary in version 7
        if (oldVersion < 7) {
          // Clear existing vocabulary and add new English-Thai vocabulary
          if (db.objectStoreNames.contains("vocabulary")) {
            const vocabularyStore = transaction!.objectStore("vocabulary")

            // Clear existing vocabulary
            vocabularyStore.clear()

            // Add new English-Thai vocabulary
            // We'll add these in initializeDefaultData
          }
        }

        // Ensure all required indexes exist on user_achievements
        if (db.objectStoreNames.contains("user_achievements")) {
          const userAchievementsStore = transaction!.objectStore("user_achievements")

          // Check if the userId_achievementId index exists
          if (!Array.from(userAchievementsStore.indexNames).includes("userId_achievementId")) {
            console.log("Creating missing userId_achievementId index during version change")
            userAchievementsStore.createIndex("userId_achievementId", ["userId", "achievementId"], { unique: true })
          }

          // Check if the userId index exists
          if (!Array.from(userAchievementsStore.indexNames).includes("userId")) {
            console.log("Creating missing userId index during version change")
            userAchievementsStore.createIndex("userId", "userId", { unique: false })
          }
        }

        // Initialize with default data
        initializeDefaultData(db, transaction!, oldVersion)
      }
    })
  }

  return dbPromise
}

// Add this new function to check if required indexes exist
export async function ensureDatabaseIndexes(): Promise<void> {
  try {
    const db = await initializeDatabase()

    // We can check if indexes exist, but we cannot create them outside of a version change transaction
    // Just log which indexes are missing for debugging purposes
    const transaction = db.transaction(["user_achievements"], "readonly")
    const userAchievementsStore = transaction!.objectStore("user_achievements")

    const indexNames = Array.from(userAchievementsStore.indexNames)

    if (!indexNames.includes("userId_achievementId")) {
      console.log("Missing index: userId_achievementId - This will be created in the next DB version upgrade")
    }

    if (!indexNames.includes("userId")) {
      console.log("Missing index: userId - This will be created in the next DB version upgrade")
    }

    // Return a resolved promise - we can't fix missing indexes here
    return Promise.resolve()
  } catch (error) {
    console.error("Error in ensureDatabaseIndexes:", error)
    // Return a resolved promise to prevent blocking
    return Promise.resolve()
  }
}

// Initialize default data
// ในฟังก์ชัน initializeDefaultData ให้ใช้ข้อมูลจากไฟล์ที่แยกออกมา
async function initializeDefaultData(db: IDBDatabase, transaction: IDBTransaction, oldVersion: number) {
  // Default languages
  const languagesStore = transaction!.objectStore("languages")
  languages.forEach((language) => {
    languagesStore.add(language)
  })


  const achievementsStore = transaction.objectStore("achievements")
  achievements.forEach((achievement) => {
    achievementsStore.add(achievement)
  })

  // Default user stats
  const userStats: Types.UserStats = {
    id: 1,
    totalXp: 120,
    lessonsCompleted: 8,
    joinedDate: new Date().toISOString().split("T")[0],
    level: 1,
    totalPoints: 120,
  }

  const userStatsStore = transaction!.objectStore("user_stats")
  userStatsStore.add(userStats)

  // Add English lessons and questions if upgrading to version 4
  if (oldVersion < 4) {
    const lessonsStore = transaction!.objectStore("lessons")
    const questionsStore = transaction!.objectStore("questions")

    // Add English lessons
    englishLessons.forEach((lesson) => {
      lessonsStore.add(lesson)
    })

    // Add all questions to the database
    englishQuestions.forEach((question) => {
      questionsStore.add(question)
    })
  }

 
  const vocabularyStore = transaction!.objectStore("vocabulary")

  // Add English-Thai vocabulary
  vocabulary.forEach((item, index) => {
    const vocabItem = {
      userId: 1,
      word: item.word,
      translation: item.translation,
      languageId: 1, // English
      languageCode: "en",
      difficulty: item.difficulty, // Medium difficulty to start
      lastReviewed: new Date().toISOString(),
      nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // tomorrow
      correctCount: 0,
      incorrectCount: 0,
    }
    vocabularyStore.add(vocabItem)
  })
  

  // Add default challenges if upgrading to version 3 or higher
  if (oldVersion < 3) {
    const challengesStore = transaction!.objectStore("challenges")
    challenges.forEach((challenge) => {
      challengesStore.add(challenge)
    })
  }

  // Add default missions and badges if upgrading to version 6
  if (oldVersion < 6) {
    // Default badges
    if (db.objectStoreNames.contains("badges")) {
      const badgesStore = transaction!.objectStore("badges")
      badges.forEach((badge) => {
        badgesStore.add(badge)
      })
    }

    // Default missions
    if (db.objectStoreNames.contains("missions")) {
      const missionsStore = transaction!.objectStore("missions")
      missions.forEach((mission) => {
        missionsStore.add(mission)
      })
    }
  }
}

// Mission-related functions
export async function getMissions(
  userId: number,
): Promise<(Mission & { progress: number; completed: boolean; claimed: boolean })[]> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["missions", "user_missions"], "readonly")
      const missionsStore = transaction!.objectStore("missions")
      const userMissionsStore = transaction!.objectStore("user_missions")
      const userMissionsIndex = userMissionsStore.index("userId")

      // Get all missions
      const missionsRequest = missionsStore.getAll()

      missionsRequest.onsuccess = () => {
        const missions = missionsRequest.result || []

        // Get user's progress on missions
        const userMissionsRequest = userMissionsIndex.getAll(userId)

        userMissionsRequest.onsuccess = () => {
          const userMissions = userMissionsRequest.result || []

          // Combine mission data with user progress
          const combinedMissions = missions.map((mission) => {
            const userMission = userMissions.find((um) => um.missionId === mission.id)
            const requirements = JSON.parse(mission.requirements)

            return {
              ...mission,
              progress: userMission ? userMission.progress : 0,
              requirementCount: requirements.count,
              completed: userMission ? userMission.completed : false,
              claimed: userMission ? userMission.claimed : false,
            }
          })

          // Sort by category and order
          combinedMissions.sort((a, b) => {
            if (a.category !== b.category) {
              return a.category.localeCompare(b.category)
            }
            return a.order - b.order
          })

          resolve(combinedMissions)
        }

        userMissionsRequest.onerror = () => {
          reject("Error getting user missions")
        }
      }

      missionsRequest.onerror = () => {
        reject("Error getting missions")
      }
    })
  } catch (error) {
    console.error("Error in getMissions:", error)
    return []
  }
}

export async function updateMissionProgress(userId: number, missionType: string, amount = 1): Promise<void> {
  try {
    const db = await initializeDatabase()
    const transaction = db.transaction(["missions", "user_missions"], "readwrite")
    const missionsStore = transaction!.objectStore("missions")
    const userMissionsStore = transaction!.objectStore("user_missions")

    // Get missions that match the type
    const missionsRequest = missionsStore.getAll()

    missionsRequest.onsuccess = () => {
      const missions = missionsRequest.result || []
      const relevantMissions = missions.filter((mission) => {
        const requirements = JSON.parse(mission.requirements)
        return requirements.type === missionType
      })

      relevantMissions.forEach((mission) => {
        // Get user's progress on this mission
        const userMissionIndex = userMissionsStore.index("userId_missionId")
        const userMissionRequest = userMissionIndex.get([userId, mission.id])

        userMissionRequest.onsuccess = () => {
          const userMission = userMissionRequest.result
          const requirements = JSON.parse(mission.requirements)

          if (userMission) {
            // Update existing progress
            if (!userMission.completed) {
              userMission.progress += amount

              // Check if mission is completed
              if (userMission.progress >= requirements.count) {
                userMission.completed = true
                userMission.completedAt = new Date().toISOString()
              }

              userMissionsStore.put(userMission)
            }
          } else {
            // Create new progress entry
            const newUserMission = {
              userId,
              missionId: mission.id,
              progress: amount,
              requirementCount: requirements.count,
              completed: amount >= requirements.count,
              completedAt: amount >= requirements.count ? new Date().toISOString() : null,
              claimed: false,
            }
            userMissionsStore.add(newUserMission)
          }
        }
      })
    }
  } catch (error) {
    console.error("Error updating mission progress:", error)
  }
}

export async function claimMissionReward(userId: number, missionId: number): Promise<boolean> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["missions", "user_missions", "users", "badges", "user_badges"], "readwrite")
      const missionsStore = transaction!.objectStore("missions")
      const userMissionsStore = transaction!.objectStore("user_missions")
      const usersStore = transaction!.objectStore("users")
      const badgesStore = transaction!.objectStore("badges")
      const userBadgesStore = transaction!.objectStore("user_badges")

      // Get the mission to determine rewards
      const missionRequest = missionsStore.get(missionId)

      missionRequest.onsuccess = () => {
        const mission = missionRequest.result
        if (!mission) {
          reject("Mission not found")
          return
        }

        // Get user mission entry
        const userMissionIndex = userMissionsStore.index("userId_missionId")
        const userMissionRequest = userMissionIndex.get([userId, missionId])

        userMissionRequest.onsuccess = () => {
          const userMission = userMissionRequest.result

          if (!userMission || !userMission.completed || userMission.claimed) {
            reject("Mission not completed or already claimed")
            return
          }

          // Mark as claimed
          userMission.claimed = true
          userMissionsStore.put(userMission)

          // Award XP and points to user
          const userRequest = usersStore.get(userId)

          userRequest.onsuccess = () => {
            const user = userRequest.result
            if (user) {
              user.totalXp = (user.totalXp || 0) + mission.xpReward
              user.totalPoints = (user.totalPoints || 0) + mission.pointsReward

              // Check if user should level up
              const newLevel = calculateLevel(user.totalPoints)
              if (newLevel > user.level) {
                user.level = newLevel
              }

              usersStore.put(user)

              // Update user in localStorage
              localStorage.setItem("lingualearn_user", JSON.stringify(user))
            }

            // Award badge if applicable
            if (mission.badgeId) {
              // Check if user already has this badge
              const userBadgeIndex = userBadgesStore.index("userId_badgeId")
              const userBadgeRequest = userBadgeIndex.get([userId, mission.badgeId])

              userBadgeRequest.onsuccess = () => {
                const userBadge = userBadgeRequest.result

                if (!userBadge) {
                  // Get badge details
                  const badgeRequest = badgesStore.get(mission.badgeId)

                  badgeRequest.onsuccess = () => {
                    const badge = badgeRequest.result
                    if (badge) {
                      // Award badge to user
                      const newUserBadge = {
                        userId,
                        badgeId: mission.badgeId,
                        earnedAt: new Date().toISOString(),
                        displayed: true,
                      }
                      userBadgesStore.add(newUserBadge)
                    }
                    resolve(true)
                  }
                } else {
                  resolve(true)
                }
              }
            } else {
              resolve(true)
            }
          }

          userRequest.onerror = () => {
            reject("Error getting user")
          }
        }

        userMissionRequest.onerror = () => {
          reject("Error getting user mission")
        }
      }

      missionRequest.onerror = () => {
        reject("Error getting mission")
      }
    })
  } catch (error) {
    console.error("Error in claimMissionReward:", error)
    return false
  }
}

// Badge-related functions
export async function getUserBadges(userId: number): Promise<(Badge & { earnedAt: string; displayed: boolean })[]> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["badges", "user_badges"], "readonly")
      const badgesStore = transaction!.objectStore("badges")
      const userBadgesStore = transaction!.objectStore("user_badges")
      const userBadgesIndex = userBadgesStore.index("userId")

      // Get user's badges
      const userBadgesRequest = userBadgesIndex.getAll(userId)

      userBadgesRequest.onsuccess = () => {
        const userBadges = userBadgesRequest.result || []

        if (userBadges.length === 0) {
          resolve([])
          return
        }

        // Get badge details for each user badge
        const badgePromises = userBadges.map((userBadge) => {
          return new Promise<Badge & { earnedAt: string; displayed: boolean }>((resolveBadge) => {
            const badgeRequest = badgesStore.get(userBadge.badgeId)

            badgeRequest.onsuccess = () => {
              const badge = badgeRequest.result
              if (badge) {
                resolveBadge({
                  ...badge,
                  earnedAt: userBadge.earnedAt,
                  displayed: userBadge.displayed,
                })
              } else {
                resolveBadge(null as any)
              }
            }

            badgeRequest.onerror = () => {
              resolveBadge(null as any)
            }
          })
        })

        Promise.all(badgePromises).then((badges) => {
          // Filter out null values and sort by earned date
          const validBadges = badges.filter(Boolean)
          validBadges.sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
          resolve(validBadges)
        })
      }

      userBadgesRequest.onerror = () => {
        reject("Error getting user badges")
      }
    })
  } catch (error) {
    console.error("Error in getUserBadges:", error)
    return []
  }
}

// Helper function to calculate level based on points
function calculateLevel(points: number): number {
  // Simple level calculation: level = 1 + floor(points / 1000)
  // This means:
  // Level 1: 0-999 points
  // Level 2: 1000-1999 points
  // Level 3: 2000-2999 points
  // And so on...
  return 1 + Math.floor(points / 1000)
}

// Function to generate a lesson summary
export async function generateLessonSummary(lessonId: number): Promise<{
  lesson: Lesson
  questions: Question[]
  vocabulary: { word: string; translation: string }[]
}> {
  try {
    const db = await initializeDatabase()

    // Get lesson details
    const lesson = await getLessonById(lessonId)
    if (!lesson) {
      throw new Error("Lesson not found")
    }

    // Get questions for the lesson
    const questions = await getQuestionsForLesson(lessonId)

    // Extract vocabulary from questions
    const vocabulary: { word: string; translation: string }[] = []

    questions.forEach((question) => {
      if (question.type === "multiple-choice") {
        vocabulary.push({
          word: question.correctAnswer,
          translation: question.prompt.replace("What is '", "").replace("' in Spanish?", ""),
        })
      } else if (question.type === "translation") {
        vocabulary.push({
          word: question.prompt.replace("Translate: '", "").replace("'", ""),
          translation: question.correctAnswer,
        })
      }
    })

    return {
      lesson,
      questions,
      vocabulary,
    }
  } catch (error) {
    console.error("Error generating lesson summary:", error)
    throw error
  }
}

// User operations
export async function createUser(name: string): Promise<User> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readwrite")
      const store = transaction.objectStore("users")

      const newUser: Omit<User, "id"> = {
        name,
        totalXp: 0,
        lessonsCompleted: 0,
        joinedDate: new Date().toISOString().split("T")[0],
        level: 1,
        totalPoints: 0,
        speakingPractice: {
          totalPracticed: 0,
          correctCount: 0,
          averageScore: 0,
          history: [],
        },
        games: {},
      }

      const request = store.add(newUser)

      request.onsuccess = (event) => {
        const id = (event.target as IDBRequest).result as number
        resolve({ id, ...newUser })
      }

      request.onerror = () => {
        reject("Error creating user")
      }
    })
  } catch (error) {
    console.error("Error in createUser:", error)
    throw error
  }
}

export async function getUserByName(name: string): Promise<User | null> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("users", "readonly")
      const store = transaction.objectStore("users")
      const index = store.index("name")
      const request = index.get(name)

      request.onsuccess = () => {
        resolve(request.result || null)
      }

      request.onerror = () => {
        reject("Error getting user")
      }
    })
  } catch (error) {
    console.error("Error in getUserByName:", error)
    return null
  }
}

export async function getLeaderboard(): Promise<User[]> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("users", "readonly")
      const store = transaction.objectStore("users")
      const request = store.getAll()

      request.onsuccess = () => {
        const users = request.result || []
        // Sort by XP (descending)
        users.sort((a, b) => b.totalXp - a.totalXp)
        resolve(users)
      }

      request.onerror = () => {
        reject("Error getting leaderboard")
      }
    })
  } catch (error) {
    console.error("Error in getLeaderboard:", error)
    return []
  }
}

// Database operations
export async function getUserStats(): Promise<UserStats | null> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("user_stats", "readonly")
      const store = transaction.objectStore("user_stats")
      const request = store.get(1)

      request.onsuccess = () => {
        resolve(request.result || null)
      }

      request.onerror = () => {
        reject("Error getting user stats")
      }
    })
  } catch (error) {
    console.error("Error in getUserStats:", error)
    return null
  }
}

export async function updateUserStats(stats: Partial<UserStats>): Promise<boolean> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("user_stats", "readwrite")
      const store = transaction.objectStore("user_stats")
      const request = store.get(1)

      request.onsuccess = () => {
        const currentStats = request.result || {
          id: 1,
          totalXp: 0,
          lessonsCompleted: 0,
          joinedDate: new Date().toISOString().split("T")[0],
          level: 1,
          totalPoints: 0,
        }

        const updatedStats = { ...currentStats, ...stats }
        store.put(updatedStats)
        resolve(true)
      }

      request.onerror = () => {
        reject("Error updating user stats")
      }
    })
  } catch (error) {
    console.error("Error in updateUserStats:", error)
    return false
  }
}

export async function getLanguages(): Promise<Language[]> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("languages", "readonly")
      const store = transaction.objectStore("languages")
      const request = store.getAll()

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        reject("Error getting languages")
      }
    })
  } catch (error) {
    console.error("Error in getLanguages:", error)
    return []
  }
}

export async function getLessonsByLanguage(languageId: number): Promise<Lesson[]> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("lessons", "readonly")
      const store = transaction.objectStore("lessons")
      const index = store.index("languageId")
      const request = index.getAll(languageId)

      request.onsuccess = () => {
        const lessons = request.result || []
        // Sort by order if available, otherwise by id
        lessons.sort((a, b) => (a.order !== undefined && b.order !== undefined ? a.order - b.order : a.id - b.id))
        resolve(lessons)
      }

      request.onerror = () => {
        reject("Error getting lessons")
      }
    })
  } catch (error) {
    console.error("Error in getLessonsByLanguage:", error)
    return []
  }
}

export async function getLessonById(id: number): Promise<Lesson | null> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("lessons", "readonly")
      const store = transaction.objectStore("lessons")
      const request = store.get(id)

      request.onsuccess = () => {
        if (request.result) {
          resolve(request.result)
        } else {
          // If lesson doesn't exist, create a mock one
          const languageId = 1 // Default to English
          const name = `English Basics ${id}`

          const mockLesson: Lesson = {
            id,
            languageId,
            name,
            totalQuestions: 5,
            order: id,
            difficulty: 1,
            description: `Lesson ${id} for ${name}`,
          }

          // Add it to the database
          const writeTransaction = db.transaction("lessons", "readwrite")
          const writeStore = writeTransaction.objectStore("lessons")
          writeStore.add(mockLesson)

          resolve(mockLesson)
        }
      }

      request.onerror = () => {
        reject("Error getting lesson")
      }
    })
  } catch (error) {
    console.error("Error in getLessonById:", error)
    return null
  }
}

export async function saveUserProgress(progress: UserProgress, userId?: number): Promise<boolean> {
  try {
    // Get userId from parameter or localStorage
    let actualUserId = userId
    if (!actualUserId) {
      const currentUserStr = localStorage.getItem("lingualearn_user")
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr)
        actualUserId = currentUser.id
      }
    }
    
    if (!actualUserId) {
      console.error("No userId provided and could not get from localStorage")
      return false
    }

    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["user_progress", "vocabulary"], "readwrite")
      const store = transaction.objectStore("user_progress")

      // Add timestamp and userId if not provided
      if (!progress.timestamp) {
        progress.timestamp = new Date().toISOString()
      }
      if (!progress.userId) {
        progress.userId = actualUserId
      }

      const request = store.add(progress)

      request.onsuccess = async () => {
        try {
          // Update user XP and lessons completed
          await updateUserXP(actualUserId!, progress.lessonId, progress.correct === 1 ? 10 : 0)

          // If answer was correct, add to vocabulary
          if (progress.correct === 1) {
            await addToVocabulary(actualUserId!, progress.lessonId, progress.questionId)
            
            // Update challenge and mission progress
            await updateChallengeProgress(actualUserId!, "xp", 10)
            await updateMissionProgress(actualUserId!, "correct_answers", 1)
          }

          // Update challenge progress for lesson
          await updateChallengeProgress(actualUserId!, "lesson", 1)

          resolve(true)
        } catch (error) {
          console.error("Error in saveUserProgress callbacks:", error)
          // Still resolve as the progress was saved
          resolve(true)
        }
      }

      request.onerror = () => {
        reject("Error saving user progress")
      }
    })
  } catch (error) {
    console.error("Error in saveUserProgress:", error)
    return false
  }
}

async function addToVocabulary(userId: number, lessonId: number, questionId: number): Promise<void> {
  try {

    const db = await initializeDatabase()

    // First get the question to extract word and translation
    const transaction = db.transaction(["questions", "lessons", "languages"], "readonly")
    const questionsStore = transaction.objectStore("questions")
    const request = questionsStore.get(questionId)

    request.onsuccess = async () => {
      if (!request.result) return

      const question = request.result

      // Only add vocabulary for certain question types
      if (!["multiple-choice", "translation"].includes(question.type)) return

      // Get the lesson to determine language
      const lessonsStore = transaction.objectStore("lessons")
      const lessonRequest = lessonsStore.get(lessonId)

      lessonRequest.onsuccess = async () => {
        if (!lessonRequest.result) return

        const lesson = lessonRequest.result
        const languageId = lesson.languageId

        // Get language code
        const languagesStore = transaction.objectStore("languages")
        const languageRequest = languagesStore.get(languageId)

        languageRequest.onsuccess = async () => {
          if (!languageRequest.result) return

          const language = languageRequest.result

          // Determine word and translation based on question type
          let word, translation

          if (question.type === "multiple-choice") {
            // For multiple choice, the correct answer is the word
            word = question.correctAnswer
            translation = question.prompt.replace("What is '", "").replace("' in English?", "")
          } else if (question.type === "translation") {
            // For translation, the prompt contains the word to translate
            word = question.prompt.replace("Translate: '", "").replace("'", "")
            translation = question.correctAnswer
          } else {
            return
          }

          // Check if this vocabulary item already exists
          const vocabTransaction = db.transaction("vocabulary", "readwrite")
          const vocabularyStore = vocabTransaction.objectStore("vocabulary")
          const vocabIndex = vocabularyStore.index("userId")
          const vocabRequest = vocabIndex.getAll(userId)

          vocabRequest.onsuccess = () => {
            const existingItems = vocabRequest.result || []
            const existingItem = existingItems.find((item) => item.word === word && item.languageId === languageId)

            if (existingItem) {
              // Update existing item
              existingItem.correctCount += 1
              existingItem.difficulty = Math.max(1, existingItem.difficulty - 0.1)
              existingItem.lastReviewed = new Date().toISOString()

              // Calculate next review date
              const nextReview = new Date()
              nextReview.setDate(nextReview.getDate() + Math.ceil(existingItem.difficulty))
              existingItem.nextReview = nextReview.toISOString()

              vocabularyStore.put(existingItem)
            } else {
              // Add new vocabulary item
              const newVocabItem = {
                userId,
                word,
                translation,
                languageId,
                languageCode: language.code,
                difficulty: 3, // Medium difficulty to start
                lastReviewed: new Date().toISOString(),
                nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Review tomorrow
                correctCount: 1,
                incorrectCount: 0,
              }

              vocabularyStore.add(newVocabItem)

              // Update mission progress for vocabulary
              // updateMissionProgress(1)
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error adding to vocabulary:", error)
  }
}

export async function getUserVocabulary(userId: number): Promise<VocabularyItem[]> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("vocabulary", "readonly")
      const store = transaction.objectStore("vocabulary")
      const index = store.index("userId")
      const request = index.getAll(userId)

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        reject("Error getting vocabulary")
      }
    })
  } catch (error) {
    console.error("Error in getUserVocabulary:", error)
    return []
  }
}

export async function updateVocabularyReview(
  id: number,
  updates: {
    difficulty: number
    lastReviewed: string
    nextReview: string
    correctCount: number
    incorrectCount: number
  },
  userId?: number,
): Promise<boolean> {
  try {
    let actualUserId = userId
    if (!actualUserId) {
      const currentUserStr = localStorage.getItem("lingualearn_user")
      if (currentUserStr) {
        const currentUser = JSON.parse(currentUserStr)
        actualUserId = currentUser.id
      }
    }
    
    if (!actualUserId) {
      console.error("No userId provided for updateVocabularyReview")
      return false
    }

    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("vocabulary", "readwrite")
      const store = transaction.objectStore("vocabulary")
      const request = store.get(id)

      request.onsuccess = async () => {
        if (!request.result) {
          reject("Vocabulary item not found")
          return
        }

        const updatedItem = { ...request.result, ...updates }
        const updateRequest = store.put(updatedItem)

        updateRequest.onsuccess = async () => {
          try {
            // Update challenge progress for vocabulary review
            await updateChallengeProgress(actualUserId!, "vocabulary", 1)
            
            // Update mission progress for vocabulary review
            await updateMissionProgress(actualUserId!, "vocabulary", 1)

            resolve(true)
          } catch (error) {
            console.error("Error updating challenge/mission progress:", error)
            resolve(true) // Still resolve as vocabulary was updated
          }
        }

        updateRequest.onerror = () => {
          reject("Error updating vocabulary item")
        }
      }

      request.onerror = () => {
        reject("Error getting vocabulary item")
      }
    })
  } catch (error) {
    console.error("Error in updateVocabularyReview:", error)
    return false
  }
}

async function updateUserXP(userId: number, lessonId: number, xpEarned: number): Promise<void> {
  try {
    if (xpEarned <= 0) return

    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("users", "readwrite")
      const store = transaction.objectStore("users")
      const request = store.get(userId)

      request.onsuccess = async () => {
        let user = request.result

        // If user doesn't exist in IndexedDB, try to create from localStorage
        if (!user) {
          try {
            const currentUserStr = localStorage.getItem("lingualearn_user")
            if (currentUserStr) {
              const currentUser = JSON.parse(currentUserStr)
              if (currentUser.id === userId) {
                // Create user in IndexedDB from localStorage data
                user = {
                  id: userId,
                  name: currentUser.name || `User ${userId}`,
                  totalXp: currentUser.totalXp || 0,
                  lessonsCompleted: currentUser.lessonsCompleted || 0,
                  joinedDate: currentUser.joinedDate || new Date().toISOString().split("T")[0],
                  level: currentUser.level || 1,
                  totalPoints: currentUser.totalPoints || 0,
                  completedLessons: currentUser.completedLessons || [],
                  speakingPractice: currentUser.speakingPractice || {
                    totalPracticed: 0,
                    correctCount: 0,
                    averageScore: 0,
                    history: [],
                  },
                  games: currentUser.games || {},
                  practiceStats: currentUser.practiceStats || {},
                }
                
                // Add user to IndexedDB
                const addRequest = store.add(user)
                addRequest.onsuccess = () => {
                  // Continue with XP update
                  updateUserXPData(user, userId, lessonId, xpEarned, store, resolve, reject)
                }
                addRequest.onerror = () => {
                  reject(new Error("Error creating user in database"))
                }
                return
              }
            }
          } catch (error) {
            console.error("Error loading user from localStorage:", error)
          }
          
          // If we still don't have a user, reject
          reject(new Error("User not found in database or localStorage"))
          return
        }

        // User exists, update normally
        updateUserXPData(user, userId, lessonId, xpEarned, store, resolve, reject)
      }

      request.onerror = () => {
        reject(new Error("Error getting user"))
      }
    })
  } catch (error) {
    console.error("Error updating user XP:", error)
    throw error
  }
}

// Helper function to update user XP data
async function updateUserXPData(
  user: any,
  userId: number,
  lessonId: number,
  xpEarned: number,
  store: IDBObjectStore,
  resolve: () => void,
  reject: (error: Error) => void,
): Promise<void> {
  try {
    // Check if this is a new lesson completion
    const isNewLesson = !user.completedLessons || !user.completedLessons.includes(lessonId)

    user.totalXp = (user.totalXp || 0) + xpEarned
    user.totalPoints = (user.totalPoints || 0) + xpEarned

    // Check if user should level up
    const newLevel = calculateLevel(user.totalPoints)
    if (newLevel > user.level) {
      user.level = newLevel
    }

    if (isNewLesson) {
      user.lessonsCompleted = (user.lessonsCompleted || 0) + 1
      user.completedLessons = [...(user.completedLessons || []), lessonId]

      // Update mission progress for completing a lesson
      await updateMissionProgress(userId, "lesson", 1)
    }

    // Update user in database
    const putRequest = store.put(user)
    
    putRequest.onsuccess = () => {
      // Update user in localStorage
      localStorage.setItem("lingualearn_user", JSON.stringify(user))
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new Event("userUpdated"))
      
      resolve()
    }

    putRequest.onerror = () => {
      reject(new Error("Error updating user in database"))
    }
  } catch (error) {
    console.error("Error in updateUserXPData:", error)
    reject(error as Error)
  }
}

export async function getQuestionsForLesson(lessonId: number): Promise<Question[]> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("questions", "readonly")
      const store = transaction.objectStore("questions")
      const index = store.index("lessonId")
      const request = index.getAll(lessonId)

      request.onsuccess = () => {
        if (request.result && request.result.length > 0) {
          resolve(request.result)
        } else {
          // If no questions found, return mock questions
          resolve(getMockQuestionsForLesson(lessonId))
        }
      }

      request.onerror = () => {
        reject("Error getting questions")
      }
    })
  } catch (error) {
    console.error("Error in getQuestionsForLesson:", error)
    return getMockQuestionsForLesson(lessonId)
  }
}

// Replace the getMockQuestionsForLesson function with this improved version that generates unique questions for each lesson ID

function getMockQuestionsForLesson(lessonId: number): Question[] {
  // Create a unique set of questions based on the lesson ID
  const uniqueId = lessonId * 100 // Ensure each lesson has a unique ID range

  // Define question categories based on lesson ID ranges
  if (lessonId % 10 === 1) {
    // Greetings and introductions
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Which phrase is used to greet someone in the morning?",
        options: JSON.stringify(["Good morning", "Good evening", "Good night", "Goodbye"]),
        correctAnswer: "Good morning",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the greetings with the appropriate time",
        options: JSON.stringify([
          { id: 1, text: "Good morning", matchId: 4, side: "left" },
          { id: 2, text: "Good afternoon", matchId: 5, side: "left" },
          { id: 3, text: "Good evening", matchId: 6, side: "left" },
          { id: 4, text: "5-12 AM", matchId: 1, side: "right" },
          { id: 5, text: "12-5 PM", matchId: 2, side: "right" },
          { id: 6, text: "5-9 PM", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "_____ to meet you! My name is John.",
        options: JSON.stringify(["Nice", "Happy", "Glad", "Pleased"]),
        correctAnswer: "Nice",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which is a formal way to greet someone?",
        options: JSON.stringify(["Hey!", "Hello, how do you do?", "What's up?", "Hi there!"]),
        correctAnswer: "Hello, how do you do?",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "What do you say when leaving a place in the evening?",
        options: JSON.stringify(["Good morning", "Hello", "Good evening", "Good night"]),
        correctAnswer: "Good night",
      },
    ]
  } else if (lessonId % 10 === 2) {
    // Basic vocabulary - food
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Which of these is a fruit?",
        options: JSON.stringify(["Carrot", "Potato", "Apple", "Onion"]),
        correctAnswer: "Apple",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the foods with their categories",
        options: JSON.stringify([
          { id: 1, text: "Apple", matchId: 4, side: "left" },
          { id: 2, text: "Chicken", matchId: 5, side: "left" },
          { id: 3, text: "Bread", matchId: 6, side: "left" },
          { id: 4, text: "Fruit", matchId: 1, side: "right" },
          { id: 5, text: "Meat", matchId: 2, side: "right" },
          { id: 6, text: "Grain", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "I would like a glass of _____.",
        options: JSON.stringify(["water", "chair", "book", "pen"]),
        correctAnswer: "water",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which meal is typically eaten in the morning?",
        options: JSON.stringify(["Breakfast", "Lunch", "Dinner", "Supper"]),
        correctAnswer: "Breakfast",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "Which of these is a vegetable?",
        options: JSON.stringify(["Orange", "Banana", "Broccoli", "Milk"]),
        correctAnswer: "Broccoli",
      },
    ]
  } else if (lessonId % 10 === 3) {
    // Numbers and counting
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "What comes after 'nineteen'?",
        options: JSON.stringify(["Eighteen", "Twenty", "Twelve", "Ninety"]),
        correctAnswer: "Twenty",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the numbers with their written forms",
        options: JSON.stringify([
          { id: 1, text: "1", matchId: 4, side: "left" },
          { id: 2, text: "5", matchId: 5, side: "left" },
          { id: 3, text: "10", matchId: 6, side: "left" },
          { id: 4, text: "One", matchId: 1, side: "right" },
          { id: 5, text: "Five", matchId: 2, side: "right" },
          { id: 6, text: "Ten", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "There are _____ days in a week.",
        options: JSON.stringify(["seven", "five", "ten", "thirty"]),
        correctAnswer: "seven",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which is the correct spelling of 25?",
        options: JSON.stringify(["Twenty-five", "Twentyfive", "Twoty-five", "Twenty five"]),
        correctAnswer: "Twenty-five",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "How many months are in a year?",
        options: JSON.stringify(["10", "11", "12", "13"]),
        correctAnswer: "12",
      },
    ]
  } else if (lessonId % 10 === 4) {
    // Colors and descriptions
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Which color is made by mixing blue and yellow?",
        options: JSON.stringify(["Red", "Purple", "Green", "Orange"]),
        correctAnswer: "Green",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the colors with common objects of that color",
        options: JSON.stringify([
          { id: 1, text: "Red", matchId: 4, side: "left" },
          { id: 2, text: "Blue", matchId: 5, side: "left" },
          { id: 3, text: "Green", matchId: 6, side: "left" },
          { id: 4, text: "Apple", matchId: 1, side: "right" },
          { id: 5, text: "Sky", matchId: 2, side: "right" },
          { id: 6, text: "Grass", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "The sun is _____.",
        options: JSON.stringify(["yellow", "blue", "green", "purple"]),
        correctAnswer: "yellow",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which is NOT a primary color?",
        options: JSON.stringify(["Red", "Blue", "Green", "Yellow"]),
        correctAnswer: "Green",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "What color is often associated with sadness?",
        options: JSON.stringify(["Red", "Blue", "Yellow", "Green"]),
        correctAnswer: "Blue",
      },
    ]
  } else if (lessonId % 10 === 5) {
    // Family members
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Your father's sister is your:",
        options: JSON.stringify(["Mother", "Aunt", "Cousin", "Sister"]),
        correctAnswer: "Aunt",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match family members with their relationships",
        options: JSON.stringify([
          { id: 1, text: "Father", matchId: 4, side: "left" },
          { id: 2, text: "Mother", matchId: 5, side: "left" },
          { id: 3, text: "Sibling", matchId: 6, side: "left" },
          { id: 4, text: "Dad", matchId: 1, side: "right" },
          { id: 5, text: "Mom", matchId: 2, side: "right" },
          { id: 6, text: "Brother/Sister", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "Your mother's mother is your _____.",
        options: JSON.stringify(["grandmother", "grandfather", "aunt", "cousin"]),
        correctAnswer: "grandmother",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "What do you call your parent's son?",
        options: JSON.stringify(["Brother", "Uncle", "Cousin", "Nephew"]),
        correctAnswer: "Brother",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "What is the relationship between your children?",
        options: JSON.stringify(["Parents", "Siblings", "Cousins", "Grandparents"]),
        correctAnswer: "Siblings",
      },
    ]
  } else if (lessonId % 10 === 6) {
    // Common verbs
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Which word describes the action of moving on foot?",
        options: JSON.stringify(["Run", "Walk", "Jump", "Sit"]),
        correctAnswer: "Walk",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the verbs with their meanings",
        options: JSON.stringify([
          { id: 1, text: "Eat", matchId: 4, side: "left" },
          { id: 2, text: "Sleep", matchId: 5, side: "left" },
          { id: 3, text: "Read", matchId: 6, side: "left" },
          { id: 4, text: "Consume food", matchId: 1, side: "right" },
          { id: 5, text: "Rest with eyes closed", matchId: 2, side: "right" },
          { id: 6, text: "Look at and comprehend text", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "I _____ to school every day.",
        options: JSON.stringify(["go", "goes", "going", "went"]),
        correctAnswer: "go",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which verb is in the past tense?",
        options: JSON.stringify(["Walk", "Walks", "Walking", "Walked"]),
        correctAnswer: "Walked",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "What is the opposite of 'buy'?",
        options: JSON.stringify(["Sell", "Give", "Take", "Borrow"]),
        correctAnswer: "Sell",
      },
    ]
  } else if (lessonId % 10 === 7) {
    // Time and dates
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "How many seconds are in a minute?",
        options: JSON.stringify(["30", "60", "90", "100"]),
        correctAnswer: "60",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the time periods with their durations",
        options: JSON.stringify([
          { id: 1, text: "Minute", matchId: 4, side: "left" },
          { id: 2, text: "Hour", matchId: 5, side: "left" },
          { id: 3, text: "Day", matchId: 6, side: "left" },
          { id: 4, text: "60 seconds", matchId: 1, side: "right" },
          { id: 5, text: "60 minutes", matchId: 2, side: "right" },
          { id: 6, text: "24 hours", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "There are _____ months in a year.",
        options: JSON.stringify(["twelve", "ten", "seven", "thirty"]),
        correctAnswer: "twelve",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which is NOT a day of the week?",
        options: JSON.stringify(["Monday", "Friday", "January", "Sunday"]),
        correctAnswer: "January",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "What comes after Wednesday?",
        options: JSON.stringify(["Tuesday", "Thursday", "Friday", "Monday"]),
        correctAnswer: "Thursday",
      },
    ]
  } else if (lessonId % 10 === 8) {
    // Places and directions
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Where would you go to borrow books?",
        options: JSON.stringify(["Hospital", "Library", "Restaurant", "Park"]),
        correctAnswer: "Library",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the places with their functions",
        options: JSON.stringify([
          { id: 1, text: "School", matchId: 4, side: "left" },
          { id: 2, text: "Hospital", matchId: 5, side: "left" },
          { id: 3, text: "Restaurant", matchId: 6, side: "left" },
          { id: 4, text: "Learning", matchId: 1, side: "right" },
          { id: 5, text: "Healthcare", matchId: 2, side: "right" },
          { id: 6, text: "Dining", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "Turn _____ at the traffic light to reach the museum.",
        options: JSON.stringify(["right", "left", "around", "back"]),
        correctAnswer: "right",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which is the opposite of 'north'?",
        options: JSON.stringify(["East", "West", "South", "Up"]),
        correctAnswer: "South",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "Where would you go to see animals?",
        options: JSON.stringify(["Library", "Zoo", "Bank", "Post Office"]),
        correctAnswer: "Zoo",
      },
    ]
  } else if (lessonId % 10 === 9) {
    // Weather and seasons
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Which season comes after winter?",
        options: JSON.stringify(["Summer", "Fall", "Spring", "Autumn"]),
        correctAnswer: "Spring",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the weather conditions with their descriptions",
        options: JSON.stringify([
          { id: 1, text: "Sunny", matchId: 4, side: "left" },
          { id: 2, text: "Rainy", matchId: 5, side: "left" },
          { id: 3, text: "Snowy", matchId: 6, side: "left" },
          { id: 4, text: "Clear sky with bright sun", matchId: 1, side: "right" },
          { id: 5, text: "Water falling from clouds", matchId: 2, side: "right" },
          { id: 6, text: "White flakes falling from sky", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "It's very _____ in summer.",
        options: JSON.stringify(["hot", "cold", "windy", "snowy"]),
        correctAnswer: "hot",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which season is associated with falling leaves?",
        options: JSON.stringify(["Spring", "Summer", "Fall/Autumn", "Winter"]),
        correctAnswer: "Fall/Autumn",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "What do you need when it's raining?",
        options: JSON.stringify(["Sunglasses", "Umbrella", "Gloves", "Scarf"]),
        correctAnswer: "Umbrella",
      },
    ]
  } else {
    // Basic grammar and sentence structure
    return [
      {
        id: uniqueId + 1,
        lessonId,
        type: "multiple-choice",
        prompt: "Which is a complete sentence?",
        options: JSON.stringify(["Running fast.", "The dog barks.", "Beautiful flower.", "Very quickly."]),
        correctAnswer: "The dog barks.",
      },
      {
        id: uniqueId + 2,
        lessonId,
        type: "matching",
        prompt: "Match the words with their parts of speech",
        options: JSON.stringify([
          { id: 1, text: "Happy", matchId: 4, side: "left" },
          { id: 2, text: "Run", matchId: 5, side: "left" },
          { id: 3, text: "Quickly", matchId: 6, side: "left" },
          { id: 4, text: "Adjective", matchId: 1, side: "right" },
          { id: 5, text: "Verb", matchId: 2, side: "right" },
          { id: 6, text: "Adverb", matchId: 3, side: "right" },
        ]),
        correctAnswer: "matching",
      },
      {
        id: uniqueId + 3,
        lessonId,
        type: "fill-blank",
        prompt: "She _____ to the store yesterday.",
        options: JSON.stringify(["go", "goes", "went", "going"]),
        correctAnswer: "went",
      },
      {
        id: uniqueId + 4,
        lessonId,
        type: "multiple-choice",
        prompt: "Which sentence uses the correct pronoun?",
        options: JSON.stringify([
          "Me am happy.",
          "Her is going to school.",
          "They are my friends.",
          "Him likes pizza.",
        ]),
        correctAnswer: "They are my friends.",
      },
      {
        id: uniqueId + 5,
        lessonId,
        type: "multiple-choice",
        prompt: "Which word is a noun?",
        options: JSON.stringify(["Run", "Beautiful", "Quickly", "Teacher"]),
        correctAnswer: "Teacher",
      },
    ]
  }
}

// Daily Challenges
export async function getDailyChallenges(userId: number): Promise<Challenge[]> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["challenges", "user_challenges"], "readonly")
      const challengesStore = transaction.objectStore("challenges")
      const userChallengesStore = transaction.objectStore("user_challenges")
      const userChallengesIndex = userChallengesStore.index("userId")

      // Get all challenges
      const challengesRequest = challengesStore.getAll()

      challengesRequest.onsuccess = () => {
        const challenges = challengesRequest.result || []

        // Get user's progress on challenges
        const userChallengesRequest = userChallengesIndex.getAll(userId)

        userChallengesRequest.onsuccess = () => {
          const userChallenges = userChallengesRequest.result || []

          // Combine challenge data with user progress
          const combinedChallenges = challenges.map((challenge) => {
            const userChallenge = userChallenges.find((uc) => uc.challengeId === challenge.id)

            return {
              ...challenge,
              progress: userChallenge ? userChallenge.progress : 0,
              completed: userChallenge ? userChallenge.completed : false,
            }
          })

          resolve(combinedChallenges)
        }

        userChallengesRequest.onerror = () => {
          reject("Error getting user challenges")
        }
      }

      challengesRequest.onerror = () => {
        reject("Error getting challenges")
      }
    })
  } catch (error) {
    console.error("Error in getDailyChallenges:", error)
    return []
  }
}

export async function updateChallengeProgress(userId: number, challengeType: string, amount: number): Promise<void> {
  try {

    const db = await initializeDatabase()
    const transaction = db.transaction(["challenges", "user_challenges"], "readwrite")
    const challengesStore = transaction.objectStore("challenges")
    const userChallengesStore = transaction.objectStore("user_challenges")

    // Get challenges of the specified type
    const challengesRequest = challengesStore.getAll()

    challengesRequest.onsuccess = () => {
      const challenges = challengesRequest.result || []
      const relevantChallenges = challenges.filter((c) => c.type === challengeType)

      relevantChallenges.forEach((challenge) => {
        // Get user's progress on this challenge
        const userChallengeIndex = userChallengesStore.index("userId_challengeId")
        const userChallengeRequest = userChallengeIndex.get([userId, challenge.id])

        userChallengeRequest.onsuccess = () => {
          const userChallenge = userChallengeRequest.result

          if (userChallenge) {
            // Update existing progress
            if (!userChallenge.completed) {
              userChallenge.progress += amount
              userChallengesStore.put(userChallenge)
            }
          } else {
            // Create new progress entry
            const newUserChallenge = {
              userId,
              challengeId: challenge.id,
              progress: amount,
              completed: false,
              completedAt: null,
            }
            userChallengesStore.add(newUserChallenge)
          }
        }
      })
    }
  } catch (error) {
    console.error("Error updating challenge progress:", error)
  }
}

export async function completeChallenge(userId: number, challengeId: number): Promise<boolean> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["challenges", "user_challenges", "users"], "readwrite")
      const challengesStore = transaction.objectStore("challenges")
      const userChallengesStore = transaction.objectStore("user_challenges")
      const usersStore = transaction.objectStore("users")

      // Get the challenge to determine XP reward
      const challengeRequest = challengesStore.get(challengeId)

      challengeRequest.onsuccess = () => {
        const challenge = challengeRequest.result
        if (!challenge) {
          reject("Challenge not found")
          return
        }

        // Get user challenge entry
        const userChallengeIndex = userChallengesStore.index("userId_challengeId")
        const userChallengeRequest = userChallengeIndex.get([userId, challengeId])

        userChallengeRequest.onsuccess = () => {
          const userChallenge = userChallengeRequest.result

          if (!userChallenge) {
            reject("User challenge not found")
            return
          }

          // Mark as completed
          userChallenge.completed = true
          userChallenge.completedAt = new Date().toISOString()
          userChallengesStore.put(userChallenge)

          // Award XP to user
          const userRequest = usersStore.get(userId)

          userRequest.onsuccess = () => {
            const user = userRequest.result
            if (user) {
              user.totalXp = (user.totalXp || 0) + challenge.xpReward
              user.totalPoints = (user.totalPoints || 0) + challenge.xpReward

              // Check if user should level up
              const newLevel = calculateLevel(user.totalPoints)
              if (newLevel > user.level) {
                user.level = newLevel
              }

              usersStore.put(user)

              // Update user in localStorage
              localStorage.setItem("lingualearn_user", JSON.stringify(user))
            }

            resolve(true)
          }

          userRequest.onerror = () => {
            reject("Error getting user")
          }
        }

        userChallengeRequest.onerror = () => {
          reject("Error getting user challenge")
        }
      }

      challengeRequest.onerror = () => {
        reject("Error getting challenge")
      }
    })
  } catch (error) {
    console.error("Error in completeChallenge:", error)
    return false
  }
}

// Lesson completion tracking functions
export async function completeLessonAndSaveProgress(
  userId: number,
  lessonId: number,
  score: number,
  totalQuestions: number,
  correctAnswers: number,
  xpEarned?: number,
): Promise<boolean> {
  try {
    // Ensure user exists in IndexedDB before saving
    await ensureUserExistsInIndexedDB(userId)

    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["lesson_completions", "users", "user_stats"], "readwrite")
      const lessonCompletionsStore = transaction.objectStore("lesson_completions")
      const usersStore = transaction.objectStore("users")
      const userStatsStore = transaction.objectStore("user_stats")

      // Check if this lesson is already completed
      const index = lessonCompletionsStore.index("userId_lessonId")
      const request = index.get([userId, lessonId])

      request.onsuccess = async () => {
        const existingCompletion = request.result
        const isNewCompletion = !existingCompletion

        if (existingCompletion) {
          // Update existing completion if the new score is better
          if (score > existingCompletion.score) {
            existingCompletion.score = score
            existingCompletion.correctAnswers = correctAnswers
            existingCompletion.completedAt = new Date().toISOString()
            lessonCompletionsStore.put(existingCompletion)
          }
          resolve(true)
        } else {
          // Create new completion record
          const newCompletion: LessonCompletion = {
            userId,
            lessonId,
            completed: true,
            completedAt: new Date().toISOString(),
            score,
            totalQuestions,
            correctAnswers,
          }

          const addRequest = lessonCompletionsStore.add(newCompletion)

          addRequest.onsuccess = async () => {
            try {
              // Update user stats
              const userRequest = usersStore.get(userId)
              userRequest.onsuccess = async () => {
                const user = userRequest.result
                if (user) {
                  // Check if this is a new lesson completion
                  const isNewLesson = !user.completedLessons || !user.completedLessons.includes(lessonId)

                  // Award XP if provided
                  if (xpEarned && xpEarned > 0) {
                    user.totalXp = (user.totalXp || 0) + xpEarned
                    user.totalPoints = (user.totalPoints || 0) + xpEarned

                    // Check if user should level up
                    const newLevel = calculateLevel(user.totalPoints)
                    if (newLevel > user.level) {
                      user.level = newLevel
                    }
                  }

                  // Increment lessons completed count if new lesson
                  if (isNewLesson) {
                    user.lessonsCompleted = (user.lessonsCompleted || 0) + 1
                    user.completedLessons = [...(user.completedLessons || []), lessonId]
                    
                    // Update mission progress for completing a lesson
                    await updateMissionProgress(userId, "lesson", 1)
                  }

                  usersStore.put(user)

                  // Update user in localStorage
                  localStorage.setItem("lingualearn_user", JSON.stringify(user))
                  
                  // Dispatch custom event to notify other components
                  if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("userUpdated"))
                  }
                }

                // Update user_stats (global stats)
                const statsRequest = userStatsStore.get(1)
                statsRequest.onsuccess = async () => {
                  const stats = statsRequest.result
                  if (stats) {
                    if (isNewCompletion) {
                      stats.lessonsCompleted = (stats.lessonsCompleted || 0) + 1
                      userStatsStore.put(stats)
                    }

                    // If perfect score, update mission progress
                    if (score === 100) {
                      await updateMissionProgress(userId, "perfect_lesson", 1)
                    }
                  }

                  resolve(true)
                }

                statsRequest.onerror = () => {
                  // Still resolve even if stats update fails
                  resolve(true)
                }
              }

              userRequest.onerror = () => {
                reject("Error getting user")
              }
            } catch (error) {
              console.error("Error in completeLessonAndSaveProgress callbacks:", error)
              resolve(true) // Still resolve as completion was saved
            }
          }

          addRequest.onerror = () => {
            reject("Error adding lesson completion")
          }
        }
      }

      request.onerror = () => {
        reject("Error checking existing lesson completion")
      }
    })
  } catch (error) {
    console.error("Error in completeLessonAndSaveProgress:", error)
    return false
  }
}

export async function getUserCompletedLessons(userId: number): Promise<LessonCompletion[]> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("lesson_completions", "readonly")
      const store = transaction.objectStore("lesson_completions")
      const index = store.index("userId")
      const request = index.getAll(userId)

      request.onsuccess = () => {
        resolve(request.result || [])
      }

      request.onerror = () => {
        reject("Error getting completed lessons")
      }
    })
  } catch (error) {
    console.error("Error in getUserCompletedLessons:", error)
    return []
  }
}

export async function isLessonCompleted(userId: number, lessonId: number): Promise<boolean> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction("lesson_completions", "readonly")
      const store = transaction.objectStore("lesson_completions")
      const index = store.index("userId_lessonId")
      const request = index.get([userId, lessonId])

      request.onsuccess = () => {
        resolve(!!request.result)
      }

      request.onerror = () => {
        reject("Error checking lesson completion")
      }
    })
  } catch (error) {
    console.error("Error in isLessonCompleted:", error)
    return false
  }
}

export async function getLanguageCompletionPercentage(userId: number, languageId: number): Promise<number> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["lessons", "lesson_completions"], "readonly")
      const lessonsStore = transaction.objectStore("lessons")
      const lessonCompletionsStore = transaction.objectStore("lesson_completions")

      // Get all lessons for this language
      const lessonsIndex = lessonsStore.index("languageId")
      const lessonsRequest = lessonsIndex.getAll(languageId)

      lessonsRequest.onsuccess = () => {
        const lessons = lessonsRequest.result || []
        if (lessons.length === 0) {
          resolve(0)
          return
        }

        // Get all completed lessons for this user
        const completionsIndex = lessonCompletionsStore.index("userId")
        const completionsRequest = completionsIndex.getAll(userId)

        completionsRequest.onsuccess = () => {
          const completions = completionsRequest.result || []

          // Filter completions for this language's lessons
          const lessonIds = lessons.map((lesson) => lesson.id)
          const relevantCompletions = completions.filter((completion) => lessonIds.includes(completion.lessonId))

          // Calculate percentage
          const percentage = (relevantCompletions.length / lessons.length) * 100
          resolve(Math.round(percentage))
        }

        completionsRequest.onerror = () => {
          reject("Error getting lesson completions")
        }
      }

      lessonsRequest.onerror = () => {
        reject("Error getting lessons")
      }
    })
  } catch (error) {
    console.error("Error in getLanguageCompletionPercentage:", error)
    return 0
  }
}

// Add English-Thai vocabulary to user's library
export async function addEnglishThaiVocabulary(
  userId: number,
  words: { word: string; translation: string }[],
): Promise<boolean> {
  try {
    const db = await initializeDatabase()
    const transaction = db.transaction("vocabulary", "readwrite")
    const store = transaction.objectStore("vocabulary")

    for (const item of words) {
      const newVocabItem = {
        userId,
        word: item.word,
        translation: item.translation,
        languageId: 1, // English
        languageCode: "en",
        difficulty: 3, // Medium difficulty to start
        lastReviewed: new Date().toISOString(),
        nextReview: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Review tomorrow
        correctCount: 1,
        incorrectCount: 0,
      }

      await store.add(newVocabItem)
    }

    // Update mission progress
    // updateMissionProgress(words.length)

    return true
  } catch (error) {
    console.error("Error adding English-Thai vocabulary:", error)
    return false
  }
}

// Speaking practice progress tracking
export async function saveSpeakingPracticeProgress(
  userId: number,
  word: string,
  correct: boolean,
  pronunciationScore: number,
): Promise<boolean> {
  try {
    // Ensure user exists in IndexedDB before saving
    await ensureUserExistsInIndexedDB(userId)

    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readwrite")
      const usersStore = transaction.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        if (request.result) {
          const user = request.result

          // Initialize speaking practice data if it doesn't exist
          if (!user.speakingPractice) {
            user.speakingPractice = {
              totalPracticed: 0,
              correctCount: 0,
              averageScore: 0,
              history: [],
            }
          }

          // Update speaking practice stats
          user.speakingPractice.totalPracticed += 1
          if (correct) {
            user.speakingPractice.correctCount += 1
          }

          // Calculate new average score
          const totalScores =
            user.speakingPractice.averageScore * (user.speakingPractice.totalPracticed - 1) + pronunciationScore
          user.speakingPractice.averageScore = totalScores / user.speakingPractice.totalPracticed

          // Add to history (keep last 50 entries)
          user.speakingPractice.history.push({
            word,
            correct,
            score: pronunciationScore,
            timestamp: new Date().toISOString(),
          })

          // Limit history size
          if (user.speakingPractice.history.length > 50) {
            user.speakingPractice.history = user.speakingPractice.history.slice(-50)
          }

          // Award XP for correct answers
          if (correct && pronunciationScore >= 70) {
            const xpEarned = Math.floor(pronunciationScore / 10) // 7-10 XP based on score
            user.totalXp = (user.totalXp || 0) + xpEarned
            user.totalPoints = (user.totalPoints || 0) + xpEarned

            // Check if user should level up
            const newLevel = calculateLevel(user.totalPoints)
            if (newLevel > user.level) {
              user.level = newLevel
            }
          }

          // Update user in database
          const putRequest = usersStore.put(user)

          putRequest.onsuccess = async () => {
            // Update user in localStorage
            localStorage.setItem("lingualearn_user", JSON.stringify(user))
            
            // Dispatch custom event to notify other components
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("userUpdated"))
            }

            // Update challenge and mission progress
            try {
              if (correct) {
                await updateChallengeProgress(userId, "speaking", 1)
                await updateMissionProgress(userId, "speaking", 1)
              }
            } catch (error) {
              console.error("Error updating challenge/mission progress:", error)
            }

            resolve(true)
          }

          putRequest.onerror = () => {
            reject("Error updating user")
          }
        } else {
          reject("User not found")
        }
      }

      request.onerror = () => {
        reject("Error getting user")
      }
    })
  } catch (error) {
    console.error("Error saving speaking practice progress:", error)
    return false
  }
}

// Get speaking practice progress
export async function getSpeakingPracticeProgress(userId: number): Promise<any> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readonly")
      const usersStore = transaction.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        if (request.result && request.result.speakingPractice) {
          resolve(request.result.speakingPractice)
        } else {
          resolve({
            totalPracticed: 0,
            correctCount: 0,
            averageScore: 0,
            history: [],
          })
        }
      }

      request.onerror = () => {
        reject("Error getting user")
      }
    })
  } catch (error) {
    console.error("Error getting speaking practice progress:", error)
    return {
      totalPracticed: 0,
      correctCount: 0,
      averageScore: 0,
      history: [],
    }
  }
}

// Game progress tracking
export async function saveGameProgress(userId: number, gameId: string, score: number, details: any): Promise<boolean> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readwrite")
      const usersStore = transaction.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        if (request.result) {
          const user = request.result

          // Initialize games data if it doesn't exist
          if (!user.games) {
            user.games = {}
          }

          // Initialize specific game data if it doesn't exist
          if (!user.games[gameId]) {
            user.games[gameId] = {
              bestScore: 0,
              timesPlayed: 0,
              history: [],
            }
          }

          // Update game stats
          user.games[gameId].timesPlayed += 1
          if (score > user.games[gameId].bestScore) {
            user.games[gameId].bestScore = score
          }

          // Add to history (keep last 20 entries)
          user.games[gameId].history.push({
            score,
            details,
            timestamp: new Date().toISOString(),
          })

          // Limit history size
          if (user.games[gameId].history.length > 20) {
            user.games[gameId].history = user.games[gameId].history.slice(-20)
          }

          // Update user in database
          usersStore.put(user)

          // Update user in localStorage
          localStorage.setItem("lingualearn_user", JSON.stringify(user))

          resolve(true)
        } else {
          reject("User not found")
        }
      }

      request.onerror = () => {
        reject("Error getting user")
      }
    })
  } catch (error) {
    console.error("Error saving game progress:", error)
    return false
  }
}

// Get game progress
export async function getGameProgress(userId: number, gameId: string): Promise<any> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readonly")
      const usersStore = transaction.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        if (request.result && request.result.games && request.result.games[gameId]) {
          resolve(request.result.games[gameId])
        } else {
          resolve({
            bestScore: 0,
            timesPlayed: 0,
            history: [],
          })
        }
      }

      request.onerror = () => {
        reject("Error getting user")
      }
    })
  } catch (error) {
    console.error("Error getting game progress:", error)
    return {
      bestScore: 0,
      timesPlayed: 0,
      history: [],
    }
  }
}

// Helper function to ensure user exists in IndexedDB before saving activity data
export async function ensureUserExistsInIndexedDB(userId: number): Promise<void> {
  try {
    const db = await initializeDatabase()
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readwrite")
      const usersStore = transaction.objectStore("users")
      const request = usersStore.get(userId)
      
      request.onsuccess = () => {
        if (!request.result) {
          // User doesn't exist in IndexedDB, create from localStorage
          const userStr = localStorage.getItem("lingualearn_user")
          if (userStr) {
            try {
              const user = JSON.parse(userStr)
              if (user.id === userId) {
                // Ensure all required fields are present with default values
                const userRecord = {
                  ...user,
                  totalXp: user.totalXp || 0,
                  totalPoints: user.totalPoints || 0,
                  level: user.level || 1,
                  lessonsCompleted: user.lessonsCompleted || 0,
                  games: user.games || {},
                  speakingPractice: user.speakingPractice || {
                    totalPracticed: 0,
                    correctCount: 0,
                    averageScore: 0,
                    history: [],
                  },
                  practiceStats: user.practiceStats || {},
                  assessment: user.assessment || null,
                  timedWriting: user.timedWriting || null,
                  streak: user.streak || 0,
                  perfectLessonStreak: user.perfectLessonStreak || 0,
                  completedLessons: user.completedLessons || [],
                  studyTimes: user.studyTimes || {},
                }
                
                // Create user in IndexedDB
                const addRequest = usersStore.add(userRecord)
                
                addRequest.onsuccess = () => {
                  console.log(`User ${userId} created in IndexedDB`)
                  resolve()
                }
                
                addRequest.onerror = (event) => {
                  console.error("Error creating user in IndexedDB:", event)
                  reject(new Error("Error creating user in IndexedDB"))
                }
              } else {
                reject(new Error(`User ID mismatch: localStorage has ${user.id}, requested ${userId}`))
              }
            } catch (parseError) {
              console.error("Error parsing user from localStorage:", parseError)
              reject(new Error("Error parsing user from localStorage"))
            }
          } else {
            reject(new Error("No user found in localStorage"))
          }
        } else {
          // User already exists in IndexedDB
          resolve()
        }
      }
      
      request.onerror = (event) => {
        console.error("Error checking user in IndexedDB:", event)
        reject(new Error("Error checking user in IndexedDB"))
      }
    })
  } catch (error) {
    console.error("Error in ensureUserExistsInIndexedDB:", error)
    throw error
  }
}

export async function saveGameResult(result: {
  userId: number
  gameType: string
  score: number
  date: string
  details: any
}): Promise<void> {
  try {
    // Use userId from parameter instead of localStorage
    const userId = result.userId

    // Ensure user exists in IndexedDB before saving
    await ensureUserExistsInIndexedDB(userId)

    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readwrite")
      const usersStore = transaction.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        if (request.result) {
          const user = request.result

          // Initialize games data if it doesn't exist
          if (!user.games) {
            user.games = {}
          }

          // Initialize specific game data if it doesn't exist
          if (!user.games[result.gameType]) {
            user.games[result.gameType] = {
              bestScore: 0,
              timesPlayed: 0,
              history: [],
            }
          }

          // Update game stats
          user.games[result.gameType].timesPlayed += 1
          if (result.score > user.games[result.gameType].bestScore) {
            user.games[result.gameType].bestScore = result.score
          }

          // Add to history (keep last 20 entries)
          user.games[result.gameType].history.push({
            score: result.score,
            details: result.details,
            timestamp: result.date,
          })

          // Limit history size
          if (user.games[result.gameType].history.length > 20) {
            user.games[result.gameType].history = user.games[result.gameType].history.slice(-20)
          }

          // Calculate and award XP based on score
          // Base XP: score / 10, minimum 5 XP for playing
          const xpEarned = Math.max(5, Math.floor(result.score / 10))
          const oldLevel = user.level || 1
          
          // Update user XP and total points
          user.totalXp = (user.totalXp || 0) + xpEarned
          user.totalPoints = (user.totalPoints || 0) + xpEarned

          // Check if user should level up
          if (user.totalPoints) {
            // Use the existing calculateLevel function or import from scoring-system
            const newLevel = calculateLevel(user.totalPoints)
            if (newLevel > oldLevel) {
              user.level = newLevel
            }
          }

          // Update user in database
          const putRequest = usersStore.put(user)

          putRequest.onsuccess = () => {
            // Update user in localStorage
            localStorage.setItem("lingualearn_user", JSON.stringify(user))
            
            // Dispatch custom event to notify other components about XP update
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("userUpdated"))
            }
            
            resolve()
          }

          putRequest.onerror = () => {
            reject(new Error("Error updating user in database"))
          }
        } else {
          reject(new Error("User not found"))
        }
      }

      request.onerror = () => {
        reject(new Error("Error getting user from database"))
      }
    })
  } catch (error) {
    console.error("Error saving game result:", error)
    throw error
  }
}

// Define the assessment result interface
interface AssessmentResult {
  score: number
  level: number
  recommendedLessonId: number
  completedAt: string
}

// Add this function to save assessment results
export async function saveAssessmentResult(userId: number, result: AssessmentResult): Promise<boolean> {
  try {
    // Ensure user exists in IndexedDB before saving
    await ensureUserExistsInIndexedDB(userId)

    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readwrite")
      const usersStore = transaction.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        if (request.result) {
          const user = request.result

          // Add or update assessment data
          user.assessment = {
            ...result,
            history: [...(user.assessment?.history || []), result],
          }

          // Update recommended starting lesson if this is first assessment or better score
          if (!user.recommendedStartingLesson || result.score > (user.assessment?.score || 0)) {
            user.recommendedStartingLesson = result.recommendedLessonId
          }

          // Update user in database
          usersStore.put(user)

          // Update user in localStorage
          localStorage.setItem("lingualearn_user", JSON.stringify(user))

          resolve(true)
        } else {
          reject("User not found")
        }
      }

      request.onerror = () => {
        reject("Error getting user")
      }
    })
  } catch (error) {
    console.error("Error saving assessment result:", error)
    return false
  }
}

// Add this function to get user's assessment results
export async function getUserAssessmentResults(userId: number): Promise<AssessmentResult[]> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readonly")
      const usersStore = transaction.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        if (request.result && request.result.assessment) {
          resolve(request.result.assessment.history || [])
        } else {
          resolve([])
        }
      }

      request.onerror = () => {
        reject("Error getting user assessment results")
      }
    })
  } catch (error) {
    console.error("Error in getUserAssessmentResults:", error)
    return []
  }
}

// Add this function to get user's recommended starting lesson
export async function getRecommendedStartingLesson(userId: number): Promise<number | null> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readonly")
      const usersStore = transaction.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        if (request.result && request.result.recommendedStartingLesson) {
          resolve(request.result.recommendedStartingLesson)
        } else {
          resolve(null) // No recommendation yet, start from beginning
        }
      }

      request.onerror = () => {
        reject("Error getting recommended starting lesson")
      }
    })
  } catch (error) {
    console.error("Error in getRecommendedStartingLesson:", error)
    return null
  }
}

// Add these functions to the existing database.ts file

// Check if user has completed assessment
export async function hasCompletedAssessment(userId: number): Promise<boolean> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readonly")
      const usersStore = transaction.objectStore("users")
      const request = usersStore.get(userId)
      request.onsuccess = () => {
        if (request.result && request.result.assessment.skipped === true) {
          resolve(true)
        } else {
          resolve(false)
        }
      }

      request.onerror = () => {
        reject("Error checking assessment completion")
      }
    })
  } catch (error) {
    console.error("Error in hasCompletedAssessment:", error)
    return false
  }
}

// Enhanced saveAssessmentResult function to auto-level up and unlock lessons
export async function saveAssessmentResultEnhanced(
  userId: number,
  result: {
    score: number
    level: number
    recommendedLessonId: number
    completedAt: string
    xpAwarded?: number
    autoUnlock?: boolean
  },
): Promise<{ success: boolean; leveledUp: boolean }> {
  try {
    // Ensure user exists in IndexedDB before saving
    await ensureUserExistsInIndexedDB(userId)

    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users", "lessons", "lesson_completions"], "readwrite")
      const usersStore = transaction.objectStore("users")
      const lessonsStore = transaction.objectStore("lessons")
      const lessonCompletionsStore = transaction.objectStore("lesson_completions")

      const request = usersStore.get(userId)

      request.onsuccess = async () => {
        if (request.result) {
          const user = request.result
          let leveledUp = false

          // Add or update assessment data
          user.assessment = {
            ...result,
            history: [...(user.assessment?.history || []), result],
          }

          // Update recommended starting lesson
          user.recommendedStartingLesson = result.recommendedLessonId

          // Award XP if specified
          if (result.xpAwarded) {
            const oldLevel = user.level || 1
            user.totalXp = (user.totalXp || 0) + result.xpAwarded
            user.totalPoints = (user.totalPoints || 0) + result.xpAwarded

            // Check if user should level up
            const newLevel = calculateLevel(user.totalPoints)
            if (newLevel > oldLevel) {
              user.level = newLevel
              leveledUp = true
            }
          }

          // Auto-unlock lessons if specified
          if (result.autoUnlock) {
            // Get all lessons
            const lessonsRequest = lessonsStore.getAll()

            lessonsRequest.onsuccess = () => {
              const allLessons = lessonsRequest.result || []

              // Find lessons to auto-unlock (all lessons up to recommended lesson)
              const lessonsToUnlock = allLessons.filter(
                (lesson) => lesson.id < result.recommendedLessonId && lesson.languageId === 1, // English
              )

              // Mark early lessons as completed
              const earlyLessons = lessonsToUnlock.slice(0, 3) // First 3 lessons

              // Process each lesson
              Promise.all(
                earlyLessons.map((lesson) => {
                  // Create completion record for early lessons
                  const completion = {
                    userId,
                    lessonId: lesson.id,
                    completed: true,
                    completedAt: new Date().toISOString(),
                    score: 100, // Perfect score for auto-completed lessons
                    totalQuestions: 5,
                    correctAnswers: 5,
                  }

                  // Check if already completed
                  const index = lessonCompletionsStore.index("userId_lessonId")
                  return new Promise<void>((resolveLesson) => {
                    const checkRequest = index.get([userId, lesson.id])

                    checkRequest.onsuccess = () => {
                      if (!checkRequest.result) {
                        // Only add if not already completed
                        lessonCompletionsStore.add(completion)
                      }
                      resolveLesson()
                    }

                    checkRequest.onerror = () => {
                      resolveLesson() // Continue even if there's an error
                    }
                  })
                }),
              ).then(() => {
                // Update user in database
                usersStore.put(user)

                // Update user in localStorage
                localStorage.setItem("lingualearn_user", JSON.stringify(user))

                resolve({ success: true, leveledUp })
              })
            }

            lessonsRequest.onerror = () => {
              // Still save user data even if lesson unlocking fails
              usersStore.put(user)
              localStorage.setItem("lingualearn_user", JSON.stringify(user))
              resolve({ success: true, leveledUp })
            }
          } else {
            // Update user without unlocking lessons
            usersStore.put(user)
            localStorage.setItem("lingualearn_user", JSON.stringify(user))
            resolve({ success: true, leveledUp })
          }
        } else {
          reject("User not found")
        }
      }

      request.onerror = () => {
        reject("Error getting user")
      }
    })
  } catch (error) {
    console.error("Error saving assessment result:", error)
    return { success: false, leveledUp: false }
  }
}

// Get user achievements
export async function getUserAchievements(userId: number): Promise<UserAchievement[]> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["user_achievements"], "readonly")
      const store = transaction.objectStore("user_achievements")

      // Try to use the userId index if it exists
      if (Array.from(store.indexNames).includes("userId")) {
        const index = store.index("userId")
        const request = index.getAll(userId)

        request.onsuccess = () => {
          resolve(request.result || [])
        }

        request.onerror = (event) => {
          console.error("Error getting user achievements by index:", event)
          // Fall back to getting all and filtering
          getAllAndFilter()
        }
      } else {
        // If the index doesn't exist, get all achievements and filter
        getAllAndFilter()
      }

      function getAllAndFilter() {
        const request = store.getAll()

        request.onsuccess = () => {
          const allAchievements = request.result || []
          const userAchievements = allAchievements.filter((achievement) => achievement.userId === userId)
          resolve(userAchievements)
        }

        request.onerror = (event) => {
          console.error("Error getting all user achievements:", event)
          reject("Error getting user achievements")
        }
      }
    })
  } catch (error) {
    console.error("Error in getUserAchievements:", error)
    return []
  }
}

// Check and unlock achievements based on user activity
export async function checkAndUnlockAchievements(userId: number): Promise<number[]> {
  try {
    const db = await initializeDatabase()
    return new Promise(async (resolve, reject) => {
      const transaction = db.transaction(
        ["users", "user_achievements", "achievements", "lesson_completions", "vocabulary"],
        "readwrite",
      )

      const usersStore = transaction.objectStore("users")
      const userAchievementsStore = transaction.objectStore("user_achievements")
      const achievementsStore = transaction.objectStore("achievements")
      const lessonCompletionsStore = transaction.objectStore("lesson_completions")
      const vocabularyStore = transaction.objectStore("vocabulary")

      // Get user data
      const userRequest = usersStore.get(userId)

      userRequest.onsuccess = async () => {
        const user = userRequest.result
        if (!user) {
          resolve([])
          return
        }

        // Get all achievements
        const achievementsRequest = achievementsStore.getAll()

        achievementsRequest.onsuccess = async () => {
          const allAchievements = achievementsRequest.result || []

          // Get user's current achievements
          const userAchievementsIndex = userAchievementsStore.index("userId")
          const userAchievementsRequest = userAchievementsIndex.getAll(userId)

          userAchievementsRequest.onsuccess = async () => {
            const userAchievements = userAchievementsRequest.result || []

            // Get user's lesson completions
            const lessonCompletionsIndex = lessonCompletionsStore.index("userId")
            const lessonCompletionsRequest = lessonCompletionsIndex.getAll(userId)

            lessonCompletionsRequest.onsuccess = async () => {
              const lessonCompletions = lessonCompletionsRequest.result || []

              // Get user's vocabulary
              const vocabularyIndex = vocabularyStore.index("userId")
              const vocabularyRequest = vocabularyIndex.getAll(userId)

              vocabularyRequest.onsuccess = async () => {
                const vocabulary = vocabularyRequest.result || []

                // Prepare achievement check data
                const checkData = {
                  lessons_completed: lessonCompletions.length,
                  current_streak: user.streak || 0,
                  total_xp: user.totalXp || 0,
                  perfect_lesson: lessonCompletions.some((lc) => lc.score === 100),
                  perfect_streak: user.perfectLessonStreak || 0,
                  language_complete: false, // Would need to check if all lessons in a language are completed
                  vocabulary_learned: vocabulary.length,
                  games_played: Object.values(user.games || {}).reduce((sum, game: any) => sum + (game.timesPlayed || 0), 0),
                  word_scramble_score: user.games?.wordScramble?.bestScore || 0,
                  memory_match_perfect: user.games?.memoryMatch?.perfectRounds > 0,
                  listening_exercises: user.practiceStats?.listening?.completed || 0,
                  speaking_exercises: user.practiceStats?.speaking?.completed || 0,
                  reading_exercises: user.practiceStats?.reading?.completed || 0,
                  total_practice:
                    (user.practiceStats?.listening?.completed || 0) +
                    (user.practiceStats?.speaking?.completed || 0) +
                    (user.practiceStats?.reading?.completed || 0),
                  study_after_midnight: user.studyTimes?.afterMidnight || false,
                  study_before_6am: user.studyTimes?.before6am || false,
                  weekend_study: user.studyTimes?.weekend || false,
                  languages_level5: 0, // Would need to check language levels
                  writing_practice: user.practiceStats?.writing?.completed || 0,
                }

                // Check each achievement
                const newlyUnlockedAchievements: number[] = []

                for (const achievement of allAchievements) {
                  // Skip if already unlocked
                  if (userAchievements.some((ua) => ua.achievementId === achievement.id && ua.unlocked)) {
                    continue
                  }

                  // Check if achievement should be unlocked
                  let shouldUnlock = false

                  try {
                    // Parse the requirement and check against user data
                    const requirement = achievement.requirement

                    // Simple requirement parsing (in a real app, you'd want a more robust solution)
                    if (requirement.includes(">=")) {
                      const [key, valueStr] = requirement.split(">=").map((s: string) => s.trim())
                      const value = Number.parseInt(valueStr)
                      shouldUnlock = checkData[key as keyof typeof checkData] >= value
                    } else if (requirement.includes("=")) {
                      const [key, valueStr] = requirement.split("=").map((s: string) => s.trim())
                      const value =
                        valueStr === "true" ? true : valueStr === "false" ? false : Number.parseInt(valueStr)
                      shouldUnlock = checkData[key as keyof typeof checkData] === value
                    }
                  } catch (error) {
                    console.error(`Error checking achievement ${achievement.id}:`, error)
                  }

                  if (shouldUnlock) {
                    // Create new user achievement entry
                    const newUserAchievement = {
                      userId,
                      achievementId: achievement.id,
                      unlocked: true,
                      unlockedAt: new Date().toISOString(),
                      claimed: false,
                    }

                    userAchievementsStore.add(newUserAchievement)
                    newlyUnlockedAchievements.push(achievement.id)
                  }
                }

                resolve(newlyUnlockedAchievements)
              }

              vocabularyRequest.onerror = () => {
                reject("Error getting vocabulary")
              }
            }

            lessonCompletionsRequest.onerror = () => {
              reject("Error getting lesson completions")
            }
          }

          userAchievementsRequest.onerror = () => {
            reject("Error getting user achievements")
          }
        }

        achievementsRequest.onerror = () => {
          reject("Error getting achievements")
        }
      }

      userRequest.onerror = () => {
        reject("Error getting user")
      }
    })
  } catch (error) {
    console.error("Error in checkAndUnlockAchievements:", error)
    return []
  }
}

// Claim achievement reward
export async function claimAchievementReward(userId: number, achievementId: number): Promise<boolean> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["user_achievements", "achievements", "users"], "readwrite")
      const userAchievementsStore = transaction!.objectStore("user_achievements")
      const achievementsStore = transaction!.objectStore("achievements")
      const usersStore = transaction!.objectStore("users")

      // Get the achievement to determine rewards
      const achievementRequest = achievementsStore.get(achievementId)

      achievementRequest.onsuccess = () => {
        const achievement = achievementRequest.result
        if (!achievement) {
          reject("Achievement not found")
          return
        }

        // Get user achievement entry
        const userAchievementIndex = userAchievementsStore.index("userId_achievementId")
        const userAchievementRequest = userAchievementIndex.get([userId, achievementId])

        userAchievementRequest.onsuccess = () => {
          const userAchievement = userAchievementRequest.result

          if (!userAchievement || !userAchievement.unlocked || userAchievement.claimed) {
            reject("Achievement not unlocked or already claimed")
            return
          }

          // Mark as claimed
          userAchievement.claimed = true
          userAchievementsStore.put(userAchievement)

          // Award XP and points to user
          const userRequest = usersStore.get(userId)

          userRequest.onsuccess = () => {
            const user = userRequest.result
            if (user) {
              user.totalXp = (user.totalXp || 0) + (achievement.xpReward || 0)
              user.totalPoints = (user.totalPoints || 0) + (achievement.pointsReward || 0)

              // Check if user should level up
              const newLevel = calculateLevel(user.totalPoints)
              if (newLevel > user.level) {
                user.level = newLevel
              }

              usersStore.put(user)

              // Update user in localStorage
              localStorage.setItem("lingualearn_user", JSON.stringify(user))
            }

            resolve(true)
          }

          userRequest.onerror = () => {
            reject("Error getting user")
          }
        }

        userAchievementRequest.onerror = () => {
          reject("Error getting user achievement")
        }
      }

      achievementRequest.onerror = () => {
        reject("Error getting achievement")
      }
    })
  } catch (error) {
    console.error("Error in claimAchievementReward:", error)
    return false
  }
}

// Save writing practice progress
export async function saveWritingPracticeProgress(
  userId: number,
  exerciseId: number,
  correct: boolean,
  userAnswer: string,
): Promise<boolean> {
  try {
    // Ensure user exists in IndexedDB before saving
    await ensureUserExistsInIndexedDB(userId)

    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readwrite")
      const usersStore = transaction.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = async () => {
        if (request.result) {
          const user = request.result

          // Initialize writing practice data if it doesn't exist
          if (!user.practiceStats) {
            user.practiceStats = {}
          }

          if (!user.practiceStats.writing) {
            user.practiceStats.writing = {
              completed: 0,
              correctCount: 0,
              history: [],
            }
          }

          // Update writing practice stats
          user.practiceStats.writing.completed += 1
          if (correct) {
            user.practiceStats.writing.correctCount += 1
            
            // Award XP for correct answers
            const xpEarned = 10 // Base XP for correct writing exercise
            user.totalXp = (user.totalXp || 0) + xpEarned
            user.totalPoints = (user.totalPoints || 0) + xpEarned

            // Check if user should level up
            const newLevel = calculateLevel(user.totalPoints)
            if (newLevel > user.level) {
              user.level = newLevel
            }
          }

          // Add to history (keep last 50 entries)
          user.practiceStats.writing.history.push({
            exerciseId,
            correct,
            userAnswer,
            timestamp: new Date().toISOString(),
          })

          // Limit history size
          if (user.practiceStats.writing.history.length > 50) {
            user.practiceStats.writing.history = user.practiceStats.writing.history.slice(-50)
          }

          // Update user in database
          const putRequest = usersStore.put(user)

          putRequest.onsuccess = async () => {
            // Update user in localStorage
            localStorage.setItem("lingualearn_user", JSON.stringify(user))
            
            // Dispatch custom event to notify other components
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("userUpdated"))
            }

            // Update challenge and mission progress
            try {
              if (correct) {
                await updateChallengeProgress(userId, "writing", 1)
                await updateMissionProgress(userId, "writing", 1)
              }
            } catch (error) {
              console.error("Error updating challenge/mission progress:", error)
            }

            resolve(true)
          }

          putRequest.onerror = () => {
            reject("Error updating user")
          }
        } else {
          reject("User not found")
        }
      }

      request.onerror = () => {
        reject("Error getting user")
      }
    })
  } catch (error) {
    console.error("Error saving writing practice progress:", error)
    return false
  }
}

// Get writing practice progress
export async function getWritingPracticeProgress(userId: number): Promise<any> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readonly")
      const usersStore = transaction!.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        if (request.result && request.result.practiceStats && request.result.practiceStats.writing) {
          resolve(request.result.practiceStats.writing)
        } else {
          resolve({
            completed: 0,
            correctCount: 0,
            history: [],
          })
        }
      }

      request.onerror = () => {
        reject("Error getting writing practice progress")
      }
    })
  } catch (error) {
    console.error("Error in getWritingPracticeProgress:", error)
    return {
      completed: 0,
      correctCount: 0,
      history: [],
    }
  }
}

// Create a sound file for achievement unlocked notification

// Add these functions to the existing database.ts file

// Save timed writing challenge result
export async function saveTimedWritingChallenge(
  userId: number,
  result: {
    challengeId: number
    wordCount: number
    timeTaken: number
    isSuccessful: boolean
    xpEarned: number
    pointsEarned: number
    specialReward?: {
      type: string
      value: string | number
    }
    date: string
    content: string
  },
): Promise<boolean> {
  try {
    // Get current user from localStorage
    const currentUserStr = localStorage.getItem("lingualearn_user")
    if (!currentUserStr) return false

    const currentUser = JSON.parse(currentUserStr)
    const userId = currentUser.id

    const db = await initializeDatabase()
    const transaction = db.transaction(["users"], "readwrite")
    const usersStore = transaction!.objectStore("users")
    const request = usersStore.get(userId)

    request.onsuccess = () => {
      if (request.result) {
        const user = request.result

        // Initialize timed writing data if it doesn't exist
        if (!user.timedWriting) {
          user.timedWriting = {
            totalCompleted: 0,
            successfulCompleted: 0,
            bestTime: null,
            totalTime: 0,
            history: [],
          }
        }

        // Update timed writing stats
        user.timedWriting.totalCompleted += 1
        if (result.isSuccessful) {
          user.timedWriting.successfulCompleted += 1

          // Update best time if this is faster or first successful completion
          if (user.timedWriting.bestTime === null || result.timeTaken < user.timedWriting.bestTime) {
            user.timedWriting.bestTime = result.timeTaken
          }
        }

        // Update total time
        user.timedWriting.totalTime += result.timeTaken

        // Add to history (keep last 50 entries)
        user.timedWriting.history.push({
          challengeId: result.challengeId,
          wordCount: result.wordCount,
          timeTaken: result.timeTaken,
          isSuccessful: result.isSuccessful,
          xpEarned: result.xpEarned,
          pointsEarned: result.pointsEarned,
          specialReward: result.specialReward,
          date: result.date,
          // Store truncated content to save space
          content: result.content.substring(0, 150) + (result.content.length > 150 ? "..." : ""),
        })

        // Limit history size
        if (user.timedWriting.history.length > 50) {
          user.timedWriting.history = user.timedWriting.history.slice(-50)
        }

        // Award XP and points if successful
        if (result.isSuccessful) {
          user.totalXp = (user.totalXp || 0) + result.xpEarned
          user.totalPoints = (user.totalPoints || 0) + result.pointsEarned

          // Check if user should level up
          const newLevel = calculateLevel(user.totalPoints)
          if (newLevel > user.level) {
            user.level = newLevel
          }
        }

        // Update user in database
        usersStore.put(user)

        // Update user in localStorage
        localStorage.setItem("lingualearn_user", JSON.stringify(user))

        // Update mission progress
        // if (result.isSuccessful) {
        //   updateMissionProgress("timed_writing", 1)
        // }

        // Check for achievements
        checkAndUnlockAchievements(userId)

        return true
      }
    }

    return false
  } catch (error) {
    console.error("Error saving timed writing challenge:", error)
    return false
  }
}

// Get timed writing stats
export async function getTimedWritingStats(userId: number): Promise<{
  totalCompleted: number
  bestTime: number
  averageTime: number
  successRate: number
}> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readonly")
      const usersStore = transaction!.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        if (request.result && request.result.timedWriting) {
          const timedWriting = request.result.timedWriting

          resolve({
            totalCompleted: timedWriting.totalCompleted || 0,
            bestTime: timedWriting.bestTime || 0,
            averageTime: timedWriting.totalCompleted > 0 ? timedWriting.totalTime / timedWriting.totalCompleted : 0,
            successRate:
              timedWriting.totalCompleted > 0
                ? (timedWriting.successfulCompleted / timedWriting.totalCompleted) * 100
                : 0,
          })
        } else {
          resolve({
            totalCompleted: 0,
            bestTime: 0,
            averageTime: 0,
            successRate: 0,
          })
        }
      }

      request.onerror = () => {
        reject("Error getting timed writing stats")
      }
    })
  } catch (error) {
    console.error("Error in getTimedWritingStats:", error)
    return {
      totalCompleted: 0,
      bestTime: 0,
      averageTime: 0,
      successRate: 0,
    }
  }
}

// Get timed writing history
export async function getTimedWritingHistory(userId: number): Promise<any[]> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readonly")
      const usersStore = transaction!.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        if (request.result && request.result.timedWriting && request.result.timedWriting.history) {
          resolve(request.result.timedWriting.history)
        } else {
          resolve([])
        }
      }

      request.onerror = () => {
        reject("Error getting timed writing history")
      }
    })
  } catch (error) {
    console.error("Error in getTimedWritingHistory:", error)
    return []
  }
}

// Add this function to check if assessment was completed or skipped
export async function hasCompletedOrSkippedAssessment(userId: number): Promise<boolean> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readonly")
      const usersStore = transaction!.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        if (request.result && request.result.assessment) {
          // Check if assessment exists and either it's completed normally or was skipped
          const assessment = request.result.assessment
          const isCompleted = !!assessment
          const isSkipped = assessment.skipped === true
          resolve(isCompleted || isSkipped)
        } else {
          resolve(false)
        }
      }

      request.onerror = (event) => {
        console.error("Error checking assessment completion:", event)
        reject("Error checking assessment completion")
      }
    })
  } catch (error) {
    console.error("Error in hasCompletedOrSkippedAssessment:", error)
    return false
  }
}

// Add this function to skip the assessment
export async function skipAssessment(userId: number): Promise<{ success: boolean }> {
  try {
    const db = await initializeDatabase()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(["users"], "readwrite")
      const usersStore = transaction!.objectStore("users")
      const request = usersStore.get(userId)

      request.onsuccess = () => {
        const user = request.result
        if (!user) {
          reject("User not found")
          return
        }

        // Create a basic assessment result with skipped flag
        const assessmentResult = {
          score: 0,
          level: 1,
          recommendedLessonId: 1, // Start at the beginning
          completedAt: new Date().toISOString(),
          skipped: true,
          history: [],
        }

        // Update user with skipped assessment
        user.assessment = assessmentResult
        user.recommendedStartingLesson = 1

        // Add some XP for skipping
        user.totalXp = (user.totalXp || 0) + 10
        user.totalPoints = (user.totalPoints || 0) + 10

        // Update user in database
        const updateRequest = usersStore.put(user)

        updateRequest.onsuccess = () => {
          // Update user in localStorage
          localStorage.setItem("lingualearn_user", JSON.stringify(user))
          resolve({ success: true })
        }

        updateRequest.onerror = (event) => {
          console.error("Error updating user:", event)
          reject("Error updating user")
        }
      }

      request.onerror = (event) => {
        console.error("Error getting user:", event)
        reject("Error getting user")
      }
    })
  } catch (error) {
    console.error("Error in skipAssessment:", error)
    return { success: false }
  }
}

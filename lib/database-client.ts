// Client-side database service that uses the API
import {
  userAPI,
  languageAPI,
  lessonAPI,
  questionAPI,
  progressAPI,
  vocabularyAPI,
  challengeAPI,
  lessonCompletionAPI,
  assessmentAPI,
} from "./api-service"


// User operations
export async function createUser(name: string): Promise<any> {
  return userAPI.create(name)
}

export async function getUserByName(name: string): Promise<any> {
  return userAPI.getByName(name)
}

export async function getLeaderboard(): Promise<any[]> {
  return userAPI.getLeaderboard()
}

// Database operations
export async function getUserStats(): Promise<any> {
  // For now, we'll just return a mock user stats
  return {
    id: 1,
    totalXp: 120,
    lessonsCompleted: 8,
    joinedDate: new Date().toISOString().split("T")[0],
    level: 1,
    totalPoints: 120,
  }
}

export async function updateUserStats(stats: any): Promise<boolean> {
  // For now, we'll just return true
  return true
}

export async function getLanguages(): Promise<any[]> {
  return languageAPI.getAll()
}

export async function getLessonsByLanguage(languageId: number): Promise<any[]> {
  return lessonAPI.getByLanguage(languageId)
}

export async function getLessonById(id: number): Promise<any> {
  return lessonAPI.getById(id)
}

export async function saveUserProgress(progress: any): Promise<boolean> {
  await progressAPI.save(progress)
  return true
}

export async function getQuestionsForLesson(lessonId: number): Promise<any[]> {
  return questionAPI.getByLesson(lessonId)
}

export async function getUserVocabulary(userId: number): Promise<any[]> {
  return vocabularyAPI.getByUser(userId)
}

export async function updateVocabularyReview(id: number, updates: any): Promise<boolean> {
  await vocabularyAPI.updateReview(id, updates)
  return true
}

// Daily Challenges
export async function getDailyChallenges(userId: number): Promise<any[]> {
  return challengeAPI.getByUser(userId)
}

export async function updateChallengeProgress(challengeType: string, amount: number): Promise<void> {
  // This is handled server-side when saving progress
  return Promise.resolve()
}

export async function completeChallenge(userId: number, challengeId: number): Promise<boolean> {
  await challengeAPI.complete(userId, challengeId)
  return true
}

// Lesson completion tracking functions
export async function completeLessonAndSaveProgress(
  userId: number,
  lessonId: number,
  score: number,
  totalQuestions: number,
  correctAnswers: number,
): Promise<boolean> {
  await lessonCompletionAPI.complete({
    userId,
    lessonId,
    score,
    totalQuestions,
    correctAnswers,
  })
  return true
}

export async function getUserCompletedLessons(userId: number): Promise<any[]> {
  return lessonCompletionAPI.getByUser(userId)
}

export async function isLessonCompleted(userId: number, lessonId: number): Promise<boolean> {
  return lessonCompletionAPI.isCompleted(userId, lessonId)
}

export async function getLanguageCompletionPercentage(userId: number, languageId: number): Promise<number> {
  // We'll implement this later
  return 0
}

// Add English-Thai vocabulary to user's library
export async function addEnglishThaiVocabulary(
  userId: number,
  words: { word: string; translation: string }[],
): Promise<boolean> {
  // We'll implement this later
  return true
}

// Speaking practice progress tracking
export async function saveSpeakingPracticeProgress(
  userId: number,
  word: string,
  correct: boolean,
  pronunciationScore: number,
): Promise<boolean> {
  // Get current user
  const user = await userAPI.getByName(`user-${userId}`)

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

  // Update user
  await userAPI.update(`user-${userId}`, { speakingPractice: user.speakingPractice })

  return true
}

// Get speaking practice progress
export async function getSpeakingPracticeProgress(userId: number): Promise<any> {
  const user = await userAPI.getByName(`user-${userId}`)

  if (user && user.speakingPractice) {
    return user.speakingPractice
  }

  return {
    totalPracticed: 0,
    correctCount: 0,
    averageScore: 0,
    history: [],
  }
}

// Game progress tracking
export async function saveGameProgress(userId: number, gameId: string, score: number, details: any): Promise<boolean> {
  // Get current user
  const user = await userAPI.getByName(`user-${userId}`)

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

  // Update user
  await userAPI.update(`user-${userId}`, { games: user.games })

  return true
}

// Get game progress
export async function getGameProgress(userId: number, gameId: string): Promise<any> {
  const user = await userAPI.getByName(`user-${userId}`)

  if (user && user.games && user.games[gameId]) {
    return user.games[gameId]
  }

  return {
    bestScore: 0,
    timesPlayed: 0,
    history: [],
  }
}

export async function saveGameResult(result: {
  userId: number
  gameType: string
  score: number
  date: string
  details: any
}): Promise<void> {
  await saveGameProgress(result.userId, result.gameType, result.score, result.details)
}

// Assessment functions
export async function saveAssessmentResult(userId: number, result: any): Promise<boolean> {
  await assessmentAPI.saveResult(userId, result)
  return true
}

export async function getUserAssessmentResults(userId: number): Promise<any[]> {
  const user = await userAPI.getByName(`user-${userId}`)

  if (user && user.assessment && user.assessment.history) {
    return user.assessment.history
  }

  return []
}

export async function getRecommendedStartingLesson(userId: number): Promise<number | null> {
  const user = await userAPI.getByName(`user-${userId}`)

  if (user && user.recommendedStartingLesson) {
    return user.recommendedStartingLesson
  }

  return null
}

export async function hasCompletedAssessment(userId: number): Promise<boolean> {
  return assessmentAPI.hasCompletedOrSkipped(userId)
}

export async function saveAssessmentResultEnhanced(
  userId: number,
  result: any,
): Promise<{ success: boolean; leveledUp: boolean }> {
  return assessmentAPI.saveResult(userId, result)
}

export async function hasCompletedOrSkippedAssessment(userId: number): Promise<boolean> {
  return assessmentAPI.hasCompletedOrSkipped(userId)
}

export async function skipAssessment(userId: number): Promise<{ success: boolean }> {
  return assessmentAPI.skip(userId)
}

// Other functions will be implemented as needed
export async function getUserAchievements(userId: number): Promise<any[]> {
  // We'll implement this later
  return []
}

export async function checkAndUnlockAchievements(userId: number): Promise<number[]> {
  // We'll implement this later
  return []
}

export async function claimAchievementReward(userId: number, achievementId: number): Promise<boolean> {
  // We'll implement this later
  return true
}

export async function saveWritingPracticeProgress(
  userId: number,
  exerciseId: number,
  correct: boolean,
  userAnswer: string,
): Promise<boolean> {
  // We'll implement this later
  return true
}

export async function getWritingPracticeProgress(userId: number): Promise<any> {
  // We'll implement this later
  return {
    completed: 0,
    correctCount: 0,
    history: [],
  }
}

export async function saveTimedWritingChallenge(userId: number, result: any): Promise<boolean> {
  // We'll implement this later
  return true
}

export async function getTimedWritingStats(userId: number): Promise<any> {
  // We'll implement this later
  return {
    totalCompleted: 0,
    bestTime: 0,
    averageTime: 0,
    successRate: 0,
  }
}

export async function getTimedWritingHistory(userId: number): Promise<any[]> {
  // We'll implement this later
  return []
}

// Ensure database indexes
export async function ensureDatabaseIndexes(): Promise<void> {
  // This is handled server-side
  return Promise.resolve()
}

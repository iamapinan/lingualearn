// ไฟล์นี้เก็บ interface ต่างๆ สำหรับฐานข้อมูล

export interface UserStats {
  id: number
  totalXp: number
  lessonsCompleted: number
  joinedDate: string
  level: number // Added for gamification
  totalPoints: number // Added for gamification
}

export interface User {
  id: number
  name: string
  email: string
  passwordHash?: string
  role?: "user" | "admin"
  totalXp: number
  lessonsCompleted: number
  joinedDate: string
  level: number
  totalPoints: number
  streak?: number
  perfectLessonStreak?: number
  isActive?: boolean
  emailVerified?: boolean
  lastLoginAt?: string
  createdAt?: string
  updatedAt?: string
}

// New interface for missions
export interface Mission {
  id: number
  title: string
  description: string
  type: string // daily, weekly, achievement, etc.
  requirements: string // JSON string of requirements
  xpReward: number
  pointsReward: number
  badgeId?: number // Optional badge reward
  expiresAt?: string // Optional expiration date
  missionOrder: number // For ordering missions
  category: string // For grouping missions
}

// New interface for user mission progress
export interface UserMission {
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
export interface Badge {
  id: number
  name: string
  description: string
  icon: string
  category: string
  rarity: string // common, uncommon, rare, epic, legendary
}

// New interface for user badges
export interface UserBadge {
  id?: number
  userId: number
  badgeId: number
  earnedAt: string
  displayed: boolean // Whether the badge is displayed on profile
}

// Updated Achievement interface with rewards
export interface Achievement {
  id: number
  name: string
  description: string
  icon: string
  category: string
  rarity: string
  requirement: string
  xpReward: number
  pointsReward: number
}

// User achievement interface
export interface UserAchievement {
  id?: number
  userId: number
  achievementId: number
  unlocked: boolean
  unlockedAt: string | null
  claimed: boolean
}

export interface Language {
  id: number
  name: string
  code: string
  icon: string
}

export interface Lesson {
  id: number
  languageId: number
  name: string
  totalQuestions: number
  lessonOrder: number
  difficulty: number
  description: string
}

export interface Question {
  id: number
  lessonId: number
  type: string
  prompt: string
  options: string
  correctAnswer: string
  audioUrl?: string // For listening exercises
  imageUrl?: string // For image-based exercises
}

export interface UserProgress {
  id?: number
  lessonId: number
  questionId: number
  completed: number
  correct: number
  timestamp: string
}

export interface LessonCompletion {
  id?: number
  userId: number
  lessonId: number
  completed: boolean
  completedAt: string
  score: number
  totalQuestions: number
  correctAnswers: number
}

export interface VocabularyItem {
  id: number
  userId: number
  word: string
  translation: string
  languageId: number
  languageCode: string
  difficulty: number
  lastReviewed: string
  nextReview: string
  correctCount: number
  incorrectCount: number
}

export interface Verb {
  id: number
  userId: number
  baseForm: string
  pastSimple: string
  pastParticiple: string
  translation: string
  category: "regular" | "irregular"
  languageId: number
  languageCode: string
  difficulty: number
  exampleSentence?: string
  lastReviewed: string
  nextReview: string
  correctCount: number
  incorrectCount: number
  createdAt?: string
  updatedAt?: string
}

export interface Session {
  id: string
  userId: number
  token: string
  expiresAt: string
  createdAt?: string
}

export interface Challenge {
  id: number
  title: string
  description: string
  type: string
  xpReward: number
  requirementCount: number
  expiresAt: string
}

export interface UserChallenge {
  id?: number
  userId: number
  challengeId: number
  progress: number
  completed: boolean
  completedAt: string | null
}

export interface AssessmentResult {
  score: number
  level: number
  recommendedLessonId: number
  completedAt: string
  xpAwarded: number
  autoUnlock: boolean
  skipped?: boolean // New field to track if assessment was skipped
}

import { mysqlTable, varchar, int, text, boolean, datetime, timestamp, decimal, mysqlEnum, uniqueIndex } from "drizzle-orm/mysql-core"

// Users table
export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: mysqlEnum("role", ["user", "admin"]).default("user"),
  totalXp: int("total_xp").notNull().default(0),
  lessonsCompleted: int("lessons_completed").notNull().default(0),
  level: int("level").notNull().default(1),
  totalPoints: int("total_points").notNull().default(0),
  streak: int("streak").default(0),
  perfectLessonStreak: int("perfect_lesson_streak").default(0),
  recommendedStartingLesson: int("recommended_starting_lesson"),
  speakingPractice: text("speaking_practice"),
  games: text("games"),
  assessment: text("assessment"),
  practiceStats: text("practice_stats"),
  studyTimes: text("study_times"),
  completedLessons: text("completed_lessons"),
  timedWriting: text("timed_writing"),
  isActive: boolean("is_active").default(true),
  emailVerified: boolean("email_verified").default(false),
  joinedDate: datetime("joined_date").notNull(),
  lastLoginAt: datetime("last_login_at"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
})

// Sessions table
export const sessions = mysqlTable("sessions", {
  id: varchar("id", { length: 255 }).primaryKey(),
  userId: int("user_id").notNull(),
  token: text("token").notNull(),
  expiresAt: datetime("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
})

// User stats table
export const userStats = mysqlTable("user_stats", {
  id: int("id").primaryKey(),
  totalXp: int("total_xp").notNull().default(0),
  lessonsCompleted: int("lessons_completed").notNull().default(0),
  joinedDate: datetime("joined_date").notNull(),
  level: int("level").notNull().default(1),
  totalPoints: int("total_points").notNull().default(0),
})

// Languages table
export const languages = mysqlTable("languages", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 10 }).notNull().unique(),
  icon: varchar("icon", { length: 10 }).notNull(),
})

// Lessons table
export const lessons = mysqlTable("lessons", {
  id: int("id").primaryKey(),
  languageId: int("language_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  totalQuestions: int("total_questions").notNull(),
  lessonOrder: int("lesson_order").notNull(),
  difficulty: int("difficulty").notNull().default(1),
  description: text("description").notNull(),
})

// Questions table
export const questions = mysqlTable("questions", {
  id: int("id").primaryKey(),
  lessonId: int("lesson_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  prompt: text("prompt").notNull(),
  options: text("options").notNull(),
  correctAnswer: text("correct_answer").notNull(),
  audioUrl: varchar("audio_url", { length: 500 }),
  imageUrl: varchar("image_url", { length: 500 }),
})

// User progress table
export const userProgress = mysqlTable("user_progress", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  lessonId: int("lesson_id").notNull(),
  questionId: int("question_id").notNull(),
  completed: boolean("completed").notNull(),
  correct: boolean("correct").notNull(),
  timestamp: datetime("timestamp").notNull(),
})

// Achievements table
export const achievements = mysqlTable("achievements", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 100 }).notNull(),
  requirement: text("requirement").notNull(),
  xpReward: int("xp_reward").default(0),
  pointsReward: int("points_reward").default(0),
  category: varchar("category", { length: 50 }),
  rarity: varchar("rarity", { length: 50 }),
})

// User achievements table
export const userAchievements = mysqlTable("user_achievements", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  achievementId: int("achievement_id").notNull(),
  unlocked: boolean("unlocked").notNull().default(false),
  unlockedAt: datetime("unlocked_at"),
  claimed: boolean("claimed").notNull().default(false),
}, (table) => ({
  uniqueUserAchievement: uniqueIndex("unique_user_achievement").on(table.userId, table.achievementId),
}))

// Vocabulary table
export const vocabulary = mysqlTable("vocabulary", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  word: varchar("word", { length: 255 }).notNull(),
  translation: varchar("translation", { length: 255 }).notNull(),
  languageId: int("language_id").notNull(),
  languageCode: varchar("language_code", { length: 10 }).notNull(),
  difficulty: decimal("difficulty", { precision: 3, scale: 2 }).notNull(),
  lastReviewed: datetime("last_reviewed").notNull(),
  nextReview: datetime("next_review").notNull(),
  correctCount: int("correct_count").notNull().default(0),
  incorrectCount: int("incorrect_count").notNull().default(0),
})

// Verbs table - NEW
export const verbs = mysqlTable("verbs", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  baseForm: varchar("base_form", { length: 100 }).notNull(),
  pastSimple: varchar("past_simple", { length: 100 }).notNull(),
  pastParticiple: varchar("past_participle", { length: 100 }).notNull(),
  translation: varchar("translation", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["regular", "irregular"]).notNull().default("regular"),
  languageId: int("language_id").notNull(),
  languageCode: varchar("language_code", { length: 10 }).notNull(),
  difficulty: int("difficulty").notNull().default(1),
  exampleSentence: text("example_sentence"),
  lastReviewed: datetime("last_reviewed").notNull(),
  nextReview: datetime("next_review").notNull(),
  correctCount: int("correct_count").notNull().default(0),
  incorrectCount: int("incorrect_count").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow(),
})

// Challenges table
export const challenges = mysqlTable("challenges", {
  id: int("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  xpReward: int("xp_reward").notNull(),
  requirementCount: int("requirement_count").notNull(),
  expiresAt: datetime("expires_at").notNull(),
})

// User challenges table
export const userChallenges = mysqlTable("user_challenges", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  challengeId: int("challenge_id").notNull(),
  progress: int("progress").notNull().default(0),
  completed: boolean("completed").notNull().default(false),
  completedAt: datetime("completed_at"),
}, (table) => ({
  uniqueUserChallenge: uniqueIndex("unique_user_challenge").on(table.userId, table.challengeId),
}))

// Lesson completions table
export const lessonCompletions = mysqlTable("lesson_completions", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  lessonId: int("lesson_id").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: datetime("completed_at").notNull(),
  score: int("score").notNull(),
  totalQuestions: int("total_questions").notNull(),
  correctAnswers: int("correct_answers").notNull(),
})

// Missions table
export const missions = mysqlTable("missions", {
  id: int("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  requirements: text("requirements").notNull(),
  xpReward: int("xp_reward").notNull(),
  pointsReward: int("points_reward").notNull(),
  badgeId: int("badge_id"),
  expiresAt: datetime("expires_at"),
  missionOrder: int("mission_order").notNull(),
  category: varchar("category", { length: 50 }).notNull(),
})

// User missions table
export const userMissions = mysqlTable("user_missions", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  missionId: int("mission_id").notNull(),
  progress: int("progress").notNull().default(0),
  requirementCount: int("requirement_count").notNull(),
  completed: boolean("completed").notNull().default(false),
  completedAt: datetime("completed_at"),
  claimed: boolean("claimed").notNull().default(false),
}, (table) => ({
  uniqueUserMission: uniqueIndex("unique_user_mission").on(table.userId, table.missionId),
}))

// Badges table
export const badges = mysqlTable("badges", {
  id: int("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  icon: varchar("icon", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  rarity: varchar("rarity", { length: 50 }).notNull(),
})

// User badges table
export const userBadges = mysqlTable("user_badges", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  badgeId: int("badge_id").notNull(),
  earnedAt: datetime("earned_at").notNull(),
  displayed: boolean("displayed").notNull().default(true),
}, (table) => ({
  uniqueUserBadge: uniqueIndex("unique_user_badge").on(table.userId, table.badgeId),
}))

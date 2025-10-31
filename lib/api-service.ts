// API service for client-side code to interact with the server-side API

// Base URL for API requests
const API_BASE_URL = "/api"

// Generic fetch function with error handling
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options)

  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new Error(error.message || `API error: ${response.status}`)
  }

  return response.json()
}

// User API
export const userAPI = {
  // Get user by name
  async getByName(name: string): Promise<any> {
    return fetchAPI(`/users/${name}`)
  },

  // Create new user
  async create(name: string): Promise<any> {
    return fetchAPI("/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    })
  },

  // Update user
  async update(name: string, data: any): Promise<any> {
    return fetchAPI(`/users/${name}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  },

  // Get leaderboard
  async getLeaderboard(): Promise<any[]> {
    return fetchAPI("/users")
  },
}

// Languages API
export const languageAPI = {
  // Get all languages
  async getAll(): Promise<any[]> {
    return fetchAPI("/languages")
  },
}

// Lessons API
export const lessonAPI = {
  // Get lessons by language
  async getByLanguage(languageId: number): Promise<any[]> {
    return fetchAPI(`/lessons?languageId=${languageId}`)
  },

  // Get lesson by ID
  async getById(id: number): Promise<any> {
    return fetchAPI(`/lessons/${id}`)
  },
}

// Questions API
export const questionAPI = {
  // Get questions by lesson
  async getByLesson(lessonId: number): Promise<any[]> {
    return fetchAPI(`/questions?lessonId=${lessonId}`)
  },
}

// Progress API
export const progressAPI = {
  // Save user progress
  async save(data: {
    userId: number
    lessonId: number
    questionId: number
    completed: number
    correct: number
    timestamp?: string
  }): Promise<any> {
    return fetchAPI("/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  },
}

// Vocabulary API
export const vocabularyAPI = {
  // Get user vocabulary
  async getByUser(userId: number): Promise<any[]> {
    return fetchAPI(`/vocabulary?userId=${userId}`)
  },

  // Update vocabulary review
  async updateReview(
    id: number,
    updates: {
      difficulty: number
      lastReviewed: string
      nextReview: string
      correctCount: number
      incorrectCount: number
    },
  ): Promise<any> {
    return fetchAPI(`/vocabulary/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
  },
}

// Challenges API
export const challengeAPI = {
  // Get user challenges
  async getByUser(userId: number): Promise<any[]> {
    return fetchAPI(`/challenges?userId=${userId}`)
  },

  // Complete challenge
  async complete(userId: number, challengeId: number): Promise<any> {
    return fetchAPI(`/challenges/${challengeId}/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
  },
}

// Lesson completions API
export const lessonCompletionAPI = {
  // Complete lesson and save progress
  async complete(data: {
    userId: number
    lessonId: number
    score: number
    totalQuestions: number
    correctAnswers: number
  }): Promise<any> {
    return fetchAPI("/lesson-completions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
  },

  // Get user completed lessons
  async getByUser(userId: number): Promise<any[]> {
    return fetchAPI(`/lesson-completions?userId=${userId}`)
  },

  // Check if lesson is completed
  async isCompleted(userId: number, lessonId: number): Promise<boolean> {
    return fetchAPI(`/lesson-completions/check?userId=${userId}&lessonId=${lessonId}`)
  },
}

// Assessment API
export const assessmentAPI = {
  // Save assessment result
  async saveResult(
    userId: number,
    result: {
      score: number
      level: number
      recommendedLessonId: number
      completedAt: string
      xpAwarded?: number
      autoUnlock?: boolean
      skipped?: boolean
    },
  ): Promise<any> {
    return fetchAPI("/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...result }),
    })
  },

  // Check if assessment is completed or skipped
  async hasCompletedOrSkipped(userId: number): Promise<boolean> {
    return fetchAPI(`/assessment/check?userId=${userId}`)
  },

  // Skip assessment
  async skip(userId: number): Promise<any> {
    return fetchAPI("/assessment/skip", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
  },
}

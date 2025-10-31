// ไฟล์นี้เก็บข้อมูลความท้าทายต่างๆ
import type { Challenge } from "../../database-types"

export function getTomorrowDate(): string {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)
  return tomorrow.toISOString()
}

export const challenges: Challenge[] = [
  {
    id: 1,
    title: "Complete 3 Lessons",
    description: "Complete 3 lessons today to earn bonus XP",
    type: "lesson",
    xpReward: 30,
    requirementCount: 3,
    expiresAt: getTomorrowDate(),
  },
  {
    id: 2,
    title: "Perfect Score",
    description: "Complete a lesson with no mistakes",
    type: "perfect",
    xpReward: 20,
    requirementCount: 1,
    expiresAt: getTomorrowDate(),
  },
  {
    id: 3,
    title: "Vocabulary Master",
    description: "Review 10 vocabulary words",
    type: "vocabulary",
    xpReward: 25,
    requirementCount: 10,
    expiresAt: getTomorrowDate(),
  },
  {
    id: 4,
    title: "Earn 50 XP",
    description: "Earn a total of 50 XP today",
    type: "xp",
    xpReward: 15,
    requirementCount: 50,
    expiresAt: getTomorrowDate(),
  },
]

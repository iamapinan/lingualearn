// ไฟล์นี้ใช้สำหรับจัดการระบบคะแนนในแอปพลิเคชัน

// คำนวณคะแนนจากความยากของด่าน เวลาที่ใช้ และความถูกต้อง
export function calculateScore(difficulty: number, timeSpent: number, isCorrect: boolean): number {
  if (!isCorrect) return 0

  // คะแนนพื้นฐานตามความยาก
  const basePoints = difficulty * 10

  // โบนัสจากเวลา (ตอบเร็วได้คะแนนมากขึ้น)
  let timeBonus = 0
  if (timeSpent < 3) {
    timeBonus = 5 // ตอบเร็วมาก
  } else if (timeSpent < 6) {
    timeBonus = 3 // ตอบเร็ว
  } else if (timeSpent < 10) {
    timeBonus = 1 // ตอบในเวลาปกติ
  }

  return basePoints + timeBonus
}

// คำนวณ XP ที่ได้รับจากการทำด่านเสร็จ
export function calculateLessonCompletionXP(
  difficulty: number,
  correctAnswers: number,
  totalQuestions: number,
  timeBonus: number,
): number {
  // คะแนนพื้นฐานตามความยาก
  const baseXP = difficulty * 20

  // คะแนนตามความแม่นยำ
  const accuracyPercent = (correctAnswers / totalQuestions) * 100
  let accuracyBonus = 0

  if (accuracyPercent === 100) {
    accuracyBonus = 30 // ตอบถูกทุกข้อ
  } else if (accuracyPercent >= 80) {
    accuracyBonus = 20 // ตอบถูกมากกว่า 80%
  } else if (accuracyPercent >= 60) {
    accuracyBonus = 10 // ตอบถูกมากกว่า 60%
  }

  return baseXP + accuracyBonus + timeBonus
}

// คำนวณระดับจาก XP
export function calculateLevelFromXP(xp: number): number {
  // สูตรคำนวณระดับ: ทุก 100 XP = 1 ระดับ
  return Math.floor(xp / 100) + 1
}

// คำนวณ XP ที่ต้องการสำหรับระดับถัดไป
export function calculateXPForNextLevel(currentXP: number): number {
  const currentLevel = calculateLevelFromXP(currentXP)
  const xpForNextLevel = currentLevel * 100
  return xpForNextLevel
}

// คำนวณเปอร์เซ็นต์ความก้าวหน้าไปสู่ระดับถัดไป
export function calculateLevelProgress(currentXP: number): number {
  const currentLevel = calculateLevelFromXP(currentXP)
  const xpForCurrentLevel = (currentLevel - 1) * 100
  const xpForNextLevel = currentLevel * 100
  const xpProgress = currentXP - xpForCurrentLevel
  const xpNeeded = xpForNextLevel - xpForCurrentLevel
  return Math.round((xpProgress / xpNeeded) * 100)
}

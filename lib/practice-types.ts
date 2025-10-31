export type SkillType = "listening" | "speaking" | "reading" | "writing" | "grammar" | "vocabulary"

export type QuestionFormat = "multiple-choice" | "fill-blank" | "dictation" | "speaking" | "free-response"

export type DifficultyLevel = "beginner" | "intermediate" | "advanced"

export interface PracticeExercise {
  id: string
  title: string
  instructions: string
  questionFormat: QuestionFormat
  skillType: SkillType
  difficultyLevel: DifficultyLevel
  timeLimit?: number
  content: {
    question?: string
    passage?: string
    sentence?: string
    options?: string[]
    correctAnswer?: string
    word?: string
    audio?: string
    audioSample?: string
    hint?: string
    allowedErrors?: number
    minWords?: number
    isImageOption?: boolean
    dialogueText?: string
    prompt?: string
    focusSound?: string
    acceptMultiple?: boolean
    suggestedVocabulary?: string[]
    suggestedStructure?: string
  }
  feedback?: {
    correct: string
    incorrect: string
  }
}

export interface ExerciseSet {
  id: string
  title: string
  description: string
  skillType: SkillType
  difficultyLevel: DifficultyLevel
  exercises: PracticeExercise[]
  estimatedTimeMinutes: number
  xpReward: number
}

export interface PracticeExerciseSets {
  [key in SkillType]: ExerciseSet[]
}

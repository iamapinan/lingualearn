"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Check, X } from "lucide-react"

const exercises = [
  {
    id: 1,
    sentence: "The weather is **beautiful** today.",
    word: "beautiful",
    question: "What does 'beautiful' mean in this context?",
    options: ["สวยงาม", "เลวร้าย", "เย็น", "ร้อน"],
    correct: "สวยงาม",
  },
  {
    id: 2,
    sentence: "She is very **intelligent** and always gets good grades.",
    word: "intelligent",
    question: "What does 'intelligent' mean?",
    options: ["ฉลาด", "ขี้เกียจ", "ช้า", "เร็ว"],
    correct: "ฉลาด",
  },
  {
    id: 3,
    sentence: "The weather is quite **pleasant** today for a picnic.",
    word: "pleasant",
    question: "What does 'pleasant' mean?",
    options: ["ร้อน", "หนาว", "น่าพอใจ", "น่าเบื่อ"],
    correct: "น่าพอใจ",
  },
  {
    id: 4,
    sentence: "He was **determined** to finish his homework before dinner.",
    word: "determined",
    question: "What does 'determined' mean?",
    options: ["ยุ่ง", "มุ่งมั่น", "ผ่อนคลาย", "สับสน"],
    correct: "มุ่งมั่น",
  },
  {
    id: 5,
    sentence: "The old house looked very **mysterious** in the moonlight.",
    word: "mysterious",
    question: "What does 'mysterious' mean?",
    options: ["น่ากลัว", "ลึกลับ", "สวยงาม", "ธรรมดา"],
    correct: "ลึกลับ",
  },
]

export default function ReadingVocabularyPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [shuffledExercises, setShuffledExercises] = useState(exercises)

  useEffect(() => {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5)
    setShuffledExercises(shuffled)
  }, [])

  const exercise = shuffledExercises[currentExercise]
  const progress = ((currentExercise + 1) / shuffledExercises.length) * 100

  const checkAnswer = () => {
    if (!selectedAnswer) return
    
    const isCorrect = selectedAnswer === exercise.correct
    if (isCorrect) {
      setScore(score + 1)
    }
    setShowResult(true)
  }

  const nextExercise = () => {
    if (currentExercise < shuffledExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setCompleted(true)
    }
  }

  const highlightWord = (sentence: string, word: string) => {
    const parts = sentence.split("**")
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <span key={index} className="font-bold text-amber-700 underline">{part}</span>
      }
      return part
    })
  }

  if (completed) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">เสร็จสิ้น!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl font-bold text-amber-600">
                {score}/{shuffledExercises.length}
              </div>
              <p className="text-xl">
                คะแนนของคุณ: {Math.round((score / shuffledExercises.length) * 100)}%
              </p>
              <div className="space-x-4">
                <Button onClick={() => window.location.reload()}>
                  ฝึกอีกครั้ง
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/practice/reading"}>
                  กลับไปหน้า Reading
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Vocabulary in Context</h1>
          <p className="text-gray-600 mt-1">เดาความหมายของคำจากบริบท</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{currentExercise + 1} / {shuffledExercises.length}</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exercise {currentExercise + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-amber-50 rounded-lg border-2 border-amber-200">
              <p className="text-xl leading-relaxed text-gray-800">
                {highlightWord(exercise.sentence, exercise.word)}
              </p>
            </div>

            <div className="space-y-3">
              <p className="font-semibold text-lg">{exercise.question}</p>
              
              {exercise.options.map((option) => (
                <button
                  key={option}
                  onClick={() => !showResult && setSelectedAnswer(option)}
                  disabled={showResult}
                  className={`w-full p-4 text-left border rounded-lg transition-all ${
                    selectedAnswer === option
                      ? "border-amber-500 bg-amber-50"
                      : "border-gray-200 hover:border-amber-300"
                  } ${
                    showResult && option === exercise.correct
                      ? "border-green-500 bg-green-50"
                      : showResult && selectedAnswer === option && option !== exercise.correct
                      ? "border-red-500 bg-red-50"
                      : ""
                  } disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && option === exercise.correct && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                    {showResult && selectedAnswer === option && option !== exercise.correct && (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showResult ? (
              <div className="space-y-3">
                {selectedAnswer === exercise.correct ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    ✓ ถูกต้อง!
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    ✗ ไม่ถูกต้อง คำตอบที่ถูกคือ: {exercise.correct}
                  </div>
                )}
                <Button onClick={nextExercise} className="w-full">
                  {currentExercise < shuffledExercises.length - 1 ? "ข้อถัดไป" : "เสร็จสิ้น"}
                </Button>
              </div>
            ) : (
              <Button
                onClick={checkAnswer}
                disabled={!selectedAnswer}
                className="w-full"
              >
                ตรวจคำตอบ
              </Button>
            )}

            <div className="text-center text-sm text-gray-500">
              คะแนน: {score} / {currentExercise + (showResult ? 1 : 0)}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}


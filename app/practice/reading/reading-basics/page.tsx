"use client"

import { useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Check, X } from "lucide-react"

const exercises = [
  {
    id: 1,
    passage: "My name is John. I am a teacher. I teach English at a high school. I love my job very much.",
    question: "What is John's job?",
    options: ["Doctor", "Teacher", "Engineer", "Student"],
    correct: "Teacher",
  },
  {
    id: 2,
    passage: "Sarah goes to the supermarket every Saturday. She buys fruits, vegetables, and milk. She likes shopping in the morning.",
    question: "When does Sarah go to the supermarket?",
    options: ["Every Saturday", "Every Sunday", "Every Monday", "Every Friday"],
    correct: "Every Saturday",
  },
]

export default function ReadingBasicsPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const exercise = exercises[currentExercise]
  const progress = ((currentExercise + 1) / exercises.length) * 100

  const checkAnswer = () => {
    if (!selectedAnswer) return
    
    const isCorrect = selectedAnswer === exercise.correct
    if (isCorrect) {
      setScore(score + 1)
    }
    setShowResult(true)
  }

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setCompleted(true)
    }
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
                {score}/{exercises.length}
              </div>
              <p className="text-xl">
                คะแนนของคุณ: {Math.round((score / exercises.length) * 100)}%
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
          <h1 className="text-3xl font-bold">Reading Comprehension</h1>
          <p className="text-gray-600 mt-1">อ่านบทความและตอบคำถาม</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{currentExercise + 1} / {exercises.length}</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exercise {currentExercise + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-6 bg-amber-50 rounded-lg border-2 border-amber-200">
              <p className="text-lg leading-relaxed text-gray-800">{exercise.passage}</p>
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
                  {currentExercise < exercises.length - 1 ? "ข้อถัดไป" : "เสร็จสิ้น"}
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


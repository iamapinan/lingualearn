"use client"

import { useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Volume2, Check, X } from "lucide-react"

const exercises = [
  {
    id: 1,
    text: "I love learning English",
    hint: "4 words",
  },
  {
    id: 2,
    text: "The weather is beautiful today",
    hint: "5 words",
  },
  {
    id: 3,
    text: "She enjoys reading books",
    hint: "4 words",
  },
]

export default function ListeningDictationPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)

  const exercise = exercises[currentExercise]
  const progress = ((currentExercise + 1) / exercises.length) * 100

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(exercise.text)
    utterance.lang = "en-US"
    utterance.rate = 0.7
    window.speechSynthesis.speak(utterance)
  }

  const checkAnswer = () => {
    const isCorrect = userInput.trim().toLowerCase() === exercise.text.toLowerCase()
    if (isCorrect) {
      setScore(score + 1)
    }
    setShowResult(true)
  }

  const nextExercise = () => {
    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setUserInput("")
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
              <div className="text-6xl font-bold text-indigo-600">
                {score}/{exercises.length}
              </div>
              <p className="text-xl">
                คะแนนของคุณ: {Math.round((score / exercises.length) * 100)}%
              </p>
              <div className="space-x-4">
                <Button onClick={() => window.location.reload()}>
                  ฝึกอีกครั้ง
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/practice/listening"}>
                  กลับไปหน้า Listening
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
          <h1 className="text-3xl font-bold">Dictation Practice</h1>
          <p className="text-gray-600 mt-1">ฟังและพิมพ์สิ่งที่คุณได้ยิน</p>
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
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={playAudio}
                className="bg-indigo-500 hover:bg-indigo-600 h-32 w-32 rounded-full"
              >
                <Volume2 className="h-12 w-12" />
              </Button>
            </div>

            <div className="text-center text-gray-600">
              <p>คลิกเพื่อฟังและพิมพ์สิ่งที่คุณได้ยิน</p>
              <p className="text-sm mt-1">Hint: {exercise.hint}</p>
            </div>

            {!showResult ? (
              <div className="space-y-3">
                <Input
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
                  placeholder="พิมพ์สิ่งที่คุณได้ยิน..."
                  className="text-lg"
                  autoFocus
                />
                <Button
                  onClick={checkAnswer}
                  disabled={!userInput.trim()}
                  className="w-full"
                >
                  ตรวจคำตอบ
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 border rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">คำตอบของคุณ:</p>
                  <p className={`text-lg ${
                    userInput.trim().toLowerCase() === exercise.text.toLowerCase()
                      ? "text-green-600"
                      : "text-red-600"
                  }`}>
                    {userInput}
                  </p>
                </div>

                {userInput.trim().toLowerCase() === exercise.text.toLowerCase() ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 flex items-center gap-2">
                    <Check className="h-5 w-5" />
                    <span>ถูกต้อง!</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-2">
                      <X className="h-5 w-5" />
                      <span>ไม่ถูกต้อง</span>
                    </div>
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm text-gray-600 mb-1">คำตอบที่ถูกต้อง:</p>
                      <p className="text-lg text-blue-900">{exercise.text}</p>
                    </div>
                  </div>
                )}

                <Button onClick={nextExercise} className="w-full">
                  {currentExercise < exercises.length - 1 ? "ข้อถัดไป" : "เสร็จสิ้น"}
                </Button>
              </div>
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


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Verb } from "@/lib/database-types"

interface VerbPracticeProps {
  verbs: Verb[]
  onComplete: () => void
}

export function VerbPractice({ verbs, onComplete }: VerbPracticeProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState<{
    show: boolean
    correct: boolean
    message: string
  }>({ show: false, correct: false, message: "" })
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const currentVerb = verbs[currentIndex]

  const checkAnswer = async () => {
    if (!currentVerb) return

    const correct = userAnswer.toLowerCase().trim() === currentVerb.pastSimple.toLowerCase()

    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }))

    setFeedback({
      show: true,
      correct,
      message: correct
        ? "ถูกต้อง!"
        : `ไม่ถูกต้อง คำตอบที่ถูกต้องคือ: ${currentVerb.pastSimple}`,
    })

    try {
      const token = localStorage.getItem("lingualearn_token")
      await fetch("/api/verbs/practice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          verbId: currentVerb.id,
          correct,
        }),
      })
    } catch (error) {
      console.error("Failed to save practice result:", error)
    }
  }

  const nextQuestion = () => {
    if (currentIndex < verbs.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer("")
      setFeedback({ show: false, correct: false, message: "" })
    } else {
      onComplete()
    }
  }

  if (!currentVerb) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>ไม่มี verbs สำหรับฝึกฝน</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>ฝึกฝน Verbs</CardTitle>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {verbs.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg text-center">
          <p className="text-sm text-gray-600 mb-2">เปลี่ยนเป็น Past Simple:</p>
          <p className="text-3xl font-bold text-indigo-600">{currentVerb.baseForm}</p>
          <p className="text-sm text-gray-500 mt-2">{currentVerb.translation}</p>
        </div>

        {!feedback.show ? (
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="พิมพ์คำตอบของคุณ"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && checkAnswer()}
              className="text-center text-lg"
              autoFocus
            />
            <Button
              onClick={checkAnswer}
              className="w-full bg-indigo-500 hover:bg-indigo-600"
              disabled={!userAnswer.trim()}
            >
              ตรวจคำตอบ
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert variant={feedback.correct ? "default" : "destructive"}>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">รูปแบบทั้งหมด:</p>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="text-xs text-gray-500">Base</p>
                  <p className="font-medium">{currentVerb.baseForm}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Past Simple</p>
                  <p className="font-medium">{currentVerb.pastSimple}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Past Participle</p>
                  <p className="font-medium">{currentVerb.pastParticiple}</p>
                </div>
              </div>
            </div>

            <Button onClick={nextQuestion} className="w-full bg-indigo-500 hover:bg-indigo-600">
              {currentIndex < verbs.length - 1 ? "ข้อถัดไป" : "เสร็จสิ้น"}
            </Button>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>คะแนน:</span>
            <span className="font-semibold">
              {score.correct} / {score.total}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


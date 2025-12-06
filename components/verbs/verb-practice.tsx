"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { Verb } from "@/lib/database-types"

type PracticeMode = "pastSimple" | "pastParticiple" | "mixed" | "allThree"
type QuestionType = "pastSimple" | "pastParticiple" | "baseForm"

interface VerbPracticeProps {
  verbs: Verb[]
  onComplete: (score: { correct: number; total: number }) => void
  mode: PracticeMode
}

interface Question {
  verb: Verb
  questionType: QuestionType
  prompt: string
  answer: string
}

export function VerbPractice({ verbs, onComplete, mode }: VerbPracticeProps) {
  const [questions] = useState<Question[]>(() => generateQuestions(verbs, mode))
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [feedback, setFeedback] = useState<{
    show: boolean
    correct: boolean
    message: string
  }>({ show: false, correct: false, message: "" })
  const [score, setScore] = useState({ correct: 0, total: 0 })

  const currentQuestion = questions[currentIndex]

  function generateQuestions(verbs: Verb[], mode: PracticeMode): Question[] {
    const questions: Question[] = []
    
    for (const verb of verbs) {
      if (mode === "pastSimple") {
        questions.push({
          verb,
          questionType: "pastSimple",
          prompt: "เปลี่ยนเป็น Past Simple",
          answer: verb.pastSimple,
        })
      } else if (mode === "pastParticiple") {
        questions.push({
          verb,
          questionType: "pastParticiple",
          prompt: "เปลี่ยนเป็น Past Participle",
          answer: verb.pastParticiple,
        })
      } else if (mode === "mixed") {
        const type = Math.random() > 0.5 ? "pastSimple" : "pastParticiple"
        questions.push({
          verb,
          questionType: type,
          prompt: type === "pastSimple" ? "เปลี่ยนเป็น Past Simple" : "เปลี่ยนเป็น Past Participle",
          answer: type === "pastSimple" ? verb.pastSimple : verb.pastParticiple,
        })
      } else if (mode === "allThree") {
        const types: QuestionType[] = ["pastSimple", "pastParticiple", "baseForm"]
        for (const type of types) {
          if (type === "baseForm") {
            questions.push({
              verb,
              questionType: type,
              prompt: "เปลี่ยนเป็น Base Form",
              answer: verb.baseForm,
            })
          } else if (type === "pastSimple") {
            questions.push({
              verb,
              questionType: type,
              prompt: "เปลี่ยนเป็น Past Simple",
              answer: verb.pastSimple,
            })
          } else {
            questions.push({
              verb,
              questionType: type,
              prompt: "เปลี่ยนเป็น Past Participle",
              answer: verb.pastParticiple,
            })
          }
        }
      }
    }
    
    return questions.sort(() => Math.random() - 0.5)
  }

  const getQuestionForm = () => {
    if (!currentQuestion) return ""
    const { verb, questionType } = currentQuestion
    
    if (questionType === "pastSimple") {
      return verb.baseForm
    } else if (questionType === "pastParticiple") {
      return verb.baseForm
    } else {
      const forms = [verb.pastSimple, verb.pastParticiple]
      return forms[Math.floor(Math.random() * forms.length)]
    }
  }

  const checkAnswer = async (answerOverride?: string, isGiveUp = false) => {
    if (!currentQuestion) return

    const answerToCheck = answerOverride || userAnswer
    const correct = !isGiveUp && answerToCheck.toLowerCase().trim() === currentQuestion.answer.toLowerCase()

    setScore((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      total: prev.total + 1,
    }))

    setFeedback({
      show: true,
      correct,
      message: correct
        ? "ถูกต้อง!"
        : isGiveUp 
          ? `เฉลย: ${currentQuestion.answer}`
          : `ไม่ถูกต้อง คำตอบที่ถูกต้องคือ: ${currentQuestion.answer}`,
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
          verbId: currentQuestion.verb.id,
          correct,
        }),
      })
    } catch (error) {
      console.error("Failed to save practice result:", error)
    }
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer("")
      setFeedback({ show: false, correct: false, message: "" })
    } else {
      onComplete(score)
    }
  }

  if (!currentQuestion) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p>ไม่มี verbs สำหรับฝึกฝน</p>
        </CardContent>
      </Card>
    )
  }

  const getModeLabel = () => {
    switch (mode) {
      case "pastSimple": return "Past Simple (V2)"
      case "pastParticiple": return "Past Participle (V3)"
      case "mixed": return "Mixed (V2 & V3)"
      case "allThree": return "Three Forms (V1, V2, V3)"
      default: return "Verbs"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>ฝึกฝน {getModeLabel()}</CardTitle>
          <span className="text-sm text-gray-600">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg text-center border-2 border-indigo-200">
          <p className="text-sm text-gray-700 mb-2">{currentQuestion.prompt}:</p>
          <p className="text-3xl font-bold text-indigo-600 mb-2">{getQuestionForm()}</p>
          <p className="text-sm text-gray-600 italic">{currentQuestion.verb.translation}</p>
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
            <div className="flex gap-3">
              <Button
                onClick={() => checkAnswer()}
                className="flex-1 bg-indigo-500 hover:bg-indigo-600"
                disabled={!userAnswer.trim()}
              >
                ตรวจคำตอบ
              </Button>
              <Button
                onClick={() => {
                  setUserAnswer(currentQuestion.answer) // Fill answer so checkAnswer marks it wrong but shows feedback
                  // We need to handle this carefully. 
                  // If we just set state, checkAnswer won't see it immediately due to closure/async state.
                  // Better to call a separate function or pass the answer to checkAnswer.
                  // Let's modify checkAnswer to accept an optional answer override.
                  checkAnswer(currentQuestion.answer, true) 
                }}
                variant="outline"
                className="px-4"
              >
                ไม่ทราบ
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <Alert variant={feedback.correct ? "default" : "destructive"}>
              <AlertDescription>{feedback.message}</AlertDescription>
            </Alert>

            <div className="p-4 bg-gray-50 rounded-lg border">
              <p className="text-sm text-gray-600 mb-3 font-semibold">รูปแบบทั้งหมด:</p>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-2 bg-white rounded border">
                  <p className="text-xs text-gray-500 mb-1">V1 (Base)</p>
                  <p className="font-semibold text-blue-600">{currentQuestion.verb.baseForm}</p>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <p className="text-xs text-gray-500 mb-1">V2 (Past)</p>
                  <p className="font-semibold text-green-600">{currentQuestion.verb.pastSimple}</p>
                </div>
                <div className="text-center p-2 bg-white rounded border">
                  <p className="text-xs text-gray-500 mb-1">V3 (Past Participle)</p>
                  <p className="font-semibold text-purple-600">{currentQuestion.verb.pastParticiple}</p>
                </div>
              </div>
              {currentQuestion.verb.exampleSentence && (
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs text-gray-500">ตัวอย่าง:</p>
                  <p className="text-sm text-gray-700 italic">{currentQuestion.verb.exampleSentence}</p>
                </div>
              )}
            </div>

            <Button onClick={nextQuestion} className="w-full bg-indigo-500 hover:bg-indigo-600">
              {currentIndex < questions.length - 1 ? "ข้อถัดไป" : "เสร็จสิ้น"}
            </Button>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex justify-between text-sm">
            <span>คะแนน:</span>
            <span className="font-semibold text-indigo-600">
              {score.correct} / {score.total} ({score.total > 0 ? Math.round((score.correct / score.total) * 100) : 0}%)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}



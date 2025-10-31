"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Exercise {
  id: number
  incorrectSentence: string
  correctSentence: string
  errorType: string
  explanation: string
}

const exercises: Exercise[] = [
  {
    id: 1,
    incorrectSentence: "She don't like coffee.",
    correctSentence: "She doesn't like coffee.",
    errorType: "Subject-Verb Agreement",
    explanation: "ใช้ doesn't กับประธานเอกพจน์บุรุคที่ 3 (he, she, it)"
  },
  {
    id: 2,
    incorrectSentence: "I am study English every day.",
    correctSentence: "I study English every day.",
    errorType: "Verb Tense",
    explanation: "ใช้ present simple ไม่ใช่ present continuous สำหรับกิจวัตรประจำวัน"
  },
  {
    id: 3,
    incorrectSentence: "He go to school yesterday.",
    correctSentence: "He went to school yesterday.",
    errorType: "Verb Tense",
    explanation: "ใช้ past tense (went) เพราะมีคำว่า yesterday"
  },
  {
    id: 4,
    incorrectSentence: "There is many students in the classroom.",
    correctSentence: "There are many students in the classroom.",
    errorType: "Subject-Verb Agreement",
    explanation: "ใช้ are กับนามพหูพจน์ (students)"
  },
  {
    id: 5,
    incorrectSentence: "I have buy a new car.",
    correctSentence: "I have bought a new car.",
    errorType: "Perfect Tense",
    explanation: "ใช้ past participle (bought) กับ present perfect tense"
  },
  {
    id: 6,
    incorrectSentence: "She can speaks English very well.",
    correctSentence: "She can speak English very well.",
    errorType: "Modal Verb",
    explanation: "หลัง modal verb (can) ตามด้วยกริยาช่องที่ 1 ไม่ต้องเติม s"
  },
  {
    id: 7,
    incorrectSentence: "I am more tall than my brother.",
    correctSentence: "I am taller than my brother.",
    errorType: "Comparative Form",
    explanation: "คำคุณศัพท์สั้นๆ เติม -er ไม่ใช้ more"
  },
  {
    id: 8,
    incorrectSentence: "We was at the park last Sunday.",
    correctSentence: "We were at the park last Sunday.",
    errorType: "Subject-Verb Agreement",
    explanation: "ใช้ were กับประธานพหูพจน์ (we)"
  },
  {
    id: 9,
    incorrectSentence: "He don't have any money.",
    correctSentence: "He doesn't have any money.",
    errorType: "Subject-Verb Agreement",
    explanation: "ใช้ doesn't กับประธานเอกพจน์บุรุคที่ 3 (he)"
  },
  {
    id: 10,
    incorrectSentence: "I am boring in this class.",
    correctSentence: "I am bored in this class.",
    errorType: "Participle Adjective",
    explanation: "ใช้ bored (รู้สึกเบื่อ) ไม่ใช่ boring (น่าเบื่อ)"
  }
]

export default function ErrorCorrectionPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])

  const currentExercise = exercises[currentIndex]
  const progress = ((answeredQuestions.length) / exercises.length) * 100

  const normalizeAnswer = (text: string) => {
    return text.toLowerCase().trim().replace(/[.,!?]/g, "")
  }

  const checkAnswer = () => {
    const normalized = normalizeAnswer(userAnswer)
    const correctAnswer = normalizeAnswer(currentExercise.correctSentence)
    const correct = normalized === correctAnswer
    
    setIsCorrect(correct)
    setShowResult(true)
    
    if (correct && !answeredQuestions.includes(currentExercise.id)) {
      setScore(score + 10)
      setAnsweredQuestions([...answeredQuestions, currentExercise.id])
    }
  }

  const nextQuestion = () => {
    if (currentIndex < exercises.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setUserAnswer("")
      setShowResult(false)
    } else {
      setCompleted(true)
    }
  }

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setUserAnswer("")
      setShowResult(false)
    }
  }

  const restart = () => {
    setCurrentIndex(0)
    setUserAnswer("")
    setShowResult(false)
    setIsCorrect(false)
    setScore(0)
    setCompleted(false)
    setAnsweredQuestions([])
  }

  if (completed) {
    const percentage = Math.round((score / (exercises.length * 10)) * 100)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
        <div className="mx-auto max-w-2xl pt-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-orange-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                <CardTitle className="text-center text-2xl">
                  🎉 เสร็จสิ้นการฝึกแก้ไขข้อผิดพลาด!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="mb-4 text-6xl font-bold text-orange-600">
                    {percentage}%
                  </div>
                  <div className="text-2xl text-gray-700">
                    คะแนน: {score}/{exercises.length * 10}
                  </div>
                  <div className="mt-2 text-gray-600">
                    ตอบถูก: {answeredQuestions.length}/{exercises.length} ข้อ
                  </div>
                </div>

                <div className="mb-6">
                  {percentage >= 80 ? (
                    <Badge className="bg-green-500 text-lg px-4 py-2">
                      ยอดเยี่ยม! 🌟
                    </Badge>
                  ) : percentage >= 60 ? (
                    <Badge className="bg-blue-500 text-lg px-4 py-2">
                      ดีมาก! 👍
                    </Badge>
                  ) : (
                    <Badge className="bg-orange-500 text-lg px-4 py-2">
                      ฝึกฝนต่อไป! 💪
                    </Badge>
                  )}
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={restart}
                    size="lg"
                    className="bg-gradient-to-r from-orange-500 to-red-500"
                  >
                    ฝึกใหม่อีกครั้ง
                  </Button>
                  <Link href="/practice/writing">
                    <Button size="lg" variant="outline">
                      กลับไปหน้าฝึกเขียน
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-pink-50 p-4">
      <div className="mx-auto max-w-4xl pt-8">
        <div className="mb-6 flex items-center justify-between">
          <Link href="/practice/writing">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              กลับ
            </Button>
          </Link>
          <div className="text-right">
            <div className="text-sm text-gray-600">คะแนน</div>
            <div className="text-2xl font-bold text-orange-600">{score}</div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>ฝึกแก้ไขข้อผิดพลาด</CardTitle>
              <Badge variant="outline">
                {currentIndex + 1} / {exercises.length}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="mb-4" />
          </CardContent>
        </Card>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -100, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-2 border-orange-200 shadow-lg">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="mb-6">
                    <div className="flex items-start gap-2 mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                      <div className="flex-1">
                        <div className="font-medium text-red-800 mb-1">
                          ประโยคที่มีข้อผิดพลาด:
                        </div>
                        <div className="text-lg text-red-700">
                          {currentExercise.incorrectSentence}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      แก้ไขประโยคให้ถูกต้อง:
                    </div>
                  </div>

                  <div className="mb-4">
                    <Textarea
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      placeholder="พิมพ์ประโยคที่แก้ไขแล้วที่นี่..."
                      className="text-lg min-h-[100px]"
                      disabled={showResult}
                    />
                  </div>

                  {!showResult && (
                    <div className="flex gap-2 justify-center mb-4">
                      <Button
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        className="bg-gradient-to-r from-orange-500 to-red-500"
                      >
                        ตรวจคำตอบ
                      </Button>
                    </div>
                  )}

                  {showResult && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="space-y-4"
                    >
                      <div
                        className={`p-4 rounded-lg border-2 ${
                          isCorrect
                            ? "bg-green-50 border-green-200"
                            : "bg-red-50 border-red-200"
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="h-6 w-6 text-green-600" />
                              <span className="font-semibold text-green-800">
                                ถูกต้อง!
                              </span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-6 w-6 text-red-600" />
                              <span className="font-semibold text-red-800">
                                ไม่ถูกต้อง
                              </span>
                            </>
                          )}
                        </div>
                        {!isCorrect && (
                          <div className="text-gray-700">
                            <div className="mb-2">
                              <div className="text-sm text-gray-600">คำตอบของคุณ:</div>
                              <div className="font-medium">{userAnswer}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-600">คำตอบที่ถูกต้อง:</div>
                              <div className="font-medium text-green-600">
                                {currentExercise.correctSentence}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="font-medium text-orange-800 mb-2">
                          ประเภทข้อผิดพลาด:
                        </div>
                        <Badge className="bg-orange-500 mb-3">
                          {currentExercise.errorType}
                        </Badge>
                        <div className="text-orange-700">
                          {currentExercise.explanation}
                        </div>
                      </div>

                      <div className="flex gap-2 justify-center">
                        {currentIndex > 0 && (
                          <Button onClick={previousQuestion} variant="outline">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            ข้อก่อนหน้า
                          </Button>
                        )}
                        <Button
                          onClick={nextQuestion}
                          className="bg-gradient-to-r from-orange-500 to-red-500"
                        >
                          {currentIndex < exercises.length - 1 ? (
                            <>
                              ข้อถัดไป
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </>
                          ) : (
                            "เสร็จสิ้น"
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

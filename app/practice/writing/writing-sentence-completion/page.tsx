"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ArrowRight, CheckCircle2, XCircle, Lightbulb } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Exercise {
  id: number
  sentence: string
  answer: string
  hint: string
  translation: string
}

const exercises: Exercise[] = [
  {
    id: 1,
    sentence: "I ___ to school every day.",
    answer: "go",
    hint: "คำกริยาที่แสดงการเคลื่อนที่",
    translation: "ฉันไปโรงเรียนทุกวัน"
  },
  {
    id: 2,
    sentence: "She ___ a book right now.",
    answer: "is reading",
    hint: "Present continuous tense",
    translation: "เธอกำลังอ่านหนังสืออยู่ตอนนี้"
  },
  {
    id: 3,
    sentence: "They ___ soccer yesterday.",
    answer: "played",
    hint: "Past simple tense",
    translation: "พวกเขาเล่นฟุตบอลเมื่อวานนี้"
  },
  {
    id: 4,
    sentence: "We ___ dinner at 7 PM every evening.",
    answer: "have",
    hint: "คำกริยาที่แสดงกิจวัตร",
    translation: "เรากินอาหารเย็นเวลา 7 โมงเย็นทุกวัน"
  },
  {
    id: 5,
    sentence: "He ___ to Paris last summer.",
    answer: "went",
    hint: "Past tense ของ 'go'",
    translation: "เขาไปปารีสเมื่อฤดูร้อนที่แล้ว"
  },
  {
    id: 6,
    sentence: "I ___ my homework before dinner.",
    answer: "do",
    hint: "คำกริยาที่แสดงการกระทำ",
    translation: "ฉันทำการบ้านก่อนทานอาหารเย็น"
  },
  {
    id: 7,
    sentence: "She ___ to music while studying.",
    answer: "listens",
    hint: "Present simple, third person",
    translation: "เธอฟังเพลงขณะเรียน"
  },
  {
    id: 8,
    sentence: "They ___ a movie last night.",
    answer: "watched",
    hint: "Past tense ของ 'watch'",
    translation: "พวกเขาดูหนังเมื่อคืนนี้"
  },
  {
    id: 9,
    sentence: "We ___ to the beach next weekend.",
    answer: "will go",
    hint: "Future tense",
    translation: "เราจะไปชายหาดสุดสัปดาห์หน้า"
  },
  {
    id: 10,
    sentence: "He ___ English for three years.",
    answer: "has studied",
    hint: "Present perfect tense",
    translation: "เขาเรียนภาษาอังกฤษมา 3 ปีแล้ว"
  }
]

export default function SentenceCompletionPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<number[]>([])

  const currentExercise = exercises[currentIndex]
  const progress = ((answeredQuestions.length) / exercises.length) * 100

  const normalizeAnswer = (text: string) => {
    return text.toLowerCase().trim().replace(/[.,!?]/g, "")
  }

  const checkAnswer = () => {
    const normalized = normalizeAnswer(userAnswer)
    const correctAnswer = normalizeAnswer(currentExercise.answer)
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
      setShowHint(false)
    } else {
      setCompleted(true)
    }
  }

  const previousQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setUserAnswer("")
      setShowResult(false)
      setShowHint(false)
    }
  }

  const restart = () => {
    setCurrentIndex(0)
    setUserAnswer("")
    setShowResult(false)
    setIsCorrect(false)
    setScore(0)
    setShowHint(false)
    setCompleted(false)
    setAnsweredQuestions([])
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && userAnswer && !showResult) {
      checkAnswer()
    }
  }

  if (completed) {
    const percentage = Math.round((score / (exercises.length * 10)) * 100)
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
        <div className="mx-auto max-w-2xl pt-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-purple-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-blue-500 text-white">
                <CardTitle className="text-center text-2xl">
                  🎉 เสร็จสิ้นการฝึกเติมคำในประโยค!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <div className="mb-4 text-6xl font-bold text-purple-600">
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
                    className="bg-gradient-to-r from-purple-500 to-blue-500"
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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 p-4">
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
            <div className="text-2xl font-bold text-purple-600">{score}</div>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>ฝึกเติมคำในประโยค</CardTitle>
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
            <Card className="border-2 border-purple-200 shadow-lg">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="mb-4 text-center">
                    <div className="text-sm text-gray-600 mb-2">
                      เติมคำที่เหมาะสมลงในช่องว่าง
                    </div>
                    <div className="text-2xl font-medium text-gray-800">
                      {currentExercise.sentence}
                    </div>
                  </div>

                  <div className="mb-4">
                    <Input
                      value={userAnswer}
                      onChange={(e) => setUserAnswer(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="พิมพ์คำตอบที่นี่..."
                      className="text-lg text-center"
                      disabled={showResult}
                    />
                  </div>

                  {!showResult && (
                    <div className="flex gap-2 justify-center mb-4">
                      <Button
                        onClick={checkAnswer}
                        disabled={!userAnswer}
                        className="bg-gradient-to-r from-purple-500 to-blue-500"
                      >
                        ตรวจคำตอบ
                      </Button>
                      <Button
                        onClick={() => setShowHint(!showHint)}
                        variant="outline"
                      >
                        <Lightbulb className="mr-2 h-4 w-4" />
                        {showHint ? "ซ่อนคำใบ้" : "แสดงคำใบ้"}
                      </Button>
                    </div>
                  )}

                  {showHint && !showResult && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                    >
                      <div className="flex items-start gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-600 mt-0.5" />
                        <div>
                          <div className="font-medium text-yellow-800">คำใบ้:</div>
                          <div className="text-yellow-700">{currentExercise.hint}</div>
                        </div>
                      </div>
                    </motion.div>
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
                            <div>คำตอบของคุณ: <span className="font-medium">{userAnswer}</span></div>
                            <div>คำตอบที่ถูกต้อง: <span className="font-medium text-green-600">{currentExercise.answer}</span></div>
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="font-medium text-blue-800 mb-1">
                          คำแปล:
                        </div>
                        <div className="text-blue-700">
                          {currentExercise.translation}
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
                          className="bg-gradient-to-r from-purple-500 to-blue-500"
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

"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Volume2, Check, X, Globe } from "lucide-react"

const accentExercises = [
  {
    id: 1,
    accent: "British",
    country: "🇬🇧 United Kingdom",
    text: "I can't believe it. The queue is quite long today.",
    question: "What does 'queue' mean?",
    options: ["รถ", "คิว/แถว", "คำถาม", "ของขวัญ"],
    correct: "คิว/แถว",
    hint: "In British English, 'queue' means waiting in line.",
  },
  {
    id: 2,
    accent: "American",
    country: "🇺🇸 United States",
    text: "Let me grab my elevator to go upstairs.",
    question: "What does 'elevator' mean?",
    options: ["บันได", "ลิฟต์", "ประตู", "หน้าต่าง"],
    correct: "ลิฟต์",
    hint: "Americans say 'elevator', British say 'lift'.",
  },
  {
    id: 3,
    accent: "Australian",
    country: "🇦🇺 Australia",
    text: "G'day mate! Fancy a cuppa in the arvo?",
    question: "What does 'arvo' mean?",
    options: ["เช้า", "เที่ยง", "บ่าย", "เย็น"],
    correct: "บ่าย",
    hint: "Australian slang for 'afternoon'.",
  },
  {
    id: 4,
    accent: "Canadian",
    country: "🇨🇦 Canada",
    text: "I left my tuque in the house. It's a chilly day, eh?",
    question: "What does 'tuque' mean?",
    options: ["รองเท้า", "หมวก", "เสื้อ", "กระเป๋า"],
    correct: "หมวก",
    hint: "Canadian word for 'beanie' or 'winter hat'.",
  },
  {
    id: 5,
    accent: "Indian",
    country: "🇮🇳 India",
    text: "Could you please prepone the meeting to tomorrow?",
    question: "What does 'prepone' mean?",
    options: ["เลื่อนออกไป", "ยกเลิก", "เลื่อนมาเร็วขึ้น", "ยืนยัน"],
    correct: "เลื่อนมาเร็วขึ้น",
    hint: "Opposite of 'postpone' in Indian English.",
  },
  {
    id: 6,
    accent: "Irish",
    country: "🇮🇪 Ireland",
    text: "The crack was mighty last night at the pub.",
    question: "What does 'crack' mean here?",
    options: ["เสียงแตก", "ปัญหา", "ความสนุก", "การแทง"],
    correct: "ความสนุก",
    hint: "Irish slang for fun and entertainment.",
  },
  {
    id: 7,
    accent: "South African",
    country: "🇿🇦 South Africa",
    text: "Howzit! I'm just popping to the shop for some biltong.",
    question: "What is 'biltong'?",
    options: ["ขนม", "เนื้อแห้ง", "ขนมปัง", "น้ำ"],
    correct: "เนื้อแห้ง",
    hint: "Traditional South African dried meat.",
  },
]

export default function ListeningAccentsPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [shuffledExercises, setShuffledExercises] = useState(accentExercises)

  useEffect(() => {
    const shuffled = [...accentExercises].sort(() => Math.random() - 0.5)
    setShuffledExercises(shuffled)
  }, [])

  const exercise = shuffledExercises[currentExercise]
  const progress = ((currentExercise + 1) / shuffledExercises.length) * 100

  const playAudio = async () => {
    setIsPlaying(true)
    
    const utterance = new SpeechSynthesisUtterance(exercise.text)
    utterance.lang = "en-US"
    utterance.rate = 0.7
    utterance.pitch = 1.0
    
    await new Promise((resolve) => {
      utterance.onend = resolve
      window.speechSynthesis.speak(utterance)
    })
    
    setIsPlaying(false)
  }

  const checkAnswer = () => {
    if (!selectedAnswer) return
    
    const isCorrect = selectedAnswer === exercise.correct
    if (isCorrect) {
      setScore(score + 1)
    }
    setShowResult(true)
    setShowHint(true)
  }

  const nextExercise = () => {
    if (currentExercise < shuffledExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setShowHint(false)
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
                {score}/{shuffledExercises.length}
              </div>
              <p className="text-xl">
                คะแนนของคุณ: {Math.round((score / shuffledExercises.length) * 100)}%
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
          <h1 className="text-3xl font-bold">Accent Training</h1>
          <p className="text-gray-600 mt-1">ฝึกฟังสำเนียงภาษาอังกฤษจากทั่วโลก</p>
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
            <div className="flex items-center gap-3">
              <Globe className="h-6 w-6 text-indigo-600" />
              <div>
                <CardTitle>{exercise.accent} English</CardTitle>
                <p className="text-sm text-gray-500 mt-1">{exercise.country}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={playAudio}
                disabled={isPlaying}
                className="bg-indigo-500 hover:bg-indigo-600 h-32 w-32 rounded-full"
              >
                <Volume2 className="h-12 w-12" />
              </Button>
            </div>

            <div className="text-center text-gray-600">
              <p>{isPlaying ? "กำลังเล่นเสียง..." : "คลิกปุ่มเพื่อฟังสำเนียง"}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="font-semibold text-gray-700 mb-2">ประโยคที่พูด:</p>
              <p className="text-gray-800 text-lg italic">{exercise.text}</p>
            </div>

            <div className="space-y-3">
              <p className="font-semibold">{exercise.question}</p>
              
              {exercise.options.map((option) => (
                <button
                  key={option}
                  onClick={() => !showResult && setSelectedAnswer(option)}
                  disabled={showResult}
                  className={`w-full p-4 text-left border rounded-lg transition-all ${
                    selectedAnswer === option
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
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

            {showResult && showHint && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <span className="font-semibold">💡 Tip:</span> {exercise.hint}
                </p>
              </div>
            )}

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


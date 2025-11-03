"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Volume2, Check, X } from "lucide-react"

const exercises = [
  {
    id: 1,
    audio: "hello",
    text: "Hello",
    options: ["Hello", "Help", "Hill", "Hall"],
    correct: "Hello",
  },
  {
    id: 2,
    audio: "thank-you",
    text: "Thank you",
    options: ["Thank you", "Think you", "Tank you", "Thanks"],
    correct: "Thank you",
  },
  {
    id: 3,
    audio: "good-morning",
    text: "Good morning",
    options: ["Good morning", "Good evening", "Good night", "Good afternoon"],
    correct: "Good morning",
  },
  {
    id: 4,
    audio: "how-are-you",
    text: "How are you?",
    options: ["How are you?", "Who are you?", "Where are you?", "What are you?"],
    correct: "How are you?",
  },
  {
    id: 5,
    audio: "nice-to-meet-you",
    text: "Nice to meet you",
    options: ["Nice to meet you", "Nice to see you", "Glad to meet you", "Happy to meet you"],
    correct: "Nice to meet you",
  },
  {
    id: 6,
    audio: "goodbye",
    text: "Goodbye",
    options: ["Goodbye", "Good day", "Good luck", "Good job"],
    correct: "Goodbye",
  },
  {
    id: 7,
    audio: "please",
    text: "Please",
    options: ["Please", "Peace", "Price", "Place"],
    correct: "Please",
  },
  {
    id: 8,
    audio: "sorry",
    text: "Sorry",
    options: ["Sorry", "Starry", "Story", "Stare"],
    correct: "Sorry",
  },
  {
    id: 9,
    audio: "excuse-me",
    text: "Excuse me",
    options: ["Excuse me", "Excuse him", "Excuse her", "Excuse us"],
    correct: "Excuse me",
  },
  {
    id: 10,
    audio: "you-are-welcome",
    text: "You are welcome",
    options: ["You are welcome", "You are coming", "You are going", "You are leaving"],
    correct: "You are welcome",
  },
]

export default function ListeningBasicsPage() {
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

  const playAudio = () => {
    const utterance = new SpeechSynthesisUtterance(exercise.text)
    utterance.lang = "en-US"
    utterance.rate = 0.8
    window.speechSynthesis.speak(utterance)
  }

  const checkAnswer = () => {
    if (!selectedAnswer) return
    
    const isCorrect = selectedAnswer === exercise.correct
    if (isCorrect) {
      setScore(score + 1)
    }
    setShowResult(true)
  }

  const nextExercise = async () => {
    if (currentExercise < shuffledExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setCompleted(true)
      
      // Award XP when completed
      try {
        const userStr = localStorage.getItem("lingualearn_user")
        if (userStr) {
          const user = JSON.parse(userStr)
          const { updateUserStats } = await import("@/lib/database")
          
          // Award XP: 3 XP per correct answer
          const xpEarned = score * 3
          
          if (xpEarned > 0) {
            await updateUserStats({
              totalXp: (user.totalXp || 0) + xpEarned,
              totalPoints: (user.totalPoints || 0) + xpEarned,
            })

            const updatedUser = {
              ...user,
              totalXp: (user.totalXp || 0) + xpEarned,
              totalPoints: (user.totalPoints || 0) + xpEarned,
            }
            localStorage.setItem("lingualearn_user", JSON.stringify(updatedUser))
            
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("userUpdated"))
            }
          }
        }
      } catch (error) {
        console.error("Error awarding XP:", error)
      }
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
          <h1 className="text-3xl font-bold">Basic Listening Comprehension</h1>
          <p className="text-gray-600 mt-1">ฟังและเลือกคำที่ถูกต้อง</p>
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
              <p>คลิกปุ่มเพื่อฟังเสียง</p>
            </div>

            <div className="space-y-3">
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


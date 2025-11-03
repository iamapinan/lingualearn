"use client"

import { useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Volume2, Check, X, Gauge } from "lucide-react"

const speedExercises = [
  {
    id: 1,
    speed: "Normal Speed (70 WPM)",
    rate: 0.7,
    text: "The weather is beautiful today. I think we should go to the park. We can bring a picnic lunch. It will be fun to spend time outside.",
    question: "What should they do?",
    options: ["Stay home", "Go to the park", "Go shopping", "Visit friends"],
    correct: "Go to the park",
  },
  {
    id: 2,
    speed: "Fast Speed (85 WPM)",
    rate: 0.85,
    text: "I need to buy groceries for dinner tonight. I'll stop at the supermarket on my way home. We need milk, bread, and some vegetables for the soup.",
    question: "Where will they buy groceries?",
    options: ["At a restaurant", "At the supermarket", "At a friend's house", "Online"],
    correct: "At the supermarket",
  },
  {
    id: 3,
    speed: "Very Fast (100 WPM)",
    rate: 1.0,
    text: "The meeting has been moved to three o'clock instead of two. Please make sure everyone knows about this change. We don't want anyone to be late.",
    question: "What time is the meeting now?",
    options: ["Two o'clock", "Three o'clock", "Four o'clock", "Five o'clock"],
    correct: "Three o'clock",
  },
  {
    id: 4,
    speed: "Ultra Fast (120 WPM)",
    rate: 1.2,
    text: "I finished reading that book you recommended. It was really interesting. The story had many surprising twists. I couldn't put it down until the end.",
    question: "What did they think of the book?",
    options: ["Boring", "Interesting", "Confusing", "Too long"],
    correct: "Interesting",
  },
]

export default function ListeningSpeedPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const exercise = speedExercises[currentExercise]
  const progress = ((currentExercise + 1) / speedExercises.length) * 100

  const playAudio = async () => {
    setIsPlaying(true)
    
    const utterance = new SpeechSynthesisUtterance(exercise.text)
    utterance.lang = "en-US"
    utterance.rate = exercise.rate
    
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
  }

  const nextExercise = async () => {
    if (currentExercise < speedExercises.length - 1) {
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
          const xpEarned = score * 3
          if (xpEarned > 0) {
            await updateUserStats({
              totalXp: (user.totalXp || 0) + xpEarned,
              totalPoints: (user.totalPoints || 0) + xpEarned,
            })
            const updatedUser = { ...user, totalXp: (user.totalXp || 0) + xpEarned, totalPoints: (user.totalPoints || 0) + xpEarned }
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

  const getSpeedColor = (speed: string) => {
    if (speed.includes("Normal")) return "bg-green-100 text-green-800"
    if (speed.includes("Fast")) return "bg-yellow-100 text-yellow-800"
    if (speed.includes("Very Fast")) return "bg-orange-100 text-orange-800"
    if (speed.includes("Ultra")) return "bg-red-100 text-red-800"
    return "bg-gray-100 text-gray-800"
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
                {score}/{speedExercises.length}
              </div>
              <p className="text-xl">
                คะแนนของคุณ: {Math.round((score / speedExercises.length) * 100)}%
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
          <h1 className="text-3xl font-bold">Speed Listening</h1>
          <p className="text-gray-600 mt-1">ฝึกฟังภาษาอังกฤษในความเร็วต่างๆ</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{currentExercise + 1} / {speedExercises.length}</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Gauge className="h-6 w-6 text-indigo-600" />
              <CardTitle>{exercise.speed}</CardTitle>
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
              <p>{isPlaying ? "กำลังเล่นเสียงเร็ว..." : "คลิกปุ่มเพื่อฟังเสียง"}</p>
              <p className="text-xs text-gray-500 mt-1">
                ความท้าทายจะเพิ่มขึ้นในแต่ละข้อ
              </p>
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
                  {currentExercise < speedExercises.length - 1 ? "ข้อถัดไป" : "เสร็จสิ้น"}
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

            <div className="flex justify-center gap-2 mt-4">
              {speedExercises.map((ex, idx) => (
                <div
                  key={idx}
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    idx === currentExercise
                      ? getSpeedColor(ex.speed) + " ring-2 ring-indigo-500"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {idx + 1}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}


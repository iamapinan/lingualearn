"use client"

import { useState, useEffect, useRef, use } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Check, X, Trophy, Clock, Zap } from "lucide-react"
import {
  getLessonById,
  getQuestionsForLesson,
  saveUserProgress,
  updateUserStats,
  completeLessonAndSaveProgress,
  isLessonCompleted,
  getLessonsByLanguage,
} from "@/lib/database"
import { MatchingExercise } from "@/components/matching-exercise"
import { FillBlankExercise } from "@/components/fill-blank-exercise"
import { ListeningExercise } from "@/components/listening-exercise"
import { useAuth } from "@/components/auth-provider"
import { playCorrectSound, playIncorrectSound, playPointsSound, playLevelCompleteSound } from "@/lib/audio-utils"
import { calculateScore, calculateLessonCompletionXP } from "@/lib/scoring-system"

interface Question {
  id: number
  type: string
  prompt: string
  options: string
  correctAnswer: string
  audioUrl?: string
}

export default function LessonPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { user } = useAuth()
  const resolvedParams = use(params)
  const lessonId = Number.parseInt(resolvedParams.id)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [progress, setProgress] = useState(0)
  const [lessonComplete, setLessonComplete] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [matchingSelections, setMatchingSelections] = useState<{ [key: number]: number }>({})
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [isAlreadyCompleted, setIsAlreadyCompleted] = useState(false)
  const [lesson, setLesson] = useState<any>(null)
  const [questionStartTime, setQuestionStartTime] = useState<number>(Date.now())
  const [totalTimeSpent, setTotalTimeSpent] = useState<number>(0)
  const [showPointsAnimation, setShowPointsAnimation] = useState<boolean>(false)
  const [pointsEarned, setPointsEarned] = useState<number>(0)
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([])
  const [lessonNumber, setLessonNumber] = useState<number | null>(null)
  const [totalLessons, setTotalLessons] = useState<number>(0)

  // ใช้ useRef เพื่อเก็บค่าที่ไม่ต้องการให้ re-render
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // โหลด voices ที่มีอยู่ในระบบ
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      // ฟังก์ชันสำหรับโหลด voices
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices()
        if (voices.length > 0) {
          setAvailableVoices(voices)
        }
      }

      // โหลด voices ครั้งแรก
      loadVoices()

      // ลงทะเบียน event listener สำหรับเมื่อ voices เปลี่ยนแปลง
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [])

  useEffect(() => {
    const loadLesson = async () => {
      if (!user) return

      try {

        // Check if lesson is already completed
        const completed = await isLessonCompleted(user.id, lessonId)
        setIsAlreadyCompleted(completed)

        // Get the lesson
        const lessonData = await getLessonById(lessonId)
        setLesson(lessonData)

        // Get questions for this lesson
        const lessonQuestions = await getQuestionsForLesson(lessonId)
        setQuestions(lessonQuestions)

        // Get all lessons to calculate the sequential lesson number
        const allLessons = await getLessonsByLanguage(6) // English language ID
        const sortedLessons = [...allLessons].sort((a, b) => a.order - b.order)
        const lessonIndex = sortedLessons.findIndex((lesson) => lesson.id === lessonId)
        if (lessonIndex !== -1) {
          setLessonNumber(lessonIndex + 1)
          setTotalLessons(sortedLessons.length)
        }

        // ตั้งค่าเวลาเริ่มต้นสำหรับคำถามแรก
        setQuestionStartTime(Date.now())

        setLoading(false)
      } catch (error) {
        console.error("Error loading lesson:", error)
        setLoading(false)
      }
    }

    loadLesson()
  }, [lessonId, user])

  // Get difficulty label based on difficulty level
  const getDifficultyLabel = (difficulty: number) => {
    if (difficulty <= 2) return "Beginner"
    if (difficulty <= 4) return "Elementary"
    if (difficulty <= 6) return "Intermediate"
    if (difficulty <= 8) return "Advanced"
    return "Expert"
  }

  // Get difficulty badge color based on difficulty level
  const getDifficultyBadgeColor = (difficulty: number) => {
    if (difficulty <= 2) return "bg-green-100 text-green-800"
    if (difficulty <= 4) return "bg-blue-100 text-blue-800"
    if (difficulty <= 6) return "bg-purple-100 text-purple-800"
    if (difficulty <= 8) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const currentQuestion = questions[currentQuestionIndex]

  const checkAnswer = () => {
    if (!selectedAnswer && currentQuestion?.type !== "matching") return
    if (!currentQuestion) return
    if (!user) return

    // คำนวณเวลาที่ใช้ในการตอบคำถาม
    const timeSpent = (Date.now() - questionStartTime) / 1000
    setTotalTimeSpent((prev) => prev + timeSpent)

    let correct = false

    if (currentQuestion.type === "matching") {
      // For matching exercises, check if all pairs are correctly matched
      const options = JSON.parse(currentQuestion.options)
      const leftItems = options.filter((item: any) => item.side === "left")

      correct = leftItems.every((item: any) => {
        const matchingItem = options.find((opt: any) => opt.id === item.matchId)
        return matchingSelections[item.id] === matchingItem?.id
      })
    } else {
      // For other question types
      correct = selectedAnswer?.toLowerCase() === currentQuestion.correctAnswer.toLowerCase()
    }

    setIsCorrect(correct)

    // เล่นเสียงตามผลลัพธ์
    if (correct) {
      try {
        playCorrectSound()

        // คำนวณคะแนนตามความยากและเวลาที่ใช้
        const pointsForQuestion = calculateScore(lesson?.difficulty || 1, timeSpent, true)

        // แสดงแอนิเมชันคะแนน
        setPointsEarned(pointsForQuestion)
        setShowPointsAnimation(true)
        setTimeout(() => setShowPointsAnimation(false), 1500)

        // เพิ่ม XP
        setXpEarned((prev) => prev + pointsForQuestion)
        setCorrectAnswers((prev) => prev + 1)

        // เล่นเสียงได้คะแนน
        setTimeout(() => playPointsSound(), 500)
      } catch (error) {
        console.error("Error playing sounds:", error)
      }
    } else {
      try {
        playIncorrectSound()
      } catch (error) {
        console.error("Error playing incorrect sound:", error)
      }
    }

    // Update progress
    const newProgress = Math.round(((currentQuestionIndex + 1) / questions.length) * 100)
    setProgress(newProgress)

    // Save progress to database
    if (user) {
      saveUserProgress({
        lessonId,
        questionId: currentQuestion.id,
        completed: 1,
        correct: correct ? 1 : 0,
        timestamp: new Date().toISOString(),
      }, user.id)
    }
  }

  const nextQuestion = async () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
      setMatchingSelections({})

      // ตั้งค่าเวลาเริ่มต้นสำหรับคำถามใหม่
      setQuestionStartTime(Date.now())
    } else {
      setLessonComplete(true)

      // เล่นเสียงเมื่อจบด่าน
      try {
        playLevelCompleteSound()
      } catch (error) {
        console.error("Error playing level complete sound:", error)
      }

      // Calculate score as a percentage
      const score = Math.round((correctAnswers / questions.length) * 100)

      // คำนวณ XP ที่ได้รับจากการทำด่านเสร็จ
      const lessonXP = calculateLessonCompletionXP(
        lesson?.difficulty || 1,
        correctAnswers,
        questions.length,
        Math.round(totalTimeSpent) < 60 ? 20 : 0, // โบนัสถ้าทำเสร็จเร็ว
      )

      // ปรับ XP รวม
      setXpEarned((prev) => Math.max(prev, lessonXP))

      // Mark lesson as completed in the database
      if (user) {
        // Save to IndexedDB
        await completeLessonAndSaveProgress(
          user.id,
          lessonId,
          score,
          questions.length,
          correctAnswers,
          lessonXP, // Pass XP earned
        )

        // Also save to MySQL database via API
        try {
          const token = localStorage.getItem("lingualearn_token")
          if (token) {
            await fetch("/api/lesson-completions", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                lessonId,
                score,
                totalQuestions: questions.length,
                correctAnswers,
                xpEarned: lessonXP,
              }),
            })
          }
        } catch (error) {
          console.error("Error saving lesson completion to MySQL:", error)
        }
        
        // Dispatch event to notify learning path component
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("lessonCompleted"))
        }
      }
    }
  }

  const playAudio = () => {
    if (!currentQuestion) return

    try {
      // ใช้ Web Speech API แทนการโหลดไฟล์เสียง
      if ("speechSynthesis" in window) {
        // หยุดเสียงที่กำลังเล่นอยู่ (ถ้ามี)
        window.speechSynthesis.cancel()

        const textToSpeak =
          currentQuestion.type === "listening" ? currentQuestion.correctAnswer : currentQuestion.prompt
        const utterance = new SpeechSynthesisUtterance(textToSpeak)

        // เลือกเสียงภาษาอังกฤษที่ดีที่สุดที่มี
        const englishVoices = availableVoices.filter(
          (voice) => voice.lang.includes("en-") && voice.localService === false,
        )

        // ถ้ามีเสียงภาษาอังกฤษ ให้เลือกเสียงแรก
        if (englishVoices.length > 0) {
          utterance.voice = englishVoices[0]
        }

        // ตั้งค่าคุณภาพเสียง
        utterance.lang = "en-US"
        utterance.rate = 0.9 // ช้าลงเล็กน้อยเพื่อให้ฟังชัดขึ้น
        utterance.pitch = 1.0 // ระดับเสียงปกติ
        utterance.volume = 1.0 // ความดังสูงสุด

        // เพิ่ม event listeners เพื่อจัดการกับสถานะการเล่นเสียง
        utterance.onstart = () => {
          console.log("Speech started")
        }

        utterance.onend = () => {
          console.log("Speech ended")
        }

        utterance.onerror = (event) => {
          console.error("Speech error:", event)
        }

        // เล่นเสียง
        window.speechSynthesis.speak(utterance)
      } else {
        console.error("Speech Synthesis API is not supported in this browser")
      }
    } catch (error) {
      console.error("Error playing audio:", error)
    }
  }

  // ฟังก์ชันสำหรับไปยังด่านถัดไป
  const goToNextLesson = () => {
    const nextLessonId = lessonId + 1
    // ตรวจสอบว่าด่านถัดไปมีอยู่จริงหรือไม่
    // ถ้าเป็นด่านสุดท้าย (160) ให้กลับไปหน้าหลัก
    if (nextLessonId > 160) {
      router.push("/")
    } else {
      router.push(`/lesson/${nextLessonId}`)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading lesson...</p>
        </div>
      </div>
    )
  }

  if (lessonComplete) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16">
        <Card className="text-center p-8">
          <CardContent>
            <div className="mb-6">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mx-auto">
                <Trophy className="h-12 w-12 text-indigo-500" />
              </div>
            </div>
            <h1 className="text-2xl font-bold mb-2">Lesson Complete!</h1>
            <p className="text-gray-500 mb-6">
              {isAlreadyCompleted
                ? "You've already completed this lesson before, but great job practicing again!"
                : "Great job! You've completed this lesson for the first time!"}
            </p>
            <p className="text-gray-500 mb-6">You've earned {xpEarned} XP</p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">XP Earned</p>
                <p className="text-xl font-bold">{xpEarned}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Accuracy</p>
                <p className="text-xl font-bold">{Math.round((correctAnswers / questions.length) * 100)}%</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Time Spent</p>
                <p className="text-xl font-bold">{Math.round(totalTimeSpent)}s</p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to Home
              </Button>
              <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={goToNextLesson}>
                {lessonId >= 160 ? "กลับหน้าหลัก" : "ด่านถัดไป"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-lg">No questions available for this lesson.</p>
          <Button className="mt-4" onClick={() => router.push("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    )
  }

  // Parse options if they exist
  const questionOptions = currentQuestion.options ? JSON.parse(currentQuestion.options) : []

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium">
              Lesson {lessonNumber} of {totalLessons}
            </p>
            {lesson && (
              <div
                className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium leading-none whitespace-nowrap select-none cursor-default
                ${getDifficultyBadgeColor(lesson.difficulty)}"
              >
                <Zap className="h-3 w-3 mr-0.5" />
                {getDifficultyLabel(lesson.difficulty)}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <p className="text-sm font-medium text-gray-500">{Math.round(totalTimeSpent)}s</p>
            <p className="text-sm font-medium text-indigo-500">{xpEarned} XP earned</p>
          </div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <p className="text-sm font-medium">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>
        <Progress value={progress} className="h-2 bg-gray-200" />
      </div>

      {/* แอนิเมชันคะแนน */}
      {showPointsAnimation && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 animate-bounce">
          <div className="bg-indigo-500 text-white text-2xl font-bold px-4 py-2 rounded-full">
            +{pointsEarned} points!
          </div>
        </div>
      )}

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">
              {currentQuestion.type === "translation"
                ? "Translation"
                : currentQuestion.type === "matching"
                  ? "Matching Exercise"
                  : currentQuestion.type === "fill-blank"
                    ? "Fill in the Blank"
                    : currentQuestion.type === "listening"
                      ? "Listening Exercise"
                      : "Choose the correct answer"}
            </h2>
            {(currentQuestion.type === "translation" || currentQuestion.type === "listening") && (
              <Button
                variant="outline"
                size="sm"
                onClick={playAudio}
                className="text-indigo-600 border-indigo-300 hover:bg-indigo-50"
              >
                Listen <span className="sr-only">to the word</span>
              </Button>
            )}
          </div>

          <div className="mb-6">
            <p className="text-lg">{currentQuestion.prompt}</p>
          </div>

          {currentQuestion.type === "multiple-choice" && (
            <div className="grid gap-3">
              {questionOptions.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={selectedAnswer === option ? "default" : "outline"}
                  className={`justify-start h-auto py-3 px-4 ${
                    isCorrect !== null && option === currentQuestion.correctAnswer
                      ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                      : isCorrect === false && option === selectedAnswer
                        ? "bg-red-100 border-red-500 text-red-700"
                        : ""
                  }`}
                  onClick={() => {
                    if (isCorrect === null) {
                      setSelectedAnswer(option)
                    }
                  }}
                  disabled={isCorrect !== null}
                >
                  {option}
                  {isCorrect !== null && option === currentQuestion.correctAnswer && (
                    <Check className="ml-auto h-5 w-5 text-indigo-500" />
                  )}
                  {isCorrect === false && option === selectedAnswer && <X className="ml-auto h-5 w-5 text-red-500" />}
                </Button>
              ))}
            </div>
          )}

          {currentQuestion.type === "translation" && (
            <div>
              <input
                type="text"
                className="w-full p-3 border rounded-md mb-3"
                placeholder="Type your answer..."
                value={selectedAnswer || ""}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                disabled={isCorrect !== null}
              />

              {isCorrect !== null && (
                <div
                  className={`p-3 rounded-md ${isCorrect ? "bg-indigo-100 text-indigo-700" : "bg-red-100 text-red-700"}`}
                >
                  <div className="flex items-center gap-2">
                    {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                    <p>
                      {isCorrect ? "Correct!" : `Incorrect. The correct answer is: "${currentQuestion.correctAnswer}"`}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {currentQuestion.type === "matching" && (
            <MatchingExercise
              options={questionOptions}
              selections={matchingSelections}
              onSelect={(leftId, rightId) => {
                if (isCorrect === null) {
                  setMatchingSelections((prev) => ({ ...prev, [leftId]: rightId }))
                }
              }}
              isCorrect={isCorrect}
              disabled={isCorrect !== null}
            />
          )}

          {currentQuestion.type === "fill-blank" && (
            <FillBlankExercise
              options={questionOptions}
              onSelect={(answer) => {
                if (isCorrect === null) {
                  setSelectedAnswer(answer)
                }
              }}
              selectedAnswer={selectedAnswer}
              isCorrect={isCorrect}
              correctAnswer={currentQuestion.correctAnswer}
              disabled={isCorrect !== null}
            />
          )}

          {currentQuestion.type === "listening" && (
            <ListeningExercise
              options={questionOptions}
              onSelect={(answer) => {
                if (isCorrect === null) {
                  setSelectedAnswer(answer)
                }
              }}
              selectedAnswer={selectedAnswer}
              isCorrect={isCorrect}
              correctAnswer={currentQuestion.correctAnswer}
              onPlayAudio={playAudio}
              disabled={isCorrect !== null}
            />
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => router.push("/")}>
          Exit Lesson
        </Button>

        {isCorrect !== null ? (
          <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={nextQuestion}>
            Continue
          </Button>
        ) : (
          <Button
            className="bg-indigo-500 hover:bg-indigo-600"
            onClick={checkAnswer}
            disabled={!selectedAnswer && currentQuestion.type !== "matching"}
          >
            Check
          </Button>
        )}
      </div>
    </div>
  )
}

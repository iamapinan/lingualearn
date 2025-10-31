"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"
import { CheckCircle, Lock, Star, ChevronLeft, ChevronRight, AlertCircle, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Lesson {
  id: number
  languageId: number
  name: string
  totalQuestions: number
  lessonOrder: number
  difficulty: number
  description: string
}

interface LessonCompletion {
  id?: number
  userId: number
  lessonId: number
  completed: boolean
  completedAt: string
  score: number
  totalQuestions: number
  correctAnswers: number
}

export default function LearningPath() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [completedLessons, setCompletedLessons] = useState<LessonCompletion[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()
  const [currentPage, setCurrentPage] = useState(0)
  const [recommendedLesson, setRecommendedLesson] = useState<number | null>(null)
  const [recommendedLessonNumber, setRecommendedLessonNumber] = useState<number | null>(null)
  const [showRecommendation, setShowRecommendation] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const token = localStorage.getItem("lingualearn_token")
        const headers = token ? { Authorization: `Bearer ${token}` } : {}

        // Get English lessons (language ID 1)
        const lessonsRes = await fetch("/api/lessons?languageId=1")
        if (lessonsRes.ok) {
          const lessonsData = await lessonsRes.json()
          setLessons(lessonsData.lessons || [])
        }

        // Get user's completed lessons
        const completionsRes = await fetch("/api/lesson-completions", { headers })
        if (completionsRes.ok) {
          const completionsData = await completionsRes.json()
          setCompletedLessons(completionsData.completions || [])
        }

        // Get recommended starting lesson from user data
        const recommended = user.recommendedStartingLesson
        setRecommendedLesson(recommended || null)

        // Calculate the sequential lesson number for the recommended lesson
        if (recommended && lessonsRes.ok) {
          const lessonsData = await lessonsRes.json()
          const sortedLessons = [...(lessonsData.lessons || [])].sort((a: Lesson, b: Lesson) => a.lessonOrder - b.lessonOrder)
          const recommendedIndex = sortedLessons.findIndex((lesson: Lesson) => lesson.id === recommended)
          if (recommendedIndex !== -1) {
            setRecommendedLessonNumber(recommendedIndex + 1)
          }
        }

        setLoading(false)
      } catch (error) {
        console.error("Error loading learning path data:", error)
        setLoading(false)
      }
    }

    loadData()
  }, [user])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // Sort lessons by order
  const sortedLessons = [...lessons].sort((a, b) => a.lessonOrder - b.lessonOrder)

  // Check if a lesson is completed
  const isLessonCompleted = (lessonId: number) => {
    return completedLessons.some((completion) => completion.lessonId === lessonId)
  }

  // Check if a lesson is unlocked
  const isLessonUnlocked = (lesson: Lesson) => {
    // First lesson is always unlocked
    if (lesson.lessonOrder === 1) return true

    // If there's a recommended lesson and this lesson is at or before it, unlock it
    if (recommendedLesson && lesson.id <= recommendedLesson) return true

    // Find the previous lesson
    const previousLesson = sortedLessons.find((l) => l.lessonOrder === lesson.lessonOrder - 1)

    // If previous lesson exists and is completed, this lesson is unlocked
    return previousLesson && isLessonCompleted(previousLesson.id)
  }

  // Get lesson score if completed
  const getLessonScore = (lessonId: number) => {
    const completion = completedLessons.find((completion) => completion.lessonId === lessonId)
    return completion ? completion.score : 0
  }

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
    if (difficulty === 1) return "bg-green-100 text-green-800"
    if (difficulty === 2) return "bg-green-200 text-green-800"
    if (difficulty === 3) return "bg-green-300 text-green-800"
    if (difficulty === 4) return "bg-blue-100 text-blue-800"
    if (difficulty === 5) return "bg-blue-200 text-blue-800"
    if (difficulty === 6) return "bg-blue-300 text-blue-800"
    if (difficulty === 7) return "bg-purple-100 text-purple-800"
    if (difficulty === 8) return "bg-purple-200 text-purple-800"
    if (difficulty === 9) return "bg-purple-300 text-purple-800"
    if (difficulty === 10) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  // เพิ่มการแบ่งด่านเป็นหน้าๆ และปุ่มเลื่อนซ้าย-ขวา
  const lessonsPerPage = 8
  const totalPages = Math.ceil(sortedLessons.length / lessonsPerPage)

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1))
  }

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages - 1, prev + 1))
  }

  // แบ่งด่านตามหน้าปัจจุบัน
  const currentLessons = sortedLessons.slice(currentPage * lessonsPerPage, (currentPage + 1) * lessonsPerPage)

  // Find the recommended lesson in the current page
  const recommendedLessonInCurrentPage =
    recommendedLesson && currentLessons.find((lesson) => lesson.id === recommendedLesson)

  const dismissRecommendation = () => {
    setShowRecommendation(false)
  }

  return (
    <div className="w-full pb-6">
      {recommendedLesson && recommendedLessonNumber && recommendedLessonInCurrentPage && showRecommendation && (
        <div className="mb-4 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-start">
          <AlertCircle className="h-5 w-5 text-indigo-500 mt-0.5 mr-2 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-indigo-700">
              Based on your assessment, we recommend starting at <strong>Lesson {recommendedLessonNumber}</strong>.
            </p>
          </div>
          <button
            onClick={dismissRecommendation}
            className="text-indigo-500 hover:text-indigo-700"
            aria-label="Dismiss recommendation"
          >
            <span className="sr-only">Dismiss</span>
            &times;
          </button>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="sm"
          onClick={handlePrevPage}
          disabled={currentPage === 0}
          className="flex items-center gap-1"
        >
          <ChevronLeft className="h-4 w-4" /> ด่านก่อนหน้า
        </Button>
        <div className="text-sm font-medium">
          หน้า {currentPage + 1} จาก {totalPages}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleNextPage}
          disabled={currentPage === totalPages - 1}
          className="flex items-center gap-1"
        >
          ด่านถัดไป <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-max">
          <div className="flex items-center p-4 gap-2 justify-center">
            {currentLessons.map((lesson, index) => {
              const isCompleted = isLessonCompleted(lesson.id)
              const isUnlocked = isLessonUnlocked(lesson)
              const score = getLessonScore(lesson.id)
              const lessonNumber = currentPage * lessonsPerPage + index + 1
              const isRecommended = lesson.id === recommendedLesson
              return (
                <div key={lesson.id} className="flex flex-col items-center px-1">


                  {/* Lesson node */}
                  <motion.div
                    whileHover={isUnlocked ? { scale: 1.05 } : {}}
                    whileTap={isUnlocked ? { scale: 0.90 } : {}}
                    className={isRecommended ? "relative" : ""}
                  >
                    {isRecommended && (
                      <div className="absolute -top-2 -right-2 bg-indigo-500 text-white text-xs px-1.5 py-0.5 rounded-full z-10">
                        Start
                      </div>
                    )}
                    <Link href={isUnlocked ? `/lesson/${lesson.id}` : "#"}>
                      <Card
                        className={`w-24 h-24 flex flex-col items-center justify-center rounded-xl shadow-lg border-2 ${
                          isRecommended
                            ? "border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 cursor-pointer "
                            : isUnlocked
                              ? isCompleted
                                ? "border-green-300 bg-gradient-to-br from-green-50 to-teal-50 cursor-pointer "
                                : `border-purple-300 bg-gradient-to-br ${getDifficultyBadgeColor(lesson.difficulty)} bg-opacity-10 cursor-pointer`
                              : "border-gray-300 bg-gray-100 opacity-60 cursor-default"
                        }`}
                      >
                        <CardContent className="p-3 flex flex-col items-center justify-center">
                          <div className="mb-1">
                            {isCompleted ? (
                              <div className="bg-green-100 p-2 rounded-full">
                                <CheckCircle className="h-6 w-6 text-green-500" />
                              </div>
                            ) : isUnlocked ? (
                              <div className={`bg-purple-100 px-3 py-2 rounded-full`}>
                                <span className="text-xl">🎮</span>
                              </div>
                            ) : (
                              <div className="bg-gray-100 p-2 rounded-full">
                                <Lock className="h-6 w-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <p
                              className={`text-xs font-bold ${
                                isUnlocked ? (isCompleted ? "text-green-700" : "text-purple-700") : "text-gray-500"
                              }`}
                            >
                              ด่านที่ {lessonNumber}
                            </p>
                            {isCompleted && (
                              <div className="flex items-center justify-center mt-1">
                                <Star className="h-3 w-3 text-yellow-500 mr-1" />
                                <span className="text-xs font-medium text-yellow-700">{score}%</span>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>

                  {/* Lesson name and difficulty badge */}
                  <div className="mt-2 text-center w-24">
                    <div className="text-xs font-medium truncate">{lesson.name}</div>
                    <div
                      className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-medium leading-none whitespace-nowrap select-none cursor-default
                      ${getDifficultyBadgeColor(lesson.difficulty)}"
                    >
                      <Zap className="h-2 w-2 mr-0.5" />
                      {getDifficultyLabel(lesson.difficulty)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center mt-4 gap-1">
        {Array.from({ length: totalPages }).map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full ${currentPage === index ? "bg-purple-500" : "bg-gray-300"}`}
            onClick={() => setCurrentPage(index)}
          />
        ))}
      </div>
    </div>
  )
}

export { LearningPath }

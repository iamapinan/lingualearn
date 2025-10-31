"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, CheckCircle, Calendar, Star, BookOpen } from "lucide-react"
import { getUserCompletedLessons, getLessonById } from "@/lib/database"
import { useAuth } from "@/components/auth-provider"

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

interface Lesson {
  id: number
  languageId: number
  name: string
  totalQuestions: number
  order: number
  difficulty: number
  description: string
}

interface CompletedLessonWithDetails extends LessonCompletion {
  lessonName: string
  lessonDescription: string
  languageId: number
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [completedLessons, setCompletedLessons] = useState<CompletedLessonWithDetails[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistory = async () => {
      if (!user) return

      try {

        // Get completed lessons
        const completions = await getUserCompletedLessons(user.id)

        // Get lesson details for each completion
        const completionsWithDetails = await Promise.all(
          completions.map(async (completion) => {
            const lesson = await getLessonById(completion.lessonId)
            return {
              ...completion,
              lessonName: lesson?.name || `Lesson ${completion.lessonId}`,
              lessonDescription: lesson?.description || "",
              languageId: lesson?.languageId || 0,
            }
          }),
        )

        // Sort by completion date (newest first)
        completionsWithDetails.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())

        setCompletedLessons(completionsWithDetails)
        setLoading(false)
      } catch (error) {
        console.error("Error loading lesson history:", error)
        setLoading(false)
      }
    }

    loadHistory()
  }, [user])

  const getLanguageEmoji = (languageId: number): string => {
    switch (languageId) {
      case 1:
        return "🇬🇧"
      case 2:
        return "🇹🇭"
      case 3:
        return "🇨🇳"
      case 4:
        return "🇮🇹"
      case 5:
        return "🇯🇵"
      case 6:
        return "🇰🇷"
      default:
        return "🌐"
    }
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Lesson History</h1>
      </div>

      {completedLessons.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">You haven't completed any lessons yet.</p>
            <Link href="/">
              <Button className="mt-4 bg-indigo-500 hover:bg-indigo-600">Start Learning</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {completedLessons.map((completion) => (
            <Card key={completion.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-indigo-100 p-3 rounded-full">
                    <span className="text-2xl">{getLanguageEmoji(completion.languageId)}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">{completion.lessonName}</h3>
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full">
                        {completion.score}%
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{completion.lessonDescription}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(completion.completedAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>
                          {completion.correctAnswers} of {completion.totalQuestions} correct
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3" />
                        <span>{completion.correctAnswers * 10} XP earned</span>
                      </div>
                    </div>
                  </div>
                  <Link href={`/lesson/${completion.lessonId}`}>
                    <Button size="sm" className="bg-indigo-500 hover:bg-indigo-600">
                      Review
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

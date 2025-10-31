"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { PracticeSession } from "@/components/practice-session"
import { allExerciseSets } from "@/lib/db/data/practice-exercises-data"
import type { ExerciseSet, SkillType } from "@/lib/practice-types"
import { useAuth } from "@/components/auth-provider"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function PracticeExerciseSetPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [exerciseSet, setExerciseSet] = useState<ExerciseSet | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    const skillType = params.skillType as SkillType
    const exerciseSetId = params.exerciseSetId as string

    if (!skillType || !exerciseSetId) {
      setError("Invalid practice exercise parameters")
      setLoading(false)
      return
    }

    // Find the exercise set
    const exercises = allExerciseSets[skillType]
    if (!exercises) {
      setError(`No exercises found for skill type: ${skillType}`)
      setLoading(false)
      return
    }

    const foundExerciseSet = exercises.find((set) => set.id === exerciseSetId)
    if (!foundExerciseSet) {
      setError(`Exercise set not found: ${exerciseSetId}`)
      setLoading(false)
      return
    }

    setExerciseSet(foundExerciseSet)
    setLoading(false)
  }, [params, router, user])

  const handleComplete = (results: { totalScore: number; correctCount: number; totalExercises: number }) => {
    // In a real app, you would save these results to the database
    console.log("Practice session completed:", results)
  }

  if (loading) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-64">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin mb-4" />
          <p className="text-gray-500">Loading practice exercises...</p>
        </div>
      </PageContainer>
    )
  }

  if (error || !exerciseSet) {
    return (
      <PageContainer>
        <div className="flex flex-col items-center justify-center h-64">
          <p className="text-red-500 mb-4">{error || "Failed to load practice exercises"}</p>
          <Button onClick={() => router.push("/practice")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Practice
          </Button>
        </div>
      </PageContainer>
    )
  }

  return <PracticeSession exerciseSet={exerciseSet} onComplete={handleComplete} />
}

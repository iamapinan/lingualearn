"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { PracticeExerciseComponent } from "@/components/practice-exercise"
import type { ExerciseSet } from "@/lib/practice-types"
import { Confetti } from "@/components/confetti"
import { Trophy, ArrowLeft, RotateCcw, Star } from "lucide-react"

interface PracticeSessionProps {
  exerciseSet: ExerciseSet
  onComplete?: (results: { totalScore: number; correctCount: number; totalExercises: number }) => void
  onExit?: () => void
}

export function PracticeSession({ exerciseSet, onComplete, onExit }: PracticeSessionProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [sessionComplete, setSessionComplete] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [exerciseResults, setExerciseResults] = useState<
    Array<{ exerciseId: string; correct: boolean; score: number }>
  >([])

  // Update progress when current exercise changes
  useEffect(() => {
    setProgress((currentExerciseIndex / exerciseSet.exercises.length) * 100)
  }, [currentExerciseIndex, exerciseSet.exercises.length])

  const handleExerciseComplete = (result: { correct: boolean; score: number }) => {
    const currentExercise = exerciseSet.exercises[currentExerciseIndex]

    // Validate the result
    if (typeof result.correct !== "boolean") {
      console.error("Invalid result: correct status is not a boolean", result)
      result.correct = false
    }

    // Ensure score is a number and not negative
    const validatedScore = typeof result.score === "number" && result.score >= 0 ? result.score : 0

    // Update score and correct count
    setScore((prev) => prev + validatedScore)
    if (result.correct) {
      setCorrectCount((prev) => prev + 1)
    }

    // Save result
    setExerciseResults((prev) => [
      ...prev,
      { exerciseId: currentExercise.id, correct: result.correct, score: validatedScore },
    ])
  }

  const handleNextExercise = () => {
    if (currentExerciseIndex < exerciseSet.exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1)
    } else {
      // Session complete
      setSessionComplete(true)
      setShowConfetti(true)

      // Call onComplete callback if provided
      if (onComplete) {
        onComplete({
          totalScore: score,
          correctCount: correctCount,
          totalExercises: exerciseSet.exercises.length,
        })
      }

      // Save progress to database or localStorage
      if (user) {
        // This would be implemented in a real app
        // saveUserProgress(user.id, exerciseSet.id, score, correctCount, exerciseSet.exercises.length)

        // Show toast notification
        toast({
          title: "Practice Complete!",
          description: `You scored ${score} points with ${correctCount} correct answers.`,
        })
      }
    }
  }

  const handleRestartSession = () => {
    setCurrentExerciseIndex(0)
    setScore(0)
    setCorrectCount(0)
    setProgress(0)
    setSessionComplete(false)
    setExerciseResults([])
  }

  const handleExit = () => {
    if (onExit) {
      onExit()
    } else {
      router.push("/practice")
    }
  }

  if (sessionComplete) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        {showConfetti && <Confetti />}
        <Card className="border-indigo-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardTitle className="text-xl">Practice Complete!</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-10 w-10 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Great Job!</h2>
              <p className="text-gray-500 mb-6">You've completed the {exerciseSet.title} practice session.</p>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-6">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-lg font-medium text-indigo-700">Your Score:</p>
                  <p className="text-2xl font-bold text-indigo-700">{score} points</p>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm text-gray-600">Correct Answers:</p>
                  <p className="text-sm font-medium text-indigo-700">
                    {correctCount} / {exerciseSet.exercises.length}
                  </p>
                </div>
                <Progress value={(correctCount / exerciseSet.exercises.length) * 100} className="h-2 mb-4" />
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">Accuracy:</p>
                  <p className="text-sm font-medium text-indigo-700">
                    {Math.round((correctCount / exerciseSet.exercises.length) * 100)}%
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 text-left">Exercise Results</h3>
                <div className="bg-white rounded-lg shadow-sm p-4 max-h-60 overflow-y-auto">
                  {exerciseResults.map((result, index) => {
                    const exercise = exerciseSet.exercises.find((ex) => ex.id === result.exerciseId)
                    return (
                      <div key={index} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div className="flex items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                              result.correct ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                            }`}
                          >
                            {result.correct ? "✓" : "✗"}
                          </div>
                          <span className="text-gray-700">{exercise?.title || `Exercise ${index + 1}`}</span>
                        </div>
                        <span className="font-medium">{result.score} pts</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={handleExit} className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Exit
                </Button>
                <Button onClick={handleRestartSession} className="bg-indigo-600 hover:bg-indigo-700 flex items-center">
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Practice Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const currentExercise = exerciseSet.exercises[currentExerciseIndex]

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={handleExit} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Exit Practice
        </Button>
        <div className="flex items-center">
          <Star className="h-5 w-5 text-yellow-500 mr-1" />
          <span className="font-medium">{score} points</span>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-500">Progress</span>
          <span className="text-sm text-gray-500">
            {currentExerciseIndex + 1}/{exerciseSet.exercises.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <PracticeExerciseComponent
        exercise={currentExercise}
        onComplete={handleExerciseComplete}
        onNext={handleNextExercise}
      />
    </div>
  )
}

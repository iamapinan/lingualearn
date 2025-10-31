"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { BackButton } from "@/components/back-button"
import { playAudioForWord, playCorrectSound, playIncorrectSound } from "@/lib/audio-utils"
import { VolumeIcon as VolumeUp, ArrowRight, Check, X } from "lucide-react"

// Sample basic listening exercises
const basicListeningExercises = [
  {
    id: 1,
    audio: "hello",
    options: ["hello", "goodbye", "thank you", "please"],
    correctAnswer: "hello",
  },
  {
    id: 2,
    audio: "goodbye",
    options: ["hello", "goodbye", "thank you", "please"],
    correctAnswer: "goodbye",
  },
  {
    id: 3,
    audio: "thank you",
    options: ["hello", "goodbye", "thank you", "please"],
    correctAnswer: "thank you",
  },
  {
    id: 4,
    audio: "please",
    options: ["hello", "goodbye", "thank you", "please"],
    correctAnswer: "please",
  },
  {
    id: 5,
    audio: "yes",
    options: ["yes", "no", "maybe", "sometimes"],
    correctAnswer: "yes",
  },
  {
    id: 6,
    audio: "no",
    options: ["yes", "no", "maybe", "sometimes"],
    correctAnswer: "no",
  },
  {
    id: 7,
    audio: "maybe",
    options: ["yes", "no", "maybe", "sometimes"],
    correctAnswer: "maybe",
  },
  {
    id: 8,
    audio: "sometimes",
    options: ["yes", "no", "maybe", "sometimes"],
    correctAnswer: "sometimes",
  },
  {
    id: 9,
    audio: "good morning",
    options: ["good morning", "good afternoon", "good evening", "good night"],
    correctAnswer: "good morning",
  },
  {
    id: 10,
    audio: "good afternoon",
    options: ["good morning", "good afternoon", "good evening", "good night"],
    correctAnswer: "good afternoon",
  },
]

export default function BasicListeningPracticePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { toast } = useToast()

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [exerciseComplete, setExerciseComplete] = useState(false)
  const [exercises, setExercises] = useState<typeof basicListeningExercises>([])

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    // Shuffle exercises and take 5
    const shuffled = [...basicListeningExercises].sort(() => Math.random() - 0.5).slice(0, 5)
    setExercises(shuffled)
  }, [user, router])

  const handleSelectAnswer = (answer: string) => {
    if (selectedAnswer !== null) return // Prevent multiple selections

    setSelectedAnswer(answer)
    const correct = answer === exercises[currentExerciseIndex].correctAnswer
    setIsCorrect(correct)

    if (correct) {
      playCorrectSound()
      setScore((prev) => prev + 20)
    } else {
      playIncorrectSound()
    }
  }

  const handlePlayAudio = () => {
    playAudioForWord(exercises[currentExerciseIndex].audio, "en")
  }

  const handleNextExercise = () => {
    if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setIsCorrect(null)
      setProgress(((currentExerciseIndex + 1) / exercises.length) * 100)
    } else {
      setExerciseComplete(true)

      // Update user stats if needed
      // ...
    }
  }

  const handleRestartExercise = () => {
    // Shuffle exercises again
    const shuffled = [...basicListeningExercises].sort(() => Math.random() - 0.5).slice(0, 5)
    setExercises(shuffled)
    setCurrentExerciseIndex(0)
    setSelectedAnswer(null)
    setIsCorrect(null)
    setScore(0)
    setProgress(0)
    setExerciseComplete(false)
  }

  if (exercises.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    )
  }

  if (exerciseComplete) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <BackButton href="/practice/listening" />
        <Card className="mt-4 border-indigo-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
            <CardTitle className="text-xl">Basic Listening Practice Complete!</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <VolumeUp className="h-10 w-10 text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Great Job!</h2>
              <p className="text-gray-500 mb-6">You've completed the basic listening practice exercise.</p>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg mb-6">
                <p className="text-2xl font-bold text-indigo-700">Your Score: {score} points</p>
                <p className="text-sm text-gray-500">XP Earned: {Math.floor(score / 2)} XP</p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push("/practice/listening")}>
                  Return to Listening Practice
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleRestartExercise}>
                  Practice Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <BackButton href="/practice/listening" />

      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold mb-2">Basic Listening Practice</h1>
        <p className="text-gray-500">Listen to the audio and select the correct option.</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-500">Progress</span>
          <span className="text-sm text-gray-500">
            {currentExerciseIndex + 1}/{exercises.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6 border-indigo-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100">
          <CardTitle className="text-lg text-indigo-800">Listen and Choose</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center mb-8">
            <Button onClick={handlePlayAudio} className="bg-indigo-600 hover:bg-indigo-700 h-16 w-16 rounded-full">
              <VolumeUp className="h-8 w-8" />
            </Button>
            <p className="mt-2 text-sm text-gray-500">Click to play audio</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {exercises[currentExerciseIndex].options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? "default" : "outline"}
                className={`justify-start h-auto py-3 px-4 ${
                  isCorrect !== null && option === exercises[currentExerciseIndex].correctAnswer
                    ? "bg-green-100 border-green-500 text-green-700"
                    : isCorrect === false && option === selectedAnswer
                      ? "bg-red-100 border-red-500 text-red-700"
                      : ""
                }`}
                onClick={() => handleSelectAnswer(option)}
                disabled={selectedAnswer !== null}
              >
                {option}
                {isCorrect !== null && option === exercises[currentExerciseIndex].correctAnswer && (
                  <Check className="ml-auto h-5 w-5 text-green-500" />
                )}
                {isCorrect === false && option === selectedAnswer && <X className="ml-auto h-5 w-5 text-red-500" />}
              </Button>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          {isCorrect !== null && (
            <Button onClick={handleNextExercise} className="w-full bg-indigo-600 hover:bg-indigo-700">
              {currentExerciseIndex < exercises.length - 1 ? (
                <>
                  Next Question
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              ) : (
                "Complete Exercise"
              )}
            </Button>
          )}
        </CardFooter>
      </Card>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push("/practice/listening")}>
          Exit Practice
        </Button>
        <div className="flex items-center gap-2">
          <span className="font-medium">Score:</span>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">{score}</span>
        </div>
      </div>
    </div>
  )
}

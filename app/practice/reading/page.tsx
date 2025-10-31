"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { BackButton } from "@/components/back-button"
import { playCorrectSound, playIncorrectSound } from "@/lib/audio-utils"
import { BookOpen, ArrowRight, Check, X } from "lucide-react"

// Sample reading exercises
const readingExercises = [
  {
    text: "John goes to school every day. He likes to learn new things. His favorite subject is science.",
    question: "What is John's favorite subject?",
    options: ["Math", "Science", "English", "History"],
    correctAnswer: "Science",
  },
  {
    text: "Mary has a cat and a dog. The cat is black. The dog is brown. Mary loves her pets very much.",
    question: "What color is Mary's dog?",
    options: ["Black", "White", "Brown", "Gray"],
    correctAnswer: "Brown",
  },
  {
    text: "Tom likes to play soccer. He plays soccer with his friends every Saturday. They play in the park near their homes.",
    question: "When does Tom play soccer?",
    options: ["Every day", "Every Friday", "Every Saturday", "Every Sunday"],
    correctAnswer: "Every Saturday",
  },
  {
    text: "Sarah went to the store. She bought some apples, bananas, and oranges. She likes to eat fruit every day.",
    question: "What did Sarah buy at the store?",
    options: ["Vegetables", "Fruit", "Meat", "Bread"],
    correctAnswer: "Fruit",
  },
  {
    text: "David lives in a small house. The house has two bedrooms, one bathroom, a kitchen, and a living room. David likes his house.",
    question: "How many bedrooms does David's house have?",
    options: ["One", "Two", "Three", "Four"],
    correctAnswer: "Two",
  },
  {
    text: "Lisa works in a hospital. She is a doctor. She helps sick people get better. Lisa enjoys her job very much.",
    question: "What is Lisa's job?",
    options: ["Nurse", "Teacher", "Doctor", "Police Officer"],
    correctAnswer: "Doctor",
  },
  {
    text: "Mike has a new car. The car is red. It is very fast. Mike drives his car to work every day.",
    question: "What color is Mike's car?",
    options: ["Blue", "Green", "Red", "Black"],
    correctAnswer: "Red",
  },
  {
    text: "Anna likes to read books. She reads a new book every week. Her favorite books are mystery novels.",
    question: "What type of books does Anna like the most?",
    options: ["Romance", "Mystery", "Science Fiction", "Fantasy"],
    correctAnswer: "Mystery",
  },
]

export default function ReadingPracticePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [exerciseComplete, setExerciseComplete] = useState(false)
  const [exercises, setExercises] = useState<typeof readingExercises>([])

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    // Shuffle exercises and take 5
    const shuffled = [...readingExercises].sort(() => Math.random() - 0.5).slice(0, 5)
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
    const shuffled = [...readingExercises].sort(() => Math.random() - 0.5).slice(0, 5)
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
        <BackButton href="/" />
        <Card className="mt-4 border-indigo-100 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
            <CardTitle className="text-xl">Reading Practice Complete!</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-10 w-10 text-green-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Great Job!</h2>
              <p className="text-gray-500 mb-6">You've completed the reading practice exercise.</p>

              <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg mb-6">
                <p className="text-2xl font-bold text-green-700">Your Score: {score} points</p>
                <p className="text-sm text-gray-500">XP Earned: {Math.floor(score / 2)} XP</p>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Return Home
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={handleRestartExercise}>
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
      <BackButton href="/" />

      <div className="mb-6 mt-4">
        <h1 className="text-2xl font-bold mb-2">Reading Practice</h1>
        <p className="text-gray-500">Read the text and answer the question.</p>
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

      <Card className="mb-6 border-green-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100">
          <CardTitle className="text-lg text-green-800">Reading Comprehension</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="bg-white p-4 rounded-lg border border-green-100 mb-6">
            <p className="text-lg">{exercises[currentExerciseIndex].text}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium mb-3">{exercises[currentExerciseIndex].question}</h3>

            <div className="grid gap-2">
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
          </div>

          {isCorrect !== null && (
            <div className={`p-3 rounded-md ${isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              <div className="flex items-center gap-2">
                {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
                <p>
                  {isCorrect
                    ? "Correct!"
                    : `Incorrect. The correct answer is: "${exercises[currentExerciseIndex].correctAnswer}"`}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          {isCorrect !== null && (
            <Button onClick={handleNextExercise} className="w-full bg-green-600 hover:bg-green-700 text-white">
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
        <Button variant="outline" onClick={() => router.push("/")}>
          Exit Practice
        </Button>
        <div className="flex items-center gap-2">
          <span className="font-medium">Score:</span>
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">{score}</span>
        </div>
      </div>
    </div>
  )
}

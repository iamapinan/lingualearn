"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle, RefreshCw, Lightbulb } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveWritingPracticeProgress } from "@/lib/database"

interface WritingExercise {
  id: number
  type: "sentence-completion" | "translation" | "free-writing" | "error-correction"
  prompt: string
  instructions: string
  expectedAnswer?: string
  hints?: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
}

export default function WritingPracticePage() {
  const router = useRouter()
  const [userId, setUserId] = useState<number | null>(null)
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0)
  const [userAnswer, setUserAnswer] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [feedback, setFeedback] = useState<{ correct: boolean; message: string } | null>(null)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [showHint, setShowHint] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")

  // Sample writing exercises
  const writingExercises: WritingExercise[] = [
    {
      id: 1,
      type: "sentence-completion",
      prompt: "Complete the sentence: The weather today is very ___.",
      instructions: "Fill in the blank with an appropriate word.",
      expectedAnswer: "nice|good|beautiful|sunny|warm|hot|cold|rainy|cloudy|windy",
      hints: ["Think about weather conditions", "It could be sunny, rainy, etc."],
      difficulty: "beginner",
      category: "weather",
    },
    {
      id: 2,
      type: "translation",
      prompt: 'Translate to English: "Mi nombre es John y tengo 25 años."',
      instructions: "Write the English translation of this Spanish sentence.",
      expectedAnswer: "My name is John and I am 25 years old.",
      hints: ["Focus on the basic introduction format", "Remember how to express age in English"],
      difficulty: "beginner",
      category: "introductions",
    },
    {
      id: 3,
      type: "error-correction",
      prompt: 'Correct this sentence: "She go to school every day."',
      instructions: "Find and fix the grammatical error in this sentence.",
      expectedAnswer: "She goes to school every day.",
      hints: ["Look at the subject-verb agreement", "Third person singular verbs often end with -s"],
      difficulty: "beginner",
      category: "grammar",
    },
    {
      id: 4,
      type: "free-writing",
      prompt: "Write 2-3 sentences about your favorite hobby.",
      instructions: "Express your thoughts about something you enjoy doing in your free time.",
      hints: ["Think about what you like to do", "Explain why you enjoy this activity"],
      difficulty: "intermediate",
      category: "hobbies",
    },
    {
      id: 5,
      type: "sentence-completion",
      prompt: "Complete the sentence: If I won the lottery, I ___ a new house.",
      instructions: "Fill in the blank with an appropriate verb phrase.",
      expectedAnswer: "would buy|would purchase|could buy|might buy|will buy",
      hints: ["This is a conditional sentence", "Think about what you would do with a lot of money"],
      difficulty: "intermediate",
      category: "conditionals",
    },
    {
      id: 6,
      type: "translation",
      prompt: 'Translate to English: "J\'adore voyager et découvrir de nouvelles cultures."',
      instructions: "Write the English translation of this French sentence.",
      expectedAnswer: "I love traveling and discovering new cultures.",
      hints: ['Focus on the verb "adore"', "Think about the gerund form of verbs"],
      difficulty: "intermediate",
      category: "travel",
    },
    {
      id: 7,
      type: "error-correction",
      prompt: 'Correct this sentence: "They was watching a movie when I arrived."',
      instructions: "Find and fix the grammatical error in this sentence.",
      expectedAnswer: "They were watching a movie when I arrived.",
      hints: ["Look at the subject-verb agreement", "Check the past continuous form"],
      difficulty: "intermediate",
      category: "grammar",
    },
    {
      id: 8,
      type: "free-writing",
      prompt: "Write a paragraph describing your ideal vacation destination.",
      instructions: "Include details about location, activities, and why you would enjoy it.",
      hints: ["Think about places you'd like to visit", "Consider climate, activities, and scenery"],
      difficulty: "advanced",
      category: "travel",
    },
    {
      id: 9,
      type: "sentence-completion",
      prompt: "Complete the sentence: Despite ___, she managed to finish the project on time.",
      instructions: "Fill in the blank with an appropriate phrase.",
      expectedAnswer: "the difficulties|the challenges|facing many obstacles|having limited time|the setbacks",
      hints: ['This sentence uses "despite" to show contrast', "Think about challenges someone might face"],
      difficulty: "advanced",
      category: "grammar",
    },
    {
      id: 10,
      type: "error-correction",
      prompt: 'Correct this sentence: "The book which I told you about it is very interesting."',
      instructions: "Find and fix the grammatical error in this sentence.",
      expectedAnswer:
        "The book which I told you about is very interesting.|The book about which I told you is very interesting.",
      hints: ["Look for redundant pronouns", "Check the relative clause structure"],
      difficulty: "advanced",
      category: "grammar",
    },
  ]

  // Filter exercises based on selected category and difficulty
  const filteredExercises = writingExercises.filter((exercise) => {
    const categoryMatch = selectedCategory === "all" || exercise.category === selectedCategory
    const difficultyMatch = selectedDifficulty === "all" || exercise.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const currentExercise = filteredExercises[currentExerciseIndex]
  const totalExercises = filteredExercises.length

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("lingualearn_user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setUserId(user.id)
    } else {
      // Redirect to auth page if no user
      router.push("/auth")
    }
  }, [router])

  useEffect(() => {
    // Update progress when current exercise changes
    setProgress((currentExerciseIndex / totalExercises) * 100)
  }, [currentExerciseIndex, totalExercises])

  const handleSubmit = () => {
    if (!currentExercise) return

    let isCorrect = false
    let feedbackMessage = ""

    // Different evaluation based on exercise type
    switch (currentExercise.type) {
      case "sentence-completion":
      case "translation":
      case "error-correction":
        if (currentExercise.expectedAnswer) {
          // Check if answer matches any of the expected answers (separated by |)
          const expectedAnswers = currentExercise.expectedAnswer.toLowerCase().split("|")
          isCorrect = expectedAnswers.some((answer) => userAnswer.toLowerCase().trim() === answer.trim())

          // Check for close matches (80% similarity)
          if (!isCorrect) {
            const closestMatch = expectedAnswers.find(
              (answer) => calculateSimilarity(userAnswer.toLowerCase(), answer.toLowerCase()) > 0.8,
            )

            if (closestMatch) {
              isCorrect = true
              feedbackMessage = "Close enough! The ideal answer would be: " + closestMatch
            } else {
              feedbackMessage = "Not quite right. Try again or check the hint."
            }
          } else {
            feedbackMessage = "Correct! Well done."
          }
        }
        break

      case "free-writing":
        // For free writing, check minimum length and give feedback
        if (userAnswer.length < 10) {
          isCorrect = false
          feedbackMessage = "Please write a more detailed response."
        } else {
          isCorrect = true
          feedbackMessage = "Thank you for your response! Here's some feedback: " + generateWritingFeedback(userAnswer)
        }
        break
    }

    // Update score and show feedback
    if (isCorrect) {
      setScore((prevScore) => prevScore + 10)
    }

    setFeedback({ correct: isCorrect, message: feedbackMessage })
    setIsSubmitted(true)

    // Save progress to database if user is logged in
    if (userId) {
      saveWritingPracticeProgress(userId, currentExercise.id, isCorrect, userAnswer)
    }
  }

  const handleNext = () => {
    if (currentExerciseIndex < filteredExercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1)
      setUserAnswer("")
      setIsSubmitted(false)
      setFeedback(null)
      setShowHint(false)
    } else {
      // End of exercises
      alert(`Practice completed! Your score: ${score}/${filteredExercises.length * 10}`)
      // Could redirect to a results page or back to practice menu
    }
  }

  const handleRetry = () => {
    setUserAnswer("")
    setIsSubmitted(false)
    setFeedback(null)
    setShowHint(false)
  }

  // Simple function to calculate text similarity (for fuzzy matching)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const longer = str1.length > str2.length ? str1 : str2
    const shorter = str1.length > str2.length ? str2 : str1

    if (longer.length === 0) {
      return 1.0
    }

    // Count matching characters
    let matches = 0
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) {
        matches++
      }
    }

    return matches / longer.length
  }

  // Simple feedback generator for free writing
  const generateWritingFeedback = (text: string): string => {
    const feedback = []

    // Length feedback
    if (text.length < 30) {
      feedback.push("Consider writing more to express your thoughts fully.")
    } else if (text.length > 100) {
      feedback.push("Good detailed response!")
    }

    // Sentence structure feedback
    const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    if (sentences.length === 1) {
      feedback.push("Try using more than one sentence to develop your ideas.")
    } else if (sentences.length >= 3) {
      feedback.push("Good use of multiple sentences!")
    }

    // Vocabulary feedback
    const words = text.split(/\s+/).filter((w) => w.length > 0)
    const uniqueWords = new Set(words.map((w) => w.toLowerCase()))
    if (uniqueWords.size < words.length * 0.7) {
      feedback.push("Try to use more varied vocabulary.")
    } else {
      feedback.push("Nice vocabulary variety!")
    }

    return feedback.join(" ")
  }

  // Get unique categories for filter
  const categories = ["all", ...new Set(writingExercises.map((ex) => ex.category))]
  const difficulties = ["all", "beginner", "intermediate", "advanced"]

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push("/practice")} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Practice
        </Button>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-purple-100">
            Score: {score}
          </Badge>
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-center text-purple-800">Writing Practice</h1>
      <p className="text-center text-gray-600 mb-6">Improve your English writing skills with these exercises</p>

      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between mt-1 text-sm text-gray-500">
          <span>
            Exercise {currentExerciseIndex + 1} of {totalExercises}
          </span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      <div className="mb-6">
        <Tabs defaultValue="all" onValueChange={(value) => setSelectedCategory(value)}>
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-medium">Categories</h2>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
            >
              {difficulties.map((diff) => (
                <option key={diff} value={diff}>
                  {diff.charAt(0).toUpperCase() + diff.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <TabsList className="grid grid-cols-4 mb-4">
            {categories.map((category) => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {currentExercise ? (
        <Card className="mb-6 border-2 border-purple-200">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Badge
                variant={
                  currentExercise.difficulty === "beginner"
                    ? "outline"
                    : currentExercise.difficulty === "intermediate"
                      ? "secondary"
                      : "destructive"
                }
              >
                {currentExercise.difficulty}
              </Badge>
              <Badge variant="outline">{currentExercise.type.replace("-", " ")}</Badge>
            </div>
            <CardTitle className="text-xl font-bold text-purple-800 mt-2">{currentExercise.prompt}</CardTitle>
            <p className="text-gray-600">{currentExercise.instructions}</p>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Write your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isSubmitted}
              className="min-h-[120px] focus:border-purple-500"
            />

            {feedback && (
              <div
                className={`mt-4 p-3 rounded-md ${feedback.correct ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
              >
                <div className="flex items-start gap-2">
                  {feedback.correct ? (
                    <CheckCircle className="text-green-500 mt-0.5" size={18} />
                  ) : (
                    <XCircle className="text-red-500 mt-0.5" size={18} />
                  )}
                  <p className={feedback.correct ? "text-green-700" : "text-red-700"}>{feedback.message}</p>
                </div>
              </div>
            )}

            {showHint && currentExercise.hints && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                <div className="flex items-start gap-2">
                  <Lightbulb className="text-yellow-500 mt-0.5" size={18} />
                  <p className="text-yellow-700">{currentExercise.hints[0]}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <div>
              {!isSubmitted && (
                <Button variant="outline" onClick={() => setShowHint(!showHint)} disabled={!currentExercise.hints}>
                  {showHint ? "Hide Hint" : "Show Hint"}
                </Button>
              )}
              {isSubmitted && !feedback?.correct && (
                <Button variant="outline" onClick={handleRetry} className="flex items-center gap-1">
                  <RefreshCw size={14} />
                  Try Again
                </Button>
              )}
            </div>
            <div className="flex gap-2">
              {!isSubmitted ? (
                <Button onClick={handleSubmit} disabled={!userAnswer.trim()}>
                  Check Answer
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  {currentExerciseIndex < filteredExercises.length - 1 ? "Next Exercise" : "Finish Practice"}
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      ) : (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">
            No exercises match your current filters. Try changing the category or difficulty.
          </p>
        </div>
      )}
    </div>
  )
}

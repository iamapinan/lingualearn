"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { saveAssessmentResultEnhanced, skipAssessment } from "@/lib/database"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"

// Sample assessment questions
const assessmentQuestions = [
  {
    id: 1,
    question: "What is the English word for 'สวัสดี'?",
    options: ["Goodbye", "Thank you", "Hello", "Please"],
    correctAnswer: "Hello",
  },
  {
    id: 2,
    question: "What is the opposite of 'hot'?",
    options: ["Cold", "Warm", "Cool", "Boiling"],
    correctAnswer: "Cold",
  },
  {
    id: 3,
    question: "Which word means 'แมว' in English?",
    options: ["Dog", "Cat", "Bird", "Fish"],
    correctAnswer: "Cat",
  },
  {
    id: 4,
    question: "Complete the sentence: 'He ___ a book yesterday.'",
    options: ["read", "reads", "reading", "readed"],
    correctAnswer: "read",
  },
  {
    id: 5,
    question: "What is the plural form of 'child'?",
    options: ["Childs", "Children", "Childes", "Child"],
    correctAnswer: "Children",
  },
  {
    id: 6,
    question: "Which of the following is a synonym for 'happy'?",
    options: ["Sad", "Joyful", "Angry", "Tired"],
    correctAnswer: "Joyful",
  },
  {
    id: 7,
    question: "What is the past participle of 'go'?",
    options: ["Went", "Gone", "Going", "Goes"],
    correctAnswer: "Gone",
  },
  {
    id: 8,
    question: "Choose the correct sentence: 'She ___ never been to Paris.'",
    options: ["has", "have", "had", "having"],
    correctAnswer: "has",
  },
  {
    id: 9,
    question: "What does the idiom 'break the ice' mean?",
    options: ["To shatter ice", "To start a conversation", "To cool down", "To make a mistake"],
    correctAnswer: "To start a conversation",
  },
  {
    id: 10,
    question: "Which sentence uses the subjunctive mood correctly?",
    options: [
      "If I was you, I would go.",
      "If I were you, I would go.",
      "If I am you, I would go.",
      "If I be you, I would go."
    ],
    correctAnswer: "If I were you, I would go.",
  },
]

export default function AssessmentPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showSkipDialog, setShowSkipDialog] = useState(false)

  const handleStartAssessment = () => {
    setStep(1)
  }

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers, answer]
    setAnswers(newAnswers)

    // Check if answer is correct
    if (answer === assessmentQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1)
    }

    // Move to next question or finish
    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Calculate level based on score
      const newLevel = Math.max(1, Math.ceil(((score + 1) / assessmentQuestions.length) * 5))
      setLevel(newLevel)
      setStep(2)
    }
  }

  const handleFinish = async () => {
    if (!user) return

    setLoading(true)

    try {
      // Calculate recommended lesson based on level
      const recommendedLesson = level * 2

      // Save assessment result
      await saveAssessmentResultEnhanced(user.id, {
        score: (score / assessmentQuestions.length) * 100,
        level,
        recommendedLessonId: recommendedLesson,
        completedAt: new Date().toISOString(),
        xpAwarded: 50 + score * 10, // Base XP + bonus for correct answers
        autoUnlock: true,
      })

      // Redirect to home page with full page reload to ensure sidebar appears
      window.location.href = "/"
    } catch (error) {
      console.error("Error saving assessment result:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSkipAssessment = async () => {
    if (!user) return

    setLoading(true)

    try {
      await skipAssessment(user.id)
      // Redirect to home page with full page reload to ensure sidebar appears
      window.location.href = "/"
    } catch (error) {
      console.error("Error skipping assessment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      {step === 0 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl md:text-3xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-500" />
              English Proficiency Assessment
            </CardTitle>
            <CardDescription>Let's assess your English level to personalize your learning experience</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              This short assessment will help us understand your current English proficiency level. We'll use this
              information to recommend appropriate lessons and create a personalized learning path for you.
            </p>
            <p className="mb-4">
              The assessment consists of {assessmentQuestions.length} questions and takes about 2-3 minutes to complete.
            </p>
            <p>Ready to start?</p>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">Skip Assessment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Skip Assessment?</DialogTitle>
                  <DialogDescription>
                    If you skip the assessment, we'll start you at the beginner level. You can always take the
                    assessment later.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-between sm:justify-between">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSkipAssessment} disabled={loading}>
                    {loading ? "Skipping..." : "Skip and Start Learning"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Button onClick={handleStartAssessment} className="ml-auto">
              Start Assessment <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardFooter>
        </Card>
      )}

      {step === 1 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-xl">
              Question {currentQuestion + 1} of {assessmentQuestions.length}
            </CardTitle>
            <CardDescription>Select the correct answer</CardDescription>
          </CardHeader>
          <CardContent>
            <h3 className="text-lg font-medium mb-4">{assessmentQuestions[currentQuestion].question}</h3>
            <div className="grid gap-3">
              {assessmentQuestions[currentQuestion].options.map((option) => (
                <Button
                  key={option}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left"
                  onClick={() => handleAnswer(option)}
                >
                  {option}
                </Button>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">Skip Assessment</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Skip Assessment?</DialogTitle>
                  <DialogDescription>
                    If you skip the assessment, we'll start you at the beginner level. You can always take the
                    assessment later.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-between sm:justify-between">
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button onClick={handleSkipAssessment} disabled={loading}>
                    {loading ? "Skipping..." : "Skip and Start Learning"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <div className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {assessmentQuestions.length}
            </div>
          </CardFooter>
        </Card>
      )}

      {step === 2 && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="h-6 w-6 text-indigo-500" />
              Assessment Complete!
            </CardTitle>
            <CardDescription>Here are your results</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
              <h3 className="text-lg font-medium mb-2">Your English level: {level}/5</h3>
              <p className="text-sm text-muted-foreground mb-2">
                You answered {score} out of {assessmentQuestions.length} questions correctly.
              </p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${(level / 5) * 100}%` }}></div>
              </div>
            </div>

            <h4 className="font-medium mb-2">What this means:</h4>
            <p className="mb-4">
              Based on your assessment, we've created a personalized learning path for you. You'll start with lessons
              that match your current level and gradually progress to more advanced content.
            </p>
            <p>Ready to start learning?</p>
          </CardContent>
          <CardFooter>
            <Button onClick={handleFinish} disabled={loading} className="w-full">
              {loading ? "Preparing your lessons..." : "Start Learning"}
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}

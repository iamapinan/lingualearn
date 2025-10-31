"use client"

import { useState } from "react"
import { CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

interface WritingFeedbackProps {
  userAnswer: string
  expectedAnswer?: string
  type: "sentence-completion" | "translation" | "free-writing" | "error-correction"
  onClose: () => void
}

export function WritingFeedback({ userAnswer, expectedAnswer, type, onClose }: WritingFeedbackProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Analyze the writing based on type
  const analyzeWriting = () => {
    if (type === "free-writing") {
      return analyzeFreeWriting(userAnswer)
    } else if (expectedAnswer) {
      return compareWithExpected(userAnswer, expectedAnswer)
    }
    return { correct: false, feedback: [], suggestions: [] }
  }

  const { correct, feedback, suggestions } = analyzeWriting()

  return (
    <Card className={`border-l-4 ${correct ? "border-l-green-500" : "border-l-amber-500"}`}>
      <CardContent className="pt-6">
        <div className="flex items-start gap-3">
          {correct ? <CheckCircle className="text-green-500 mt-1" /> : <AlertCircle className="text-amber-500 mt-1" />}

          <div className="flex-1">
            <h3 className={`font-medium text-lg ${correct ? "text-green-700" : "text-amber-700"}`}>
              {correct ? "Well done!" : "Almost there!"}
            </h3>

            <div className="mt-2 space-y-2">
              {feedback.map((item, i) => (
                <p key={i} className="text-gray-700">
                  {item}
                </p>
              ))}

              {!correct && expectedAnswer && type !== "free-writing" && (
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={() => setShowDetails(!showDetails)}>
                    {showDetails ? "Hide Correct Answer" : "Show Correct Answer"}
                  </Button>

                  {showDetails && (
                    <div className="mt-2 p-3 bg-gray-50 rounded border">
                      <p className="text-sm text-gray-500 mb-1">Correct answer:</p>
                      <p className="font-medium">{expectedAnswer.split("|")[0]}</p>
                    </div>
                  )}
                </div>
              )}

              {suggestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700">Suggestions for improvement:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    {suggestions.map((suggestion, i) => (
                      <li key={i} className="text-gray-600 text-sm">
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="mt-4">
              <Button size="sm" onClick={onClose}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper functions for analyzing writing
function compareWithExpected(userAnswer: string, expectedAnswer: string) {
  const expectedOptions = expectedAnswer.toLowerCase().split("|")
  const userText = userAnswer.toLowerCase().trim()

  // Check for exact match
  if (expectedOptions.some((option) => option.trim() === userText)) {
    return {
      correct: true,
      feedback: ["Your answer matches the expected response perfectly!"],
      suggestions: [],
    }
  }

  // Check for close match (80% similarity)
  const closestMatch = expectedOptions.find((option) => calculateSimilarity(userText, option.toLowerCase()) > 0.8)

  if (closestMatch) {
    return {
      correct: true,
      feedback: ["Your answer is very close to the expected response."],
      suggestions: [`Consider: "${closestMatch}"`],
    }
  }

  // No match
  return {
    correct: false,
    feedback: ["Your answer differs from the expected response."],
    suggestions: [
      "Check your spelling and grammar",
      "Make sure you understood the question correctly",
      `One possible correct answer is: "${expectedOptions[0]}"`,
    ],
  }
}

function analyzeFreeWriting(text: string) {
  const feedback = []
  const suggestions = []

  // Length analysis
  const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length

  if (wordCount < 5) {
    feedback.push("Your response is very brief.")
    suggestions.push("Try to write a more detailed response with complete sentences.")
    return { correct: false, feedback, suggestions }
  }

  if (wordCount < 15) {
    feedback.push(`You wrote ${wordCount} words. This is a good start.`)
    suggestions.push("Consider expanding your ideas with more details or examples.")
  } else if (wordCount >= 30) {
    feedback.push(`Excellent! You wrote ${wordCount} words with good detail.`)
  } else {
    feedback.push(`You wrote ${wordCount} words, which is a good length.`)
  }

  // Sentence structure analysis
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  if (sentences.length === 1) {
    suggestions.push("Try using more than one sentence to develop your ideas.")
  } else if (sentences.length >= 3) {
    feedback.push("Good use of multiple sentences to express your thoughts!")
  }

  // Vocabulary analysis
  const words = text.split(/\s+/).filter((w) => w.length > 0)
  const uniqueWords = new Set(words.map((w) => w.toLowerCase()))

  if (uniqueWords.size < words.length * 0.7) {
    suggestions.push("Try to use more varied vocabulary to make your writing more interesting.")
  } else {
    feedback.push("You used a good variety of vocabulary!")
  }

  // Overall assessment
  const correct = wordCount >= 15 && sentences.length >= 2

  return { correct, feedback, suggestions }
}

// Simple function to calculate text similarity
function calculateSimilarity(str1: string, str2: string): number {
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

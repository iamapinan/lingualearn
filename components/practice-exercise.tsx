"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { PracticeExercise } from "@/lib/practice-types"
import { playAudioForWord, playCorrectSound, playIncorrectSound } from "@/lib/audio-utils"
import { Check, X, VolumeIcon, Mic, ArrowRight, HelpCircle } from "lucide-react"

interface PracticeExerciseComponentProps {
  exercise: PracticeExercise
  onComplete: (result: { correct: boolean; score: number }) => void
  onNext?: () => void
  showNext?: boolean
}

export function PracticeExerciseComponent({
  exercise,
  onComplete,
  onNext,
  showNext = true,
}: PracticeExerciseComponentProps) {
  const [userAnswer, setUserAnswer] = useState<string>("")
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)
  const [feedback, setFeedback] = useState<string>("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [timeLeft, setTimeLeft] = useState(exercise.timeLimit || 0)

  // Timer for timed exercises
  useEffect(() => {
    if (exercise.timeLimit && timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && exercise.timeLimit && !isSubmitted) {
      handleSubmit()
    }
  }, [timeLeft, isSubmitted, exercise.timeLimit])

  const handlePlayAudio = () => {
    if (exercise.questionFormat === "listening" || exercise.questionFormat === "dictation") {
      playAudioForWord(exercise.content.audio, "en")
    } else if (exercise.questionFormat === "speaking" && exercise.content.audioSample) {
      playAudioForWord(exercise.content.audioSample, "en")
    }
  }

  const handleOptionSelect = (option: string) => {
    if (isSubmitted) return
    setSelectedOption(option)
  }

  const handleStartListening = () => {
    if (isSubmitted) return
    setIsListening(true)
    // Implement speech recognition logic here
    // For now, we'll simulate it
    setTimeout(() => {
      setIsListening(false)
      setUserAnswer(exercise.content.word || exercise.content.sentence || "")
    }, 2000)
  }

  const handleSubmit = () => {
    if (isSubmitted) return

    let correct = false
    let feedbackText = ""

    switch (exercise.questionFormat) {
      case "multiple-choice":
        if (!selectedOption) {
          correct = false
        } else {
          correct = selectedOption === exercise.content.correctAnswer
        }
        break
      case "fill-blank":
        if (!userAnswer.trim()) {
          correct = false
        } else if (exercise.content.acceptMultiple && Array.isArray(exercise.content.options)) {
          correct = exercise.content.options.some(
            (option) => userAnswer.toLowerCase().trim() === option.toLowerCase().trim(),
          )
        } else {
          correct = userAnswer.toLowerCase().trim() === exercise.content.correctAnswer.toLowerCase().trim()
        }
        break
      case "dictation":
        // Simple string comparison with allowed errors
        const allowedErrors = exercise.content.allowedErrors || 0
        const distance = levenshteinDistance(
          userAnswer.toLowerCase().trim(),
          exercise.content.correctAnswer.toLowerCase(),
        )
        correct = distance <= allowedErrors
        break
      case "speaking":
        // In a real implementation, this would compare the speech recognition result
        // with the expected word/sentence using a confidence score
        // For now, let's compare the userAnswer with the expected word/sentence
        if (exercise.content.word) {
          correct = userAnswer.toLowerCase().trim() === exercise.content.word.toLowerCase().trim()
        } else if (exercise.content.sentence) {
          correct = userAnswer.toLowerCase().trim() === exercise.content.sentence.toLowerCase().trim()
        } else {
          correct = false // Default to false if no comparison can be made
        }
        break
      case "free-response":
        // For free response, we can check minimum length or specific keywords
        if (exercise.content.minWords) {
          const wordCount = userAnswer.trim().split(/\s+/).length
          correct = wordCount >= exercise.content.minWords
        } else if (exercise.content.correctAnswer) {
          // If there's a specific correct answer (like in error correction)
          correct = userAnswer.toLowerCase().trim() === exercise.content.correctAnswer.toLowerCase().trim()
        } else {
          // Otherwise, just check that they wrote something
          correct = userAnswer.trim().length > 0
        }
        break
      default:
        correct = false
    }

    feedbackText = correct
      ? exercise.feedback?.correct || "Correct!"
      : exercise.feedback?.incorrect || "Incorrect. Try again."

    if (correct) {
      playCorrectSound()
    } else {
      playIncorrectSound()
    }

    console.log("Answer validation:", {
      questionFormat: exercise.questionFormat,
      userAnswer,
      selectedOption,
      correctAnswer: exercise.content.correctAnswer,
      isCorrect: correct,
    })

    setIsCorrect(correct)
    setFeedback(feedbackText)
    setIsSubmitted(true)
    onComplete({ correct, score: correct ? 10 : 0 })
  }

  const renderQuestionContent = () => {
    switch (exercise.questionFormat) {
      case "multiple-choice":
        return (
          <div className="space-y-3">
            {exercise.content.question && <p className="font-medium mb-2">{exercise.content.question}</p>}
            {exercise.content.passage && (
              <div className="bg-indigo-50 p-4 rounded-md mb-4">
                <p className="whitespace-pre-line">{exercise.content.passage}</p>
              </div>
            )}
            {exercise.content.sentence && (
              <div className="bg-indigo-50 p-4 rounded-md mb-4">
                <p
                  dangerouslySetInnerHTML={{
                    __html: exercise.content.sentence.replace(
                      /\*\*(.*?)\*\*/g,
                      '<span class="font-bold text-indigo-700">$1</span>',
                    ),
                  }}
                />
              </div>
            )}
            {exercise.content.dialogueText && (
              <div className="bg-indigo-50 p-4 rounded-md mb-4">
                <p className="whitespace-pre-line">{exercise.content.dialogueText}</p>
                <Button onClick={handlePlayAudio} size="sm" variant="outline" className="mt-2">
                  <VolumeIcon className="h-4 w-4 mr-2" />
                  Play Dialogue
                </Button>
              </div>
            )}
            <div className="grid grid-cols-1 gap-2">
              {exercise.content.options.map((option: string, index: number) => (
                <Button
                  key={index}
                  variant={selectedOption === option ? "default" : "outline"}
                  className={`justify-start h-auto py-3 px-4 ${
                    isSubmitted && option === exercise.content.correctAnswer
                      ? "bg-green-100 border-green-500 text-green-700"
                      : isSubmitted && option === selectedOption && option !== exercise.content.correctAnswer
                        ? "bg-red-100 border-red-500 text-red-700"
                        : ""
                  }`}
                  onClick={() => handleOptionSelect(option)}
                  disabled={isSubmitted}
                >
                  {exercise.content.isImageOption ? (
                    <img src={option || "/placeholder.svg"} alt="Option" className="h-12 w-12 object-contain" />
                  ) : (
                    option
                  )}
                  {isSubmitted && option === exercise.content.correctAnswer && (
                    <Check className="ml-auto h-5 w-5 text-green-500" />
                  )}
                  {isSubmitted && option === selectedOption && option !== exercise.content.correctAnswer && (
                    <X className="ml-auto h-5 w-5 text-red-500" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        )

      case "fill-blank":
        return (
          <div className="space-y-3">
            <p className="font-medium mb-2">{exercise.content.sentence.replace("___", "________")}</p>
            {exercise.content.hint && showHint && (
              <div className="bg-yellow-50 p-3 rounded-md mb-3 text-sm">
                <p className="flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 text-yellow-500" />
                  <span>{exercise.content.hint}</span>
                </p>
              </div>
            )}
            <Input
              type="text"
              placeholder="Type your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isSubmitted}
              className="w-full"
            />
            {exercise.content.hint && !showHint && (
              <Button variant="ghost" size="sm" onClick={() => setShowHint(true)} className="text-indigo-600">
                <HelpCircle className="h-4 w-4 mr-1" /> Show hint
              </Button>
            )}
          </div>
        )

      case "dictation":
        return (
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <Button onClick={handlePlayAudio} className="bg-indigo-600 hover:bg-indigo-700 h-16 w-16 rounded-full">
                <VolumeIcon className="h-8 w-8" />
              </Button>
            </div>
            <p className="text-center text-sm text-gray-500 mb-4">Listen to the audio and type what you hear</p>
            <Textarea
              placeholder="Type what you hear..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isSubmitted}
              className="w-full min-h-[100px]"
            />
          </div>
        )

      case "speaking":
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center mb-4">
              <p className="font-medium mb-4">{exercise.content.word || exercise.content.sentence}</p>
              <Button onClick={handlePlayAudio} variant="outline" className="mb-4">
                <VolumeIcon className="h-5 w-5 mr-2" />
                Listen to pronunciation
              </Button>
              <Button
                onClick={handleStartListening}
                disabled={isListening || isSubmitted}
                className={`h-16 w-16 rounded-full ${isListening ? "bg-red-500 animate-pulse" : "bg-indigo-600"}`}
              >
                <Mic className="h-8 w-8" />
              </Button>
              <p className="text-sm text-gray-500 mt-2">{isListening ? "Listening..." : "Click to speak"}</p>
            </div>
            {exercise.content.focusSound && (
              <div className="bg-indigo-50 p-3 rounded-md text-sm">
                <p>
                  Focus on the <span className="font-bold">{exercise.content.focusSound}</span> sound
                </p>
              </div>
            )}
          </div>
        )

      case "free-response":
        return (
          <div className="space-y-3">
            <div className="bg-indigo-50 p-4 rounded-md mb-2">
              <p className="font-medium">{exercise.content.prompt || exercise.content.sentence}</p>
            </div>
            {exercise.content.hint && showHint && (
              <div className="bg-yellow-50 p-3 rounded-md mb-3 text-sm">
                <p className="flex items-center">
                  <HelpCircle className="h-4 w-4 mr-2 text-yellow-500" />
                  <span>{exercise.content.hint}</span>
                </p>
              </div>
            )}
            <Textarea
              placeholder="Write your answer here..."
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              disabled={isSubmitted}
              className="w-full min-h-[150px]"
            />
            {exercise.content.minWords && (
              <p className="text-sm text-gray-500">
                Word count: {userAnswer.trim().split(/\s+/).length} / Minimum: {exercise.content.minWords}
              </p>
            )}
            {exercise.content.suggestedVocabulary && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700">Suggested vocabulary:</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {exercise.content.suggestedVocabulary.map((word: string, index: number) => (
                    <span key={index} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {(exercise.content.hint || exercise.content.suggestedStructure) && !showHint && (
              <Button variant="ghost" size="sm" onClick={() => setShowHint(true)} className="text-indigo-600">
                <HelpCircle className="h-4 w-4 mr-1" /> Show hint
              </Button>
            )}
          </div>
        )

      default:
        return <p>Unsupported question format</p>
    }
  }

  return (
    <Card className="w-full border-indigo-100 shadow-md">
      <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl text-indigo-800">{exercise.title}</CardTitle>
          {exercise.timeLimit && (
            <div className="bg-white px-3 py-1 rounded-full text-sm font-medium text-indigo-700">{timeLeft}s</div>
          )}
        </div>
        <p className="text-gray-600">{exercise.instructions}</p>
      </CardHeader>
      <CardContent className="p-6">{renderQuestionContent()}</CardContent>
      <CardFooter className="flex flex-col">
        {isSubmitted && (
          <div
            className={`w-full p-3 rounded-md mb-4 ${
              isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
            }`}
          >
            <div className="flex items-start gap-2">
              {isCorrect ? <Check className="h-5 w-5 mt-0.5" /> : <X className="h-5 w-5 mt-0.5" />}
              <p>{feedback}</p>
            </div>
          </div>
        )}
        <div className="flex justify-between w-full">
          {!isSubmitted ? (
            <Button
              onClick={handleSubmit}
              disabled={
                (exercise.questionFormat === "multiple-choice" && !selectedOption) ||
                (exercise.questionFormat !== "multiple-choice" &&
                  exercise.questionFormat !== "speaking" &&
                  !userAnswer.trim())
              }
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Check Answer
            </Button>
          ) : (
            showNext && (
              <Button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-700">
                Next Exercise
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )
          )}
        </div>
      </CardFooter>
    </Card>
  )
}

// Helper function to calculate Levenshtein distance for fuzzy string matching
function levenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = []

  // Initialize matrix
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  // Fill matrix
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        )
      }
    }
  }

  return matrix[b.length][a.length]
}

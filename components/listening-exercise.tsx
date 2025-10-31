"use client"

import { Button } from "@/components/ui/button"
import { Check, X, VolumeIcon as VolumeUp } from "lucide-react"

interface ListeningExerciseProps {
  options: string[]
  onSelect: (answer: string) => void
  selectedAnswer: string | null
  isCorrect: boolean | null
  correctAnswer: string
  onPlayAudio: () => void
  disabled: boolean
}

export function ListeningExercise({
  options,
  onSelect,
  selectedAnswer,
  isCorrect,
  correctAnswer,
  onPlayAudio,
  disabled,
}: ListeningExerciseProps) {
  return (
    <div className="space-y-4">
      <Button onClick={onPlayAudio} className="mb-4 bg-indigo-500 hover:bg-indigo-600 text-white" disabled={disabled}>
        <VolumeUp className="h-5 w-5 mr-2" />
        Listen to the word
      </Button>

      <div className="grid gap-2">
        {options.map((option, index) => (
          <Button
            key={index}
            variant={selectedAnswer === option ? "default" : "outline"}
            className={`justify-start h-auto py-3 px-4 ${
              isCorrect !== null && option === correctAnswer
                ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                : isCorrect === false && option === selectedAnswer
                  ? "bg-red-100 border-red-500 text-red-700"
                  : ""
            }`}
            onClick={() => onSelect(option)}
            disabled={disabled}
          >
            {option}
            {isCorrect !== null && option === correctAnswer && <Check className="ml-auto h-5 w-5 text-indigo-500" />}
            {isCorrect === false && option === selectedAnswer && <X className="ml-auto h-5 w-5 text-red-500" />}
          </Button>
        ))}
      </div>

      {isCorrect !== null && (
        <div className={`p-3 rounded-md ${isCorrect ? "bg-indigo-100 text-indigo-700" : "bg-red-100 text-red-700"}`}>
          <div className="flex items-center gap-2">
            {isCorrect ? <Check className="h-5 w-5" /> : <X className="h-5 w-5" />}
            <p>{isCorrect ? "Correct!" : `Incorrect. The correct answer is: "${correctAnswer}"`}</p>
          </div>
        </div>
      )}
    </div>
  )
}

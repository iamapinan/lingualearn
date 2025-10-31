"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { VolumeIcon as VolumeUp, CheckCircle, X, Star } from "lucide-react"

interface ThaiVocabWord {
  id: number
  thai: string
  english: string
  phonetic: string
  category: string
}

const thaiVocabulary: ThaiVocabWord[] = [
  { id: 1, thai: "สวัสดี", english: "Hello", phonetic: "Sà-wàt-dee", category: "greetings" },
  { id: 2, thai: "ขอบคุณ", english: "Thank you", phonetic: "Kòp-kun", category: "greetings" },
  { id: 3, thai: "ชื่อ", english: "Name", phonetic: "Chûe", category: "basics" },
  { id: 4, thai: "กิน", english: "Eat", phonetic: "Gin", category: "verbs" },
  { id: 5, thai: "ดื่ม", english: "Drink", phonetic: "Dèum", category: "verbs" },
  { id: 6, thai: "น้ำ", english: "Water", phonetic: "Nám", category: "food" },
  { id: 7, thai: "อาหาร", english: "Food", phonetic: "Aa-hǎan", category: "food" },
  { id: 8, thai: "คน", english: "Person", phonetic: "Kon", category: "basics" },
  { id: 9, thai: "ร้าน", english: "Shop", phonetic: "Ráan", category: "places" },
  { id: 10, thai: "บ้าน", english: "House", phonetic: "Bâan", category: "places" },
]

interface ThaiVocabPracticeProps {
  onComplete: (score: number, learned: number) => void
}

export function ThaiVocabPractice({ onComplete }: ThaiVocabPracticeProps) {
  const [words, setWords] = useState<ThaiVocabWord[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [showPhonetic, setShowPhonetic] = useState(false)
  const [correctCount, setCorrectCount] = useState(0)
  const [progress, setProgress] = useState(0)
  const [isPracticeComplete, setIsPracticeComplete] = useState(false)
  const [pointsEarned, setPointsEarned] = useState(0)

  useEffect(() => {
    // Shuffle words for practice
    const shuffled = [...thaiVocabulary].sort(() => Math.random() - 0.5)
    setWords(shuffled.slice(0, 5)) // Take 5 random words for practice
  }, [])

  useEffect(() => {
    setProgress((currentIndex / words.length) * 100)
  }, [currentIndex, words.length])

  const playAudio = (text: string, isEnglish = false) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = isEnglish ? "en-US" : "th-TH"
    window.speechSynthesis.speak(utterance)
  }

  const handleKnowClick = () => {
    const newPointsEarned = pointsEarned + 10
    setPointsEarned(newPointsEarned)
    setCorrectCount((prev) => prev + 1)
    nextWord()
  }

  const handleDontKnowClick = () => {
    nextWord()
  }

  const nextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setShowTranslation(false)
      setShowPhonetic(false)
    } else {
      // Practice complete
      setIsPracticeComplete(true)
      onComplete(correctCount * 10, correctCount)
    }
  }

  if (words.length === 0) {
    return <div className="text-center">Loading...</div>
  }

  const currentWord = words[currentIndex]

  if (isPracticeComplete) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Practice Complete!</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-bold text-xl">{pointsEarned} points earned</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-indigo-500" />
              <span>You learned {correctCount} new Thai words</span>
            </div>
          </div>

          <Button
            className="bg-indigo-500 hover:bg-indigo-600"
            onClick={() => {
              // Reset and start again
              const shuffled = [...thaiVocabulary].sort(() => Math.random() - 0.5)
              setWords(shuffled.slice(0, 5))
              setCurrentIndex(0)
              setCorrectCount(0)
              setProgress(0)
              setPointsEarned(0)
              setIsPracticeComplete(false)
            }}
          >
            Practice Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Thai Vocabulary</span>
          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-md">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-bold text-yellow-700">{pointsEarned}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1 text-sm">
            <span>Progress</span>
            <span>
              {currentIndex + 1} / {words.length}
            </span>
          </div>
          <Progress value={progress} className="h-2 bg-gray-200" />
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="text-4xl mb-3">🇹🇭</div>
          <div className="text-3xl font-bold mb-3">{currentWord.thai}</div>
          <Button variant="outline" size="sm" className="mb-3" onClick={() => playAudio(currentWord.thai)}>
            <VolumeUp className="mr-2 h-4 w-4" /> Listen
          </Button>

          {showPhonetic && <div className="text-md italic text-gray-600 mb-2">{currentWord.phonetic}</div>}

          {!showPhonetic && (
            <Button variant="ghost" size="sm" className="mb-3" onClick={() => setShowPhonetic(true)}>
              Show Pronunciation
            </Button>
          )}

          {showTranslation ? (
            <div className="text-xl font-semibold text-indigo-600 mb-4">{currentWord.english}</div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              className="mb-4"
              onClick={() => {
                setShowTranslation(true)
                playAudio(currentWord.english, true)
              }}
            >
              Show Translation
            </Button>
          )}
        </div>

        <div className="flex gap-3 justify-center">
          <Button variant="outline" className="flex-1 border-red-200 hover:bg-red-50" onClick={handleDontKnowClick}>
            <X className="mr-2 h-5 w-5 text-red-500" />
            Don't Know
          </Button>
          <Button className="flex-1 bg-indigo-500 hover:bg-indigo-600" onClick={handleKnowClick}>
            <CheckCircle className="mr-2 h-5 w-5" />I Know This
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

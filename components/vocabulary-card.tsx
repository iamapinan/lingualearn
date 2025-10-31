"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VolumeIcon as VolumeUp, Star } from "lucide-react"
import { useState, useEffect } from "react"

interface VocabularyCardProps {
  word: string
  translation: string
  englishTranslation?: string // For non-English languages, showing English translation as well
  languageEmoji: string
  showTranslation: boolean
  onFlip: () => void
  onPlayAudio: () => void
  points?: number // Points earned for this word
  isEnglishToThai?: boolean // Flag for English to Thai vocabulary
}

export function VocabularyCard({
  word,
  translation,
  englishTranslation,
  languageEmoji,
  showTranslation,
  onFlip,
  onPlayAudio,
  points = 10,
  isEnglishToThai = false,
}: VocabularyCardProps) {
  const [showPoints, setShowPoints] = useState(false)

  // Show points animation briefly when card is flipped
  useEffect(() => {
    if (showTranslation) {
      setShowPoints(true)
      const timer = setTimeout(() => {
        setShowPoints(false)
      }, 2000)

      return () => clearTimeout(timer)
    }
  }, [showTranslation])

  return (
    <div className="perspective-1000">
      <div
        className={`relative w-full transition-transform duration-500 transform-style-3d ${
          showTranslation ? "rotate-y-180" : ""
        }`}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of card (word) */}
        <Card className={`w-full h-64 cursor-pointer ${showTranslation ? "invisible" : ""}`} onClick={onFlip}>
          <CardContent className="p-6 flex flex-col items-center justify-center h-full">
            <div className="text-4xl mb-4">{isEnglishToThai ? "🇬🇧" : languageEmoji}</div>
            <h2 className="text-3xl font-bold mb-4">{word}</h2>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4"
              onClick={(e) => {
                e.stopPropagation()
                onPlayAudio()
              }}
            >
              <VolumeUp className="h-5 w-5" />
            </Button>
            <p className="text-sm text-gray-500">Tap to reveal translation</p>
          </CardContent>
        </Card>

        {/* Back of card (translation) */}
        <Card
          className={`w-full h-64 cursor-pointer absolute top-0 left-0 rotate-y-180 ${
            showTranslation ? "" : "invisible"
          }`}
          onClick={onFlip}
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <CardContent className="p-6 flex flex-col items-center justify-center h-full relative">
            <div className="text-4xl mb-2">{isEnglishToThai ? "🇹🇭" : ""}</div>
            <h2 className="text-3xl font-bold mb-2">{translation}</h2>

            {englishTranslation && <p className="text-md text-gray-600 mb-4">({englishTranslation})</p>}

            {/* Points display */}
            {showPoints && (
              <div className="absolute top-4 right-4 flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-md animate-bounce">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="font-bold text-yellow-700">+{points}</span>
              </div>
            )}

            <p className="text-sm text-gray-500">Tap to see word</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

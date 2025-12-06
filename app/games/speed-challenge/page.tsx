"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { getUserVocabulary, saveGameResult } from "@/lib/database"
import { playCorrectSound, playIncorrectSound, playLevelCompleteSound } from "@/lib/audio-utils"
import { Clock, Star, Trophy, RefreshCw, Home, VolumeIcon as VolumeUp } from "lucide-react"
import { BackButton } from "@/components/back-button"

interface VocabularyItem {
  id: number
  word: string
  translation: string
}

// Default vocabulary for new users
const defaultVocabulary: VocabularyItem[] = [
  { id: 10001, word: "hello", translation: "สวัสดี" },
  { id: 10002, word: "thank you", translation: "ขอบคุณ" },
  { id: 10003, word: "please", translation: "กรุณา" },
  { id: 10004, word: "water", translation: "น้ำ" },
  { id: 10005, word: "apple", translation: "แอปเปิล" },
  { id: 10006, word: "house", translation: "บ้าน" },
  { id: 10007, word: "happy", translation: "มีความสุข" },
  { id: 10008, word: "table", translation: "โต๊ะ" },
  { id: 10009, word: "chair", translation: "เก้าอี้" },
  { id: 10010, word: "book", translation: "หนังสือ" },
  { id: 10011, word: "school", translation: "โรงเรียน" },
  { id: 10012, word: "friend", translation: "เพื่อน" },
  { id: 10013, word: "music", translation: "เพลง" },
  { id: 10014, word: "color", translation: "สี" },
  { id: 10015, word: "study", translation: "เรียน" },
  { id: 10016, word: "travel", translation: "เดินทาง" },
  { id: 10017, word: "family", translation: "ครอบครัว" },
  { id: 10018, word: "world", translation: "โลก" },
  { id: 10019, word: "dream", translation: "ความฝัน" },
  { id: 10020, word: "love", translation: "รัก" },
]

export default function SpeedChallengePage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const { toast } = useToast()

  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready")
  const [loading, setLoading] = useState(true)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [totalAnswers, setTotalAnswers] = useState(0)
  const [questionType, setQuestionType] = useState<"en-to-th" | "th-to-en">("en-to-th")

  const inputRef = useRef<HTMLInputElement>(null)

  // Load vocabulary
  useEffect(() => {
    const loadVocabulary = async () => {
      if (!user) {
        router.push("/auth")
        return
      }

      try {
        const userVocab = await getUserVocabulary(user.id)

        // Filter to only include items with English words and Thai translations
        const filteredVocab = userVocab
          .filter((item) => item.languageCode === "en")
          .map((item) => ({
            id: item.id,
            word: item.word,
            translation: item.translation,
          }))

        // Use default vocabulary as fallback if user has no vocabulary
        const finalVocab = filteredVocab.length > 0 ? filteredVocab : defaultVocabulary

        // Shuffle the vocabulary
        const shuffledVocab = [...finalVocab].sort(() => Math.random() - 0.5)

        setVocabulary(shuffledVocab)
        setLoading(false)
      } catch (error) {
        console.error("Error loading vocabulary:", error)
        // Use default vocabulary on error
        const shuffledVocab = [...defaultVocabulary].sort(() => Math.random() - 0.5)
        setVocabulary(shuffledVocab)
        setLoading(false)
      }
    }

    loadVocabulary()
  }, [user, router])

  // Timer for the game
  useEffect(() => {
    let timer: NodeJS.Timeout

    if (gameState === "playing" && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && gameState === "playing") {
      endGame()
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [timeLeft, gameState])

  // Focus input when game starts
  useEffect(() => {
    if (gameState === "playing" && inputRef.current) {
      inputRef.current.focus()
    }
  }, [gameState, currentWordIndex])

  const startGame = () => {
    if (vocabulary.length === 0) {
      toast({
        title: "No vocabulary available",
        description: "Please add some vocabulary items first",
        variant: "destructive",
      })
      return
    }

    setGameState("playing")
    setCurrentWordIndex(0)
    setScore(0)
    setTimeLeft(60)
    setCorrectAnswers(0)
    setTotalAnswers(0)
    setUserInput("")

    // Randomly choose question type
    setQuestionType(Math.random() > 0.5 ? "en-to-th" : "th-to-en")
  }

  const endGame = async () => {
    setGameState("finished")

    // Play game over sound
    playLevelCompleteSound()

    // Save score to localStorage
    if (user) {
      const gameId = "speed-challenge"
      const storedScoresStr = localStorage.getItem(`lingualearn_game_scores_${user.id}`)
      const storedScores = storedScoresStr ? JSON.parse(storedScoresStr) : {}

      const currentGameData = storedScores[gameId] || { bestScore: 0, timesPlayed: 0 }
      const newGameData = {
        gameId,
        bestScore: Math.max(currentGameData.bestScore, score),
        timesPlayed: currentGameData.timesPlayed + 1,
        lastPlayed: new Date().toISOString(),
      }

      const newScores = { ...storedScores, [gameId]: newGameData }
      localStorage.setItem(`lingualearn_game_scores_${user.id}`, JSON.stringify(newScores))

      // Save to database and award XP (saveGameResult handles XP automatically)
      await saveGameResult({
        userId: user.id,
        gameType: "speed-challenge",
        score: score,
        date: new Date().toISOString(),
        details: {
          correctAnswers: correctAnswers,
          totalAnswers: totalAnswers,
          accuracy: totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0,
          timeLeft: timeLeft,
        }}, token || undefined)
    }
  }

  const checkAnswer = () => {
    if (!userInput.trim()) return

    const currentWord = vocabulary[currentWordIndex]
    let isCorrect = false

    if (questionType === "en-to-th") {
      // English to Thai
      isCorrect = userInput.toLowerCase().trim() === currentWord.translation.toLowerCase().trim()
    } else {
      // Thai to English
      isCorrect = userInput.toLowerCase().trim() === currentWord.word.toLowerCase().trim()
    }

    setTotalAnswers((prev) => prev + 1)

    if (isCorrect) {
      // Play correct sound
      playCorrectSound()

      // Add points
      const pointsForWord = 10
      setScore((prev) => prev + pointsForWord)

      // Increment correct answers
      setCorrectAnswers((prev) => prev + 1)

      // Show success toast
      toast({
        title: "Correct!",
        description: `+${pointsForWord} points`,
        variant: "default",
      })
    } else {
      // Play incorrect sound
      playIncorrectSound()

      // Show error toast
      toast({
        title: "Incorrect",
        description:
          questionType === "en-to-th"
            ? `The correct translation was "${currentWord.translation}"`
            : `The correct word was "${currentWord.word}"`,
        variant: "destructive",
      })
    }

    // Move to next word or loop back
    if (currentWordIndex < vocabulary.length - 1) {
      setCurrentWordIndex((prev) => prev + 1)
    } else {
      // Shuffle vocabulary and start from beginning
      const shuffledVocab = [...vocabulary].sort(() => Math.random() - 0.5)
      setVocabulary(shuffledVocab)
      setCurrentWordIndex(0)
    }

    // Randomly choose next question type
    setQuestionType(Math.random() > 0.5 ? "en-to-th" : "th-to-en")

    // Clear input
    setUserInput("")
  }

  const playAudio = () => {
    if (vocabulary.length === 0 || currentWordIndex >= vocabulary.length) return

    const word =
      questionType === "en-to-th" ? vocabulary[currentWordIndex].word : vocabulary[currentWordIndex].translation

    // Use browser's speech synthesis
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = questionType === "en-to-th" ? "en-US" : "th-TH"
    speechSynthesis.speak(utterance)
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading game...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6 text-center">Speed Challenge</h1>
      <div className="mb-6">
        <p className="text-gray-500">Translate as many words as you can in 60 seconds. Test your vocabulary speed!</p>
      </div>

      {gameState === "ready" && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-indigo-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Speed Translation Challenge</h2>
              <p className="text-gray-500 mb-6">
                You have 60 seconds to translate as many words as you can between English and Thai. Ready?
              </p>
              <Button className="bg-indigo-500 hover:bg-indigo-600" size="lg" onClick={startGame}>
                Start Game
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {gameState === "playing" && vocabulary.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-500" />
              <span className="font-bold">{timeLeft}s</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <span className="font-bold">{score} points</span>
            </div>
          </div>

          <Progress value={(timeLeft / 60) * 100} className="h-2 mb-6" />

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center py-4">
                <h3 className="text-lg font-medium mb-2">
                  {questionType === "en-to-th" ? "Translate to Thai:" : "Translate to English:"}
                </h3>

                <div className="flex items-center justify-center gap-2 mb-6">
                  <div className="text-3xl font-bold">
                    {questionType === "en-to-th"
                      ? vocabulary[currentWordIndex].word
                      : vocabulary[currentWordIndex].translation}
                  </div>
                  <Button variant="ghost" size="icon" onClick={playAudio} className="text-indigo-500">
                    <VolumeUp className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex gap-2 mb-4">
                  <Input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder={questionType === "en-to-th" ? "Type Thai translation" : "Type English word"}
                    className="text-center text-lg"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        checkAnswer()
                      }
                    }}
                  />
                </div>

                <Button
                  className="bg-indigo-500 hover:bg-indigo-600"
                  onClick={checkAnswer}
                  disabled={!userInput.trim()}
                >
                  Check
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {gameState === "finished" && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-indigo-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Time's Up!</h2>
              <p className="text-gray-500 mb-6">
                You translated {correctAnswers} out of {totalAnswers} words correctly.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Score</p>
                  <p className="text-xl font-bold">{score}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Accuracy</p>
                  <p className="text-xl font-bold">
                    {totalAnswers > 0 ? Math.round((correctAnswers / totalAnswers) * 100) : 0}%
                  </p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">XP Earned</p>
                  <p className="text-xl font-bold">{Math.floor(score / 10)}</p>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push("/games")}>
                  <Home className="h-4 w-4 mr-2" />
                  All Games
                </Button>
                <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={startGame}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Play Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

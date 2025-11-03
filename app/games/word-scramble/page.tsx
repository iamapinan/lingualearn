"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import { getUserVocabulary, saveGameResult } from "@/lib/database"
import { playCorrectSound, playIncorrectSound, playLevelCompleteSound } from "@/lib/audio-utils"
import { Clock, Star, Trophy, RefreshCw, Home } from "lucide-react"
import { BackButton } from "@/components/back-button"

interface VocabularyItem {
  id: number
  word: string
  translation: string
}

// Default vocabulary for new users
const defaultVocabulary: VocabularyItem[] = [
  { id: 10001, word: "hello", translation: "สวัสดี" },
  { id: 10002, word: "water", translation: "น้ำ" },
  { id: 10003, word: "apple", translation: "แอปเปิล" },
  { id: 10004, word: "house", translation: "บ้าน" },
  { id: 10005, word: "happy", translation: "มีความสุข" },
  { id: 10006, word: "table", translation: "โต๊ะ" },
  { id: 10007, word: "chair", translation: "เก้าอี้" },
  { id: 10008, word: "book", translation: "หนังสือ" },
  { id: 10009, word: "music", translation: "เพลง" },
  { id: 10010, word: "color", translation: "สี" },
  { id: 10011, word: "study", translation: "เรียน" },
  { id: 10012, word: "travel", translation: "เดินทาง" },
  { id: 10013, word: "world", translation: "โลก" },
  { id: 10014, word: "dream", translation: "ความฝัน" },
  { id: 10015, word: "learn", translation: "เรียนรู้" },
  { id: 10016, word: "teach", translation: "สอน" },
  { id: 10017, word: "speak", translation: "พูด" },
  { id: 10018, word: "write", translation: "เขียน" },
  { id: 10019, word: "read", translation: "อ่าน" },
  { id: 10020, word: "think", translation: "คิด" },
]

export default function WordScramblePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [scrambledWord, setScrambledWord] = useState("")
  const [userInput, setUserInput] = useState("")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready")
  const [loading, setLoading] = useState(true)
  const [showHint, setShowHint] = useState(false)
  const [hintUsed, setHintUsed] = useState(false)
  const [correctWords, setCorrectWords] = useState(0)
  const [totalWords, setTotalWords] = useState(0)

  // Load vocabulary
  useEffect(() => {
    const loadVocabulary = async () => {
      if (!user) {
        router.push("/auth")
        return
      }

      try {
        const userVocab = await getUserVocabulary(user.id)

        // Filter to only include items with English words (not too long)
        const filteredVocab = userVocab
          .filter((item) => item.languageCode === "en" && item.word.length >= 3 && item.word.length <= 8)
          .map((item) => ({
            id: item.id,
            word: item.word.toLowerCase(),
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

  // Scramble the current word
  const scrambleWord = useCallback((word: string) => {
    const wordArray = word.split("")
    let scrambled = word

    // Make sure the scrambled word is different from the original
    while (scrambled === word) {
      for (let i = wordArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]]
      }
      scrambled = wordArray.join("")
    }

    return scrambled
  }, [])

  // Set up the current word when vocabulary is loaded or index changes
  useEffect(() => {
    if (vocabulary.length > 0 && currentWordIndex < vocabulary.length) {
      const currentWord = vocabulary[currentWordIndex].word
      setScrambledWord(scrambleWord(currentWord))
      setUserInput("")
      setShowHint(false)
      setHintUsed(false)
    }
  }, [vocabulary, currentWordIndex, scrambleWord])

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
    setCorrectWords(0)
    setTotalWords(0)
  }

  const endGame = async () => {
    setGameState("finished")

    // Play game over sound
    playLevelCompleteSound()

    // Save score to localStorage
    if (user) {
      const gameId = "word-scramble"
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
        gameType: "word-scramble",
        score: score,
        date: new Date().toISOString(),
        details: {
          correctWords: correctWords,
          totalWords: totalWords,
          accuracy: totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0,
        },
      })
    }
  }

  const checkAnswer = () => {
    if (!userInput.trim()) return

    const currentWord = vocabulary[currentWordIndex].word
    const isCorrect = userInput.toLowerCase().trim() === currentWord.toLowerCase()

    setTotalWords((prev) => prev + 1)

    if (isCorrect) {
      // Play correct sound
      playCorrectSound()

      // Add points based on word length and whether hint was used
      const pointsForWord = currentWord.length * (hintUsed ? 5 : 10)
      setScore((prev) => prev + pointsForWord)

      // Show success toast
      toast({
        title: "Correct!",
        description: `+${pointsForWord} points`,
        variant: "default",
      })

      setCorrectWords((prev) => prev + 1)

      // Move to next word or end game if no more words
      if (currentWordIndex < vocabulary.length - 1) {
        setCurrentWordIndex((prev) => prev + 1)
      } else {
        // Loop back to the beginning if we've gone through all words
        setCurrentWordIndex(0)
      }
    } else {
      // Play incorrect sound
      playIncorrectSound()

      // Show error toast
      toast({
        title: "Incorrect",
        description: `The correct word was "${currentWord}"`,
        variant: "destructive",
      })

      // Move to next word or end game if no more words
      if (currentWordIndex < vocabulary.length - 1) {
        setCurrentWordIndex((prev) => prev + 1)
      } else {
        // Loop back to the beginning if we've gone through all words
        setCurrentWordIndex(0)
      }
    }

    setUserInput("")
  }

  const showWordHint = () => {
    setShowHint(true)
    setHintUsed(true)
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
      <h1 className="text-3xl font-bold mb-6 text-center">Word Scramble</h1>

      {gameState === "ready" && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-indigo-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Word Scramble Challenge</h2>
              <p className="text-gray-500 mb-6">You have 60 seconds to unscramble as many words as you can. Ready?</p>
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

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="text-center py-4">
                <h3 className="text-lg font-medium mb-2">Unscramble this word:</h3>
                <div className="text-3xl font-bold mb-4 tracking-wider">{scrambledWord}</div>

                {showHint && (
                  <div className="mb-4 text-indigo-600">Hint: {vocabulary[currentWordIndex].translation}</div>
                )}

                <div className="flex gap-2 mb-4">
                  <Input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    placeholder="Type your answer"
                    className="text-center text-lg"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        checkAnswer()
                      }
                    }}
                  />
                </div>

                <div className="flex gap-2 justify-center">
                  <Button variant="outline" onClick={showWordHint} disabled={showHint}>
                    Show Hint
                  </Button>
                  <Button
                    className="bg-indigo-500 hover:bg-indigo-600"
                    onClick={checkAnswer}
                    disabled={!userInput.trim()}
                  >
                    Check
                  </Button>
                </div>
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
              <h2 className="text-xl font-bold mb-2">Game Over!</h2>
              <p className="text-gray-500 mb-6">
                You scored {score} points by unscrambling {correctWords} out of {totalWords} words.
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Score</p>
                  <p className="text-xl font-bold">{score}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Accuracy</p>
                  <p className="text-xl font-bold">
                    {totalWords > 0 ? Math.round((correctWords / totalWords) * 100) : 0}%
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

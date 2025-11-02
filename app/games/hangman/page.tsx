"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getRandomVocabulary } from "@/lib/db/data/vocabulary-data"
import { saveGameResult } from "@/lib/database"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { BackButton } from "@/components/back-button"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("")
const MAX_ATTEMPTS = 6

export default function HangmanGame() {
  const router = useRouter()
  const { user } = useAuth()
  const [word, setWord] = useState("")
  const [hint, setHint] = useState("")
  const [category, setCategory] = useState("")
  const [guessedLetters, setGuessedLetters] = useState<string[]>([])
  const [wrongAttempts, setWrongAttempts] = useState(0)
  const [score, setScore] = useState(0)
  const [gameOver, setGameOver] = useState(false)
  const [won, setWon] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes
  const [gameStarted, setGameStarted] = useState(false)

  // Initialize game
  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    startNewGame()
  }, [user, router])

  // Timer
  useEffect(() => {
    if (!gameStarted || gameOver) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          endGame(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameStarted, gameOver])

  const startNewGame = () => {
    const randomWord = getRandomVocabulary()
    setWord(randomWord.word.toUpperCase())
    setHint(randomWord.translation)
    setCategory(randomWord.category)
    setGuessedLetters([])
    setWrongAttempts(0)
    setGameOver(false)
    setWon(false)
    setTimeLeft(120)
    setGameStarted(true)
  }

  const guessLetter = (letter: string) => {
    if (gameOver || guessedLetters.includes(letter)) return

    const newGuessedLetters = [...guessedLetters, letter]
    setGuessedLetters(newGuessedLetters)

    if (!word.includes(letter)) {
      const newWrongAttempts = wrongAttempts + 1
      setWrongAttempts(newWrongAttempts)

      if (newWrongAttempts >= MAX_ATTEMPTS) {
        endGame(false)
      }
    } else {
      // Check if all letters are guessed
      const isWordGuessed = word.split("").every((char) => newGuessedLetters.includes(char) || char === " ")

      if (isWordGuessed) {
        const newScore = calculateScore()
        setScore(newScore)
        endGame(true)
      }
    }
  }

  const calculateScore = () => {
    const baseScore = word.length * 10
    const timeBonus = Math.floor(timeLeft / 10)
    const wrongPenalty = wrongAttempts * 5
    return Math.max(0, baseScore + timeBonus - wrongPenalty)
  }

  const endGame = async (isWin: boolean) => {
    setGameOver(true)
    setWon(isWin)

    if (isWin) {
      const finalScore = calculateScore()
      setScore(finalScore)

      if (user) {
        await saveGameResult({
          userId: user.id,
          gameType: "hangman",
          score: finalScore,
          date: new Date().toISOString(),
          details: {
            word: word,
            wrongAttempts: wrongAttempts,
            timeLeft: timeLeft,
          },
        })
      }
    }
  }

  const displayWord = () => {
    return word.split("").map((letter, index) => {
      if (letter === " ") {
        return (
          <span key={index} className="mx-2 w-12">
            &nbsp;
          </span>
        )
      }

      const isGuessed = guessedLetters.includes(letter)
      const isRevealed = gameOver && !won

      return (
        <div
          key={index}
          className="mx-1 w-14 h-20 flex flex-col items-center justify-center border-b-4 border-indigo-600 rounded-lg bg-gradient-to-b from-indigo-50 to-indigo-100 shadow-md"
        >
          {isGuessed || isRevealed ? (
            <span className="text-4xl font-bold text-indigo-700 animate-bounce">
              {letter}
            </span>
          ) : (
            <span className="text-3xl font-bold text-indigo-300">_</span>
          )}
        </div>
      )
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6 text-center">Hangman</h1>
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardTitle className="text-center text-2xl">Hangman Game</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-6">
            {/* Hangman Visual */}
            <div className="relative mb-6 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold mb-2">
                  {wrongAttempts === 0 && "😊"}
                  {wrongAttempts === 1 && "😐"}
                  {wrongAttempts === 2 && "😟"}
                  {wrongAttempts === 3 && "😰"}
                  {wrongAttempts === 4 && "😨"}
                  {wrongAttempts === 5 && "😱"}
                  {wrongAttempts >= 6 && "💀"}
                </div>
                <div className="text-sm font-semibold text-red-600">
                  {wrongAttempts}/{MAX_ATTEMPTS} Wrong Guesses
                </div>
              </div>
            </div>

            {/* Category and Hint */}
            <div className="w-full max-w-2xl mb-6">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">Category</span>
                </div>
                <p className="text-md">{category}</p>
              </div>

              <div className="bg-gradient-to-r from-yellow-100 to-amber-100 rounded-lg p-4 mb-4 border border-yellow-200">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">Hint / คำใบ้</span>
                </div>
                <p className="text-xl font-bold text-amber-800">{hint}</p>
              </div>
            </div>

            {/* Word Display */}
            <div className="w-full max-w-2xl mb-6">
              <div className="bg-white rounded-xl p-6 border-2 border-indigo-200 shadow-lg">
                <div className="text-center mb-2">
                  <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Guess the Word</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2">{displayWord()}</div>
              </div>
            </div>

            {/* Timer and Progress */}
            <div className="w-full max-w-2xl mb-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Time Left</span>
                  <span className="text-lg font-bold text-indigo-600">{formatTime(timeLeft)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">Attempts</span>
                  <span className={`text-lg font-bold ${wrongAttempts >= MAX_ATTEMPTS - 1 ? "text-red-600" : "text-gray-600"}`}>
                    {wrongAttempts}/{MAX_ATTEMPTS}
                  </span>
                </div>
              </div>
              <Progress
                value={(timeLeft / 120) * 100}
                className="w-full h-3"
              />
            </div>

            {gameOver ? (
              <div className="text-center mb-6 w-full max-w-2xl">
                <div className={`rounded-xl p-6 mb-4 ${won ? "bg-gradient-to-r from-green-100 to-emerald-100 border-2 border-green-300" : "bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-300"}`}>
                  <h3 className={`text-3xl font-bold ${won ? "text-green-700" : "text-red-700"} mb-3`}>
                    {won ? "🎉 Congratulations! 🎉" : "💀 Game Over! 💀"}
                  </h3>
                  <p className="text-lg font-semibold text-gray-700 mb-2">
                    {won ? "คุณทายคำถูกต้อง!" : "คำที่ถูกต้องคือ"}
                  </p>
                  <p className="text-2xl font-bold text-indigo-800 mb-4">{word}</p>
                  {won && (
                    <div className="bg-white rounded-lg p-4 inline-block">
                      <p className="text-sm text-gray-600 mb-1">Score</p>
                      <p className="text-3xl font-bold text-indigo-600">{score}</p>
                    </div>
                  )}
                </div>
                <Button onClick={startNewGame} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-lg px-8">
                  เล่นอีกครั้ง
                </Button>
              </div>
            ) : (
              <div className="w-full max-w-2xl">
                <div className="text-center mb-4">
                  <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">เลือกตัวอักษร</span>
                </div>
                <div className="grid grid-cols-7 gap-3 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl p-4 border border-indigo-100">
                  {ALPHABET.map((letter) => {
                    const isGuessed = guessedLetters.includes(letter)
                    const isCorrect = word.includes(letter)
                    const isWrong = isGuessed && !isCorrect

                    return (
                      <Button
                        key={letter}
                        onClick={() => guessLetter(letter)}
                        disabled={isGuessed}
                        size="lg"
                        variant={isGuessed ? (isCorrect ? "default" : "outline") : "default"}
                        className={`${
                          isGuessed
                            ? isCorrect
                              ? "bg-green-500 hover:bg-green-600 text-white border-2 border-green-600"
                              : "bg-red-500 hover:bg-red-600 text-white border-2 border-red-600 opacity-60 cursor-not-allowed"
                            : "bg-indigo-600 hover:bg-indigo-700 text-white border-2 border-indigo-700 hover:scale-105 transition-transform"
                        } h-12 w-12 p-0 text-lg font-bold shadow-md`}
                      >
                        {letter}
                      </Button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <Button onClick={() => router.push("/games")} variant="outline">
              Back to Games
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

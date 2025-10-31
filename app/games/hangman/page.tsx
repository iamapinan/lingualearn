"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getRandomVocabulary } from "@/lib/db/data/vocabulary-data"
import { saveGameResult } from "@/lib/database"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import Image from "next/image"
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
    setWord(randomWord.english.toUpperCase())
    setHint(randomWord.thai)
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
          <span key={index} className="mx-1">
            &nbsp;
          </span>
        )
      }

      return (
        <span key={index} className="mx-1 text-2xl font-bold">
          {guessedLetters.includes(letter) || (gameOver && !won) ? letter : "_"}
        </span>
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
            <div className="relative w-48 h-48 mb-4">
              <Image
                src={`/placeholder.svg?key=vz185&key=1vm6v&height=200&width=200&query=hangman stage ${wrongAttempts} of 6`}
                alt={`Hangman stage ${wrongAttempts}`}
                width={200}
                height={200}
                className="object-contain"
              />
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-gray-500 mb-2">Category: {category}</p>
              <p className="text-sm text-gray-500 mb-4">Hint: {hint}</p>
              <div className="flex justify-center space-x-1 mb-4">{displayWord()}</div>
            </div>

            <div className="flex justify-between items-center w-full mb-4">
              <div className="text-sm font-medium">
                Wrong attempts: {wrongAttempts}/{MAX_ATTEMPTS}
              </div>
              <div className="text-sm font-medium">Time left: {formatTime(timeLeft)}</div>
            </div>

            <Progress value={(timeLeft / 120) * 100} className="w-full mb-6" />

            {gameOver ? (
              <div className="text-center mb-6">
                <h3 className={`text-xl font-bold ${won ? "text-green-600" : "text-red-600"} mb-2`}>
                  {won ? "Congratulations!" : "Game Over!"}
                </h3>
                {won ? (
                  <p className="mb-4">
                    You guessed the word: <span className="font-bold">{word}</span>
                  </p>
                ) : (
                  <p className="mb-4">
                    The word was: <span className="font-bold">{word}</span>
                  </p>
                )}
                {won && <p className="text-lg font-bold mb-4">Score: {score}</p>}
                <Button onClick={startNewGame} className="bg-indigo-600 hover:bg-indigo-700">
                  Play Again
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-7 gap-2 w-full max-w-md">
                {ALPHABET.map((letter) => (
                  <Button
                    key={letter}
                    onClick={() => guessLetter(letter)}
                    disabled={guessedLetters.includes(letter)}
                    variant={
                      guessedLetters.includes(letter) ? (word.includes(letter) ? "default" : "outline") : "default"
                    }
                    className={`${
                      guessedLetters.includes(letter)
                        ? word.includes(letter)
                          ? "bg-green-500 hover:bg-green-600"
                          : "bg-red-500 hover:bg-red-600"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } h-10 w-10 p-0`}
                  >
                    {letter}
                  </Button>
                ))}
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

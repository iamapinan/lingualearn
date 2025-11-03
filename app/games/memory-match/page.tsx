"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import {
  getUserVocabulary,
  saveGameResult,
  getGameProgress,
} from "@/lib/database"
import { playCorrectSound, playIncorrectSound, playLevelCompleteSound } from "@/lib/audio-utils"
import { Clock, Star, Trophy, RefreshCw, Home } from "lucide-react"
import { BackButton } from "@/components/back-button"

// เพิ่ม CSS สำหรับการพลิกการ์ด
const cardFlipStyles = `
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  .backface-hidden {
    backface-visibility: hidden;
  }
`

interface VocabularyItem {
  id: number
  word: string
  translation: string
}

interface MemoryCard {
  id: number
  content: string
  type: "word" | "translation"
  matchId: number
  isFlipped: boolean
  isMatched: boolean
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
]

export default function MemoryMatchPage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [cards, setCards] = useState<MemoryCard[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [matchedPairs, setMatchedPairs] = useState<number>(0)
  const [moves, setMoves] = useState<number>(0)
  const [score, setScore] = useState<number>(0)
  const [timeLeft, setTimeLeft] = useState<number>(120)
  const [gameState, setGameState] = useState<"ready" | "playing" | "finished">("ready")
  const [loading, setLoading] = useState<boolean>(true)

  // เพิ่มตัวแปรสำหรับบันทึกความก้าวหน้า
  const [gameHistory, setGameHistory] = useState<
    Array<{
      date: string
      score: number
      pairs: number
      totalPairs: number
      moves: number
      timeLeft: number
    }>
  >([])

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

        // Shuffle and take only 8 items for the game
        const shuffledVocab = [...finalVocab].sort(() => Math.random() - 0.5).slice(0, 8)

        setVocabulary(shuffledVocab)
        setLoading(false)
      } catch (error) {
        console.error("Error loading vocabulary:", error)
        // Use default vocabulary on error
        const shuffledVocab = [...defaultVocabulary].sort(() => Math.random() - 0.5).slice(0, 8)
        setVocabulary(shuffledVocab)
        setLoading(false)
      }
    }

    loadVocabulary()
  }, [user, router])

  // Load game history
  useEffect(() => {
    const loadGameHistory = async () => {
      if (user) {
        try {
          const gameProgress = await getGameProgress(user.id, "memory-match")
          if (gameProgress && gameProgress.history) {
            // Convert database history to local format
            const formattedHistory = gameProgress.history.map((item: any) => ({
              date: item.timestamp,
              score: item.score,
              pairs: item.details.pairs,
              totalPairs: item.details.totalPairs,
              moves: item.details.moves,
              timeLeft: item.details.timeLeft,
            }))
            setGameHistory(formattedHistory)
          }
        } catch (error) {
          console.error("Error loading game history:", error)
        }
      }
    }

    loadGameHistory()
  }, [user])

  // Create memory cards when vocabulary is loaded
  useEffect(() => {
    if (vocabulary.length > 0) {
      createMemoryCards()
    }
  }, [vocabulary])

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

  // Check for matches when two cards are flipped
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstCardId, secondCardId] = flippedCards
      const firstCard = cards.find((card) => card.id === firstCardId)
      const secondCard = cards.find((card) => card.id === secondCardId)

      if (firstCard && secondCard) {
        // Increment moves
        setMoves((prev) => prev + 1)

        // Check if the cards match
        if (firstCard.matchId === secondCard.matchId) {
          // It's a match!
          playCorrectSound()

          // Update cards
          setCards((prevCards) =>
            prevCards.map((card) =>
              card.id === firstCardId || card.id === secondCardId ? { ...card, isMatched: true } : card,
            ),
          )

          // Increment matched pairs
          setMatchedPairs((prev) => prev + 1)

          // Add points
          const pointsForMatch = 20
          setScore((prev) => prev + pointsForMatch)

          // Show success toast
          toast({
            title: "Match found!",
            description: `+${pointsForMatch} points`,
            variant: "default",
          })

          // Clear flipped cards
          setFlippedCards([])

          // Check if all pairs are matched
          if (matchedPairs + 1 === vocabulary.length) {
            // Game completed!
            endGame()
          }
        } else {
          // Not a match
          playIncorrectSound()

          // Flip cards back after a delay
          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) =>
                card.id === firstCardId || card.id === secondCardId ? { ...card, isFlipped: false } : card,
              ),
            )
            setFlippedCards([])
          }, 1000)
        }
      }
    }
  }, [flippedCards, cards, matchedPairs, vocabulary.length])

  const createMemoryCards = () => {
    const memoryCards: MemoryCard[] = []

    // Create pairs of cards (word and translation)
    vocabulary.forEach((item, index) => {
      // Word card
      memoryCards.push({
        id: index * 2,
        content: item.word,
        type: "word",
        matchId: index,
        isFlipped: false,
        isMatched: false,
      })

      // Translation card
      memoryCards.push({
        id: index * 2 + 1,
        content: item.translation,
        type: "translation",
        matchId: index,
        isFlipped: false,
        isMatched: false,
      })
    })

    // Shuffle the cards
    const shuffledCards = [...memoryCards].sort(() => Math.random() - 0.5)

    setCards(shuffledCards)
  }

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
    setMatchedPairs(0)
    setMoves(0)
    setScore(0)
    setTimeLeft(120)
    createMemoryCards()
  }

  const endGame = async () => {
    setGameState("finished")

    // Play game over sound
    playLevelCompleteSound()

    // Calculate final score based on matches, moves, and time left
    const timeBonus = timeLeft * 2
    const finalScore = score + timeBonus
    setScore(finalScore)

    // Save score to localStorage
    if (user) {
      const gameId = "memory-match"
      const storedScoresStr = localStorage.getItem(`lingualearn_game_scores_${user.id}`)
      const storedScores = storedScoresStr ? JSON.parse(storedScoresStr) : {}

      const currentGameData = storedScores[gameId] || { bestScore: 0, timesPlayed: 0 }
      const newGameData = {
        gameId,
        bestScore: Math.max(currentGameData.bestScore, finalScore),
        timesPlayed: currentGameData.timesPlayed + 1,
        lastPlayed: new Date().toISOString(),
      }

      const newScores = { ...storedScores, [gameId]: newGameData }
      localStorage.setItem(`lingualearn_game_scores_${user.id}`, JSON.stringify(newScores))

      // Add to game history
      const historyItem = {
        date: new Date().toISOString(),
        score: finalScore,
        pairs: matchedPairs,
        totalPairs: vocabulary.length,
        moves: moves,
        timeLeft: timeLeft,
      }

      const newHistory = [...gameHistory, historyItem]
      setGameHistory(newHistory)

      // Save to database and award XP (saveGameResult handles XP automatically)
      await saveGameResult({
        userId: user.id,
        gameType: "memory-match",
        score: finalScore,
        date: new Date().toISOString(),
        details: {
          pairs: matchedPairs,
          totalPairs: vocabulary.length,
          moves: moves,
          timeLeft: timeLeft,
        },
      })
    }
  }

  const handleCardClick = (cardId: number) => {
    // Ignore clicks if already two cards are flipped or the card is already flipped or matched
    if (flippedCards.length >= 2) return

    const clickedCard = cards.find((card) => card.id === cardId)
    if (!clickedCard || clickedCard.isFlipped || clickedCard.isMatched) return

    // Flip the card
    setCards((prevCards) => prevCards.map((card) => (card.id === cardId ? { ...card, isFlipped: true } : card)))

    // Add to flipped cards
    setFlippedCards((prev) => [...prev, cardId])
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
    <div className="container mx-auto p-4">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6 text-center">Memory Match</h1>
      <style jsx global>
        {cardFlipStyles}
      </style>
      <div className="mb-6">
        <p className="text-gray-500">Match English words with their Thai translations. Find all pairs to win!</p>
      </div>

      {gameState === "ready" && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="h-8 w-8 text-indigo-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Memory Match Challenge</h2>
              <p className="text-gray-500 mb-6">
                Find all matching pairs of English words and their Thai translations. You have 2 minutes!
              </p>
              <Button className="bg-indigo-500 hover:bg-indigo-600" size="lg" onClick={startGame}>
                Start Game
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {gameState === "playing" && (
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
            <div className="text-gray-500">Moves: {moves}</div>
          </div>

          <div className="grid grid-cols-4 gap-3 mb-6">
            {cards.map((card) => (
              <div key={card.id} className="aspect-square cursor-pointer" onClick={() => handleCardClick(card.id)}>
                <div
                  className={`
          relative w-full h-full transition-transform duration-500
          ${card.isFlipped || card.isMatched ? "rotate-y-180" : ""}
        `}
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  {/* Card Back */}
                  <div
                    className={`
            absolute w-full h-full flex items-center justify-center
            bg-indigo-500 text-white font-bold rounded-lg shadow-md
            backface-hidden
          `}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(0deg)",
                    }}
                  >
                    ?
                  </div>

                  {/* Card Front */}
                  <div
                    className={`
            absolute w-full h-full flex items-center justify-center p-2
            ${card.type === "word" ? "bg-blue-100 text-blue-700" : "bg-green-100 text-green-700"}
            font-medium rounded-lg shadow-md text-center
            backface-hidden
            ${card.isMatched ? "opacity-70" : ""}
          `}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    {card.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
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
                {matchedPairs === vocabulary.length
                  ? `Congratulations! You found all ${matchedPairs} pairs in ${moves} moves.`
                  : `You found ${matchedPairs} out of ${vocabulary.length} pairs.`}
              </p>

              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Score</p>
                  <p className="text-xl font-bold">{score}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">Moves</p>
                  <p className="text-xl font-bold">{moves}</p>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-sm text-gray-500">XP Earned</p>
                  <p className="text-xl font-bold">{Math.floor(score / 10)}</p>
                </div>
              </div>

              {gameHistory.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3">Your Game History</h3>
                  <div className="bg-white rounded-lg shadow-sm p-4 max-h-60 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="pb-2">Date</th>
                          <th className="pb-2">Score</th>
                          <th className="pb-2">Pairs</th>
                          <th className="pb-2">Moves</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gameHistory
                          .slice(-5)
                          .reverse()
                          .map((item, index) => (
                            <tr key={index} className="border-b last:border-0">
                              <td className="py-2">{new Date(item.date).toLocaleDateString()}</td>
                              <td className="py-2 font-medium">{item.score}</td>
                              <td className="py-2">
                                {item.pairs}/{item.totalPairs}
                              </td>
                              <td className="py-2">{item.moves}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

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

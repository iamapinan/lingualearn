"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { getRandomVocabularySet } from "@/lib/db/data/vocabulary-data"
import { saveGameResult } from "@/lib/database"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/back-button"

// Directions for word placement
const DIRECTIONS = [
  [0, 1], // right
  [1, 0], // down
  [1, 1], // diagonal down-right
  [1, -1], // diagonal down-left
]

export default function WordSearchGame() {
  const router = useRouter()
  const { user } = useAuth()
  const [grid, setGrid] = useState<string[][]>([])
  const [words, setWords] = useState<string[]>([])
  const [translations, setTranslations] = useState<Record<string, string>>({})
  const [foundWords, setFoundWords] = useState<string[]>([])
  const [selectedCells, setSelectedCells] = useState<number[][]>([])
  const [isSelecting, setIsSelecting] = useState(false)
  const [startCell, setStartCell] = useState<number[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(180) // 3 minutes
  const [gameOver, setGameOver] = useState(false)
  const [gridSize, setGridSize] = useState(10)
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("easy")

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
    if (gameOver) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          endGame()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameOver])

  const generateGrid = useCallback((wordList: string[], size: number) => {
    // Create empty grid
    const newGrid: string[][] = Array(size)
      .fill(null)
      .map(() => Array(size).fill(""))
    const placedWords: string[] = []
    const translationMap: Record<string, string> = {}

    // Try to place each word
    wordList.forEach((word) => {
      const { english, thai } = word
      const uppercaseWord = english.toUpperCase().replace(/\s/g, "")

      if (uppercaseWord.length > size) return // Skip if word is too long

      // Try multiple times to place the word
      for (let attempts = 0; attempts < 20; attempts++) {
        const direction = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
        const [dx, dy] = direction

        // Random starting position
        const row = Math.floor(Math.random() * size)
        const col = Math.floor(Math.random() * size)

        // Check if word fits
        if (
          row + dx * (uppercaseWord.length - 1) >= size ||
          row + dx * (uppercaseWord.length - 1) < 0 ||
          col + dy * (uppercaseWord.length - 1) >= size ||
          col + dy * (uppercaseWord.length - 1) < 0
        ) {
          continue // Try again with different position/direction
        }

        // Check if word can be placed without conflicts
        let canPlace = true
        for (let i = 0; i < uppercaseWord.length; i++) {
          const r = row + dx * i
          const c = col + dy * i
          if (newGrid[r][c] !== "" && newGrid[r][c] !== uppercaseWord[i]) {
            canPlace = false
            break
          }
        }

        if (canPlace) {
          // Place the word
          for (let i = 0; i < uppercaseWord.length; i++) {
            const r = row + dx * i
            const c = col + dy * i
            newGrid[r][c] = uppercaseWord[i]
          }
          placedWords.push(uppercaseWord)
          translationMap[uppercaseWord] = thai
          break
        }
      }
    })

    // Fill remaining cells with random letters
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size; j++) {
        if (newGrid[i][j] === "") {
          newGrid[i][j] = String.fromCharCode(65 + Math.floor(Math.random() * 26))
        }
      }
    }

    return { grid: newGrid, placedWords, translationMap }
  }, [])

  const startNewGame = () => {
    // Get random words based on difficulty
    const wordCount = difficulty === "easy" ? 5 : difficulty === "medium" ? 8 : 10
    const size = difficulty === "easy" ? 8 : difficulty === "medium" ? 10 : 12
    setGridSize(size)

    const vocabItems = getRandomVocabularySet(wordCount)
    const { grid, placedWords, translationMap } = generateGrid(vocabItems, size)

    setGrid(grid)
    setWords(placedWords)
    setTranslations(translationMap)
    setFoundWords([])
    setSelectedCells([])
    setScore(0)
    setTimeLeft(difficulty === "easy" ? 180 : difficulty === "medium" ? 240 : 300)
    setGameOver(false)
  }

  const handleCellMouseDown = (row: number, col: number) => {
    if (gameOver) return
    setIsSelecting(true)
    setStartCell([row, col])
    setSelectedCells([[row, col]])
  }

  const handleCellMouseEnter = (row: number, col: number) => {
    if (!isSelecting || gameOver) return

    const [startRow, startCol] = startCell

    // Only allow straight lines (horizontal, vertical, diagonal)
    const rowDiff = row - startRow
    const colDiff = col - startCol

    // Check if it's a straight line
    if (
      rowDiff === 0 || // horizontal
      colDiff === 0 || // vertical
      Math.abs(rowDiff) === Math.abs(colDiff) // diagonal
    ) {
      // Calculate all cells in the line
      const cells: number[][] = []
      const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff))

      const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff)
      const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff)

      for (let i = 0; i <= steps; i++) {
        const r = startRow + Math.round(i * rowStep)
        const c = startCol + Math.round(i * colStep)
        cells.push([r, c])
      }

      setSelectedCells(cells)
    }
  }

  const handleCellMouseUp = () => {
    if (!isSelecting || gameOver) return
    setIsSelecting(false)

    // Check if selected cells form a word
    const selectedWord = selectedCells.map(([row, col]) => grid[row][col]).join("")

    // Check if word is in the list and not already found
    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      setFoundWords([...foundWords, selectedWord])

      // Update score
      const wordScore = selectedWord.length * 10
      setScore((prevScore) => prevScore + wordScore)

      // Check if all words are found
      if (foundWords.length + 1 === words.length) {
        endGame()
      }
    }

    // Clear selection after a short delay
    setTimeout(() => {
      setSelectedCells([])
    }, 500)
  }

  const isCellSelected = (row: number, col: number) => {
    return selectedCells.some(([r, c]) => r === row && c === col)
  }

  const isCellInFoundWord = (row: number, col: number) => {
    // This is a simplified check - in a real game you'd need to track which cells belong to which found words
    return foundWords.some((word) => {
      const wordStart = selectedCells.length > 0 ? selectedCells[0] : null
      if (!wordStart) return false

      // Check if this cell is part of a found word
      // This is a simplified implementation
      return false
    })
  }

  const endGame = async () => {
    setGameOver(true)

    const finalScore = score + (timeLeft > 0 ? Math.floor(timeLeft / 10) : 0)
    setScore(finalScore)

    if (user) {
      await saveGameResult({
        userId: user.id,
        gameType: "word-search",
        score: finalScore,
        date: new Date().toISOString(),
        details: {
          wordsFound: foundWords.length,
          totalWords: words.length,
          timeLeft: timeLeft,
          difficulty: difficulty,
        },
      })
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const changeDifficulty = (newDifficulty: "easy" | "medium" | "hard") => {
    setDifficulty(newDifficulty)
    startNewGame()
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6 text-center">Word Search</h1>
      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardTitle className="text-center text-2xl">Word Search Game</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-4">
              <div className="text-sm font-medium">
                Words found: {foundWords.length}/{words.length}
              </div>
              <div className="text-sm font-medium">Time left: {formatTime(timeLeft)}</div>
            </div>

            <Progress
              value={(timeLeft / (difficulty === "easy" ? 180 : difficulty === "medium" ? 240 : 300)) * 100}
              className="w-full mb-6"
            />

            <div className="flex justify-center gap-2 mb-4">
              <Button
                onClick={() => changeDifficulty("easy")}
                variant={difficulty === "easy" ? "default" : "outline"}
                className={difficulty === "easy" ? "bg-indigo-600" : ""}
              >
                Easy
              </Button>
              <Button
                onClick={() => changeDifficulty("medium")}
                variant={difficulty === "medium" ? "default" : "outline"}
                className={difficulty === "medium" ? "bg-indigo-600" : ""}
              >
                Medium
              </Button>
              <Button
                onClick={() => changeDifficulty("hard")}
                variant={difficulty === "hard" ? "default" : "outline"}
                className={difficulty === "hard" ? "bg-indigo-600" : ""}
              >
                Hard
              </Button>
            </div>

            <div className="mb-6 w-full overflow-x-auto">
              <div
                className="grid gap-1 mx-auto"
                style={{
                  gridTemplateColumns: `repeat(${gridSize}, minmax(30px, 1fr))`,
                  maxWidth: `${gridSize * 40}px`,
                }}
                onMouseLeave={() => {
                  if (isSelecting) {
                    setIsSelecting(false)
                    handleCellMouseUp()
                  }
                }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        flex items-center justify-center w-9 h-9 text-lg font-bold rounded cursor-pointer select-none
                        ${isCellSelected(rowIndex, colIndex) ? "bg-indigo-500 text-white" : "bg-gray-100"}
                        ${isCellInFoundWord(rowIndex, colIndex) ? "bg-green-300" : ""}
                      `}
                      onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                      onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                      onMouseUp={handleCellMouseUp}
                    >
                      {cell}
                    </div>
                  )),
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-6">
              {words.map((word) => (
                <Badge
                  key={word}
                  variant="outline"
                  className={`px-3 py-1 text-sm ${foundWords.includes(word) ? "bg-green-100 text-green-800 line-through" : "bg-gray-100"}`}
                >
                  {word} {foundWords.includes(word) && <span className="ml-1 text-xs">({translations[word]})</span>}
                </Badge>
              ))}
            </div>

            {gameOver && (
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-indigo-600 mb-2">
                  {foundWords.length === words.length ? "Congratulations!" : "Game Over!"}
                </h3>
                <p className="mb-4">
                  You found {foundWords.length} out of {words.length} words
                </p>
                <p className="text-lg font-bold mb-4">Score: {score}</p>
                <Button onClick={startNewGame} className="bg-indigo-600 hover:bg-indigo-700">
                  Play Again
                </Button>
              </div>
            )}

            <div className="text-center mt-6">
              <Button onClick={() => router.push("/games")} variant="outline">
                Back to Games
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

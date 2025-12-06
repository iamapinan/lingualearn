"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getRandomVocabulary } from "@/lib/db/data/vocabulary-data"
import { saveGameResult } from "@/lib/database"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { BackButton } from "@/components/back-button"
import { playCorrectSound, playIncorrectSound } from "@/lib/audio-utils"
import type { VocabularyItem } from "@/lib/db/data/vocabulary-data"

const WHEEL_SECTIONS = 8
const ROTATION_DURATION = 4000 // 4 seconds for smoother deceleration
const MIN_ROTATIONS = 8 // Minimum number of full rotations
const MAX_ROTATIONS = 12 // Maximum number of full rotations

interface WheelItem {
  hint: string
  answer: string
  category: string
}

export default function MysteryWheelGame() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [wheelItems, setWheelItems] = useState<WheelItem[]>([])
  const [currentRotation, setCurrentRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedSector, setSelectedSector] = useState<WheelSector | null>(null)
  const [currentQuestion, setCurrentQuestion] = useState<VocabularyItem | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [gameStatus, setGameStatus] = useState<"idle" | "spinning" | "bankrupt" | "question" | "correct" | "incorrect">("idle")
  const [feedbackMessage, setFeedbackMessage] = useState("")
  
  // Audio refs (simulated with utils for now)
  
  const wheelRef = useRef<HTMLDivElement>(null)

  // Define Wheel Sectors
  const sectors: WheelSector[] = [
    { id: 1, type: "points", value: 100, label: "100", color: "#4ECDC4" },
    { id: 2, type: "points", value: 200, label: "200", color: "#45B7D1" },
    { id: 3, type: "points", value: 500, label: "500", color: "#96CEB4" },
    { id: 4, type: "bankrupt", value: 0, label: "Bankrupt", color: "#FF6B6B", icon: "💀" },
    { id: 5, type: "points", value: 1000, label: "1K", color: "#FFD93D" }, // Jackpot
    { id: 6, type: "points", value: 250, label: "250", color: "#FF9F43" },
    { id: 7, type: "double", value: 0, label: "x2", color: "#A8E6CF", icon: "✨" },
    { id: 8, type: "points", value: 750, label: "750", color: "#FF8066" },
  ]

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }
  }, [user, router])

  const spinWheel = () => {
    if (isSpinning) return

    setIsSpinning(true)
    setGameStatus("spinning")
    setSelectedSector(null)
    setCurrentQuestion(null)
    setUserAnswer("")
    setFeedbackMessage("")

    // Select target sector randomly
    const targetIndex = Math.floor(Math.random() * WHEEL_SECTIONS)
    
    // Calculate rotation
    const sectionAngle = 360 / WHEEL_SECTIONS
    const targetFinalAngle = (360 - targetIndex * sectionAngle) % 360
    const randomOffset = (Math.random() - 0.5) * 8
    const currentAngle = currentRotation % 360
    let rotationNeeded = (targetFinalAngle - currentAngle + randomOffset + 360) % 360
    if (rotationNeeded < 1) rotationNeeded = 1
    
    const fullRotations = MIN_ROTATIONS + Math.random() * (MAX_ROTATIONS - MIN_ROTATIONS)
    const totalRotation = currentRotation + fullRotations * 360 + rotationNeeded

    setCurrentRotation(totalRotation)

    // Wheel stops
    setTimeout(() => {
      const finalAngle = totalRotation % 360
      const index = Math.floor((360 - finalAngle) / sectionAngle) % WHEEL_SECTIONS
      const sector = sectors[index]
      
      setSelectedSector(sector)
      setIsSpinning(false)
      
      handleSectorLand(sector)
    }, ROTATION_DURATION)
  }

  const handleSectorLand = (sector: WheelSector) => {
    if (sector.type === "bankrupt") {
      setScore(0)
      setGameStatus("bankrupt")
      playIncorrectSound()
    } else {
      // Generate a question
      const vocab = getRandomVocabulary()
      setCurrentQuestion(vocab)
      setGameStatus("question")
    }
  }

  const checkAnswer = async () => {
    if (!currentQuestion || !selectedSector) return

    const normalizedUserAnswer = userAnswer.toLowerCase().trim()
    const normalizedCorrectAnswer = currentQuestion.word.toLowerCase().trim()

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      // Correct
      playCorrectSound()
      let pointsEarned = 0
      
      if (selectedSector.type === "points") {
        pointsEarned = selectedSector.value
      } else if (selectedSector.type === "double") {
        pointsEarned = score // Add current score again to double it
        if (pointsEarned === 0) pointsEarned = 100 // Pity points if score was 0
      }

      const newScore = score + pointsEarned
      setScore(newScore)
      setGameStatus("correct")
      setFeedbackMessage(`Correct! You earned ${pointsEarned} points!`)

      // Save result
      if (user) {
        saveGameResult({
          userId: user.id,
          gameType: "mystery-wheel",
          score: newScore,
          date: new Date().toISOString(),
          details: {
            pointsEarned,
            sector: selectedSector.label,
            question: currentQuestion.word
          }
        }, token || undefined)
      }
      
    } else {
      // Incorrect
      playIncorrectSound()
      setGameStatus("incorrect")
      setFeedbackMessage(`Incorrect! The answer was "${currentQuestion.word}".`)
    }
  }

  const handleNextSpin = () => {
    setGameStatus("idle")
    setUserAnswer("")
    setCurrentQuestion(null)
    setSelectedSector(null)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && gameStatus === "question") {
      checkAnswer()
    }
  }

  const getSectionAngle = (index: number) => {
    return (360 / WHEEL_SECTIONS) * index
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6 text-center">Mystery Wheel</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Panel: Stats */}
        <div className="md:col-span-1 space-y-4">
          <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-none shadow-lg">
            <CardContent className="p-6 text-center">
              <p className="text-sm font-medium opacity-80 uppercase tracking-wider mb-1">Total Score</p>
              <p className="text-4xl font-black">{score}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <h3 className="font-bold text-gray-700 mb-2">How to Play</h3>
              <ul className="text-sm text-gray-600 space-y-2 list-disc pl-4">
                <li>Spin the wheel to determine your reward.</li>
                <li>Answer the vocabulary question correctly to claim it.</li>
                <li>Watch out for <span className="text-red-500 font-bold">Bankrupt</span>!</li>
                <li>Hit <span className="text-green-500 font-bold">x2</span> to double your score.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Center/Right Panel: Game Area */}
        <div className="md:col-span-2">
          <Card className="border-2 border-indigo-100 shadow-xl overflow-hidden">
            <CardContent className="p-6">
              
              {/* Wheel Visual */}
              <div className="relative mb-8 flex justify-center">
                <div className="relative">
                  {/* Pointer */}
                  <div className="absolute top-[-15px] left-1/2 transform -translate-x-1/2 z-20 filter drop-shadow-md">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                      <path d="M20 40 L35 10 L20 15 L5 10 Z" fill="#FF4757" stroke="#FFFFFF" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* The Wheel */}
                  <div
                    ref={wheelRef}
                    className="w-72 h-72 md:w-96 md:h-96 rounded-full shadow-2xl border-4 border-white"
                    style={{
                      transform: `rotate(${currentRotation}deg)`,
                      transition: isSpinning
                        ? `transform ${ROTATION_DURATION}ms cubic-bezier(0.2, 0.8, 0.2, 1)`
                        : "none",
                    }}
                  >
                    <svg viewBox="0 0 320 320" className="w-full h-full">
                      <circle cx="160" cy="160" r="158" fill="#333" />
                      {sectors.map((sector, index) => {
                        const startAngle = getSectionAngle(index) - 90
                        const endAngle = getSectionAngle(index + 1) - 90
                        const angle = (startAngle + endAngle) / 2
                        
                        // Calculate coordinates
                        const x1 = 160 + 150 * Math.cos((startAngle * Math.PI) / 180)
                        const y1 = 160 + 150 * Math.sin((startAngle * Math.PI) / 180)
                        const x2 = 160 + 150 * Math.cos((endAngle * Math.PI) / 180)
                        const y2 = 160 + 150 * Math.sin((endAngle * Math.PI) / 180)
                        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

                        return (
                          <g key={sector.id}>
                            <path
                              d={`M 160 160 L ${x1} ${y1} A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                              fill={sector.color}
                              stroke="#FFF"
                              strokeWidth="2"
                            />
                            <g transform={`rotate(${angle + 90}, ${160 + 100 * Math.cos((angle * Math.PI) / 180)}, ${160 + 100 * Math.sin((angle * Math.PI) / 180)})`}>
                              <text
                                x={160 + 100 * Math.cos((angle * Math.PI) / 180)}
                                y={160 + 100 * Math.sin((angle * Math.PI) / 180)}
                                textAnchor="middle"
                                dominantBaseline="middle"
                                className="fill-white font-black text-lg drop-shadow-md"
                                style={{ fontSize: "24px" }}
                              >
                                {sector.icon || sector.label}
                              </text>
                            </g>
                          </g>
                        )
                      })}
                      {/* Center Hub */}
                      <circle cx="160" cy="160" r="25" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="4" />
                      <circle cx="160" cy="160" r="15" fill="#4F46E5" />
                      <text x="160" y="160" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="10" fontWeight="bold">SPIN</text>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Game Interaction Area */}
              <div className="min-h-[200px] flex flex-col items-center justify-center">
                
                {/* Idle State */}
                {gameStatus === "idle" && (
                  <Button 
                    onClick={spinWheel} 
                    disabled={isSpinning} 
                    size="lg"
                    className="bg-indigo-600 hover:bg-indigo-700 text-xl px-12 py-6 rounded-full shadow-lg hover:shadow-xl transform transition hover:-translate-y-1"
                  >
                    {isSpinning ? "Spinning..." : "SPIN THE WHEEL!"}
                  </Button>
                )}

                {/* Bankrupt State */}
                {gameStatus === "bankrupt" && (
                  <div className="text-center animate-in zoom-in duration-300">
                    <div className="text-6xl mb-4">💸</div>
                    <h2 className="text-3xl font-bold text-red-600 mb-2">BANKRUPT!</h2>
                    <p className="text-gray-600 mb-6">Oh no! You lost all your points.</p>
                    <Button onClick={handleNextSpin} variant="outline">Try Again</Button>
                  </div>
                )}

                {/* Question State */}
                {gameStatus === "question" && currentQuestion && selectedSector && (
                  <div className="w-full max-w-md animate-in slide-in-from-bottom duration-500">
                    <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-6 mb-4">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-xs font-bold text-indigo-500 uppercase tracking-wider">For {selectedSector.label} Points</span>
                        <span className="bg-white px-2 py-1 rounded text-xs font-medium text-gray-500">{currentQuestion.category}</span>
                      </div>
                      <h3 className="text-xl font-medium text-center mb-2">Translate this word:</h3>
                      <p className="text-3xl font-bold text-center text-indigo-900 mb-6">{currentQuestion.translation}</p>
                      
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          placeholder="Type English word..."
                          value={userAnswer}
                          onChange={(e) => setUserAnswer(e.target.value)}
                          onKeyDown={handleKeyPress}
                          className="text-center text-lg h-12"
                          autoFocus
                        />
                      </div>
                    </div>
                    <Button onClick={checkAnswer} className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg">
                      Submit Answer
                    </Button>
                  </div>
                )}

                {/* Result State */}
                {(gameStatus === "correct" || gameStatus === "incorrect") && (
                  <div className="text-center w-full max-w-md animate-in fade-in duration-300">
                    <div className={`rounded-xl p-6 mb-6 ${gameStatus === "correct" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                      <div className="text-5xl mb-4">{gameStatus === "correct" ? "🎉" : "❌"}</div>
                      <h2 className={`text-2xl font-bold mb-2 ${gameStatus === "correct" ? "text-green-700" : "text-red-700"}`}>
                        {gameStatus === "correct" ? "Awesome!" : "Wrong Answer"}
                      </h2>
                      <p className="text-gray-700 text-lg">{feedbackMessage}</p>
                    </div>
                    <Button onClick={handleNextSpin} size="lg" className="bg-indigo-600 hover:bg-indigo-700">
                      Spin Again
                    </Button>
                  </div>
                )}

              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

// Types
interface WheelSector {
  id: number
  type: "points" | "bankrupt" | "double"
  value: number
  label: string
  color: string
  icon?: string
}


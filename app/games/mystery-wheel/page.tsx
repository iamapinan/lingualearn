"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { getRandomVocabularySet } from "@/lib/db/data/vocabulary-data"
import { saveGameResult } from "@/lib/database"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { BackButton } from "@/components/back-button"
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
  const { user } = useAuth()
  const [wheelItems, setWheelItems] = useState<WheelItem[]>([])
  const [currentRotation, setCurrentRotation] = useState(0)
  const [isSpinning, setIsSpinning] = useState(false)
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)
  const [userAnswer, setUserAnswer] = useState("")
  const [score, setScore] = useState(0)
  const [totalAttempts, setTotalAttempts] = useState(0)
  const [correctAnswers, setCorrectAnswers] = useState(0)
  const [gameStatus, setGameStatus] = useState<"idle" | "answering" | "correct" | "incorrect">("idle")
  const [showHint, setShowHint] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    initializeWheel()
  }, [user, router])

  const initializeWheel = () => {
    const vocabularySet = getRandomVocabularySet(WHEEL_SECTIONS)
    const items: WheelItem[] = vocabularySet.map((vocab) => ({
      hint: vocab.translation,
      answer: vocab.word.toLowerCase().trim(),
      category: vocab.category,
    }))
    setWheelItems(items)
    setCurrentRotation(0)
    setSelectedItem(null)
    setSelectedIndex(-1)
    setUserAnswer("")
    setGameStatus("idle")
    setShowHint(false)
  }

  const spinWheel = () => {
    if (isSpinning || wheelItems.length === 0) return

    setIsSpinning(true)
    setShowHint(false)
    setSelectedItem(null)
    setSelectedIndex(-1)
    setUserAnswer("")
    setGameStatus("idle")

    // Select target section randomly
    const targetIndex = Math.floor(Math.random() * WHEEL_SECTIONS)
    
    // Calculate target angle to stop at selected section
    // Pointer is at bottom (270°), each section is 45° (360/8)
    // SVG sections start at -90° (top)
    // Section centers: -67.5°, -22.5°, 22.5°, 67.5°, 112.5°, 157.5°, 202.5°, 247.5°
    // After rotation, we want: (targetIndex * 45 - 90) + finalAngle = 270
    // So: finalAngle = 270 - (targetIndex * 45 - 90) = 360 - targetIndex * 45
    
    const sectionAngle = 360 / WHEEL_SECTIONS
    const targetFinalAngle = (360 - targetIndex * sectionAngle) % 360
    
    // Add small random offset within section for natural feel (±8 degrees)
    const randomOffset = (Math.random() - 0.5) * 8
    
    // Calculate rotation needed from current position
    const currentAngle = currentRotation % 360
    let rotationNeeded = (targetFinalAngle - currentAngle + randomOffset + 360) % 360
    
    // Ensure minimum rotation (at least a small amount)
    if (rotationNeeded < 1) {
      rotationNeeded = 1
    }
    
    // Add multiple full rotations for dramatic effect
    const fullRotations = MIN_ROTATIONS + Math.random() * (MAX_ROTATIONS - MIN_ROTATIONS)
    const totalRotation = currentRotation + fullRotations * 360 + rotationNeeded

    setCurrentRotation(totalRotation)

    // Calculate which section the wheel stops at
    setTimeout(() => {
      // Normalize final rotation to 0-360 range
      const finalAngle = totalRotation % 360
      // Pointer is at bottom (270°), calculate which section center aligns with pointer
      // Section i center in SVG: (i * 45 - 90)° 
      // After rotation: (i * 45 - 90) + finalAngle
      // We want: (i * 45 - 90) + finalAngle = 270
      // Solving: i * 45 = 270 - finalAngle + 90 = 360 - finalAngle
      // i = (360 - finalAngle) / 45
      const index = Math.floor((360 - finalAngle) / sectionAngle) % WHEEL_SECTIONS

      setSelectedIndex(index)
      setSelectedItem(wheelItems[index])
      setIsSpinning(false)
    }, ROTATION_DURATION)
  }

  const showHintForSelected = () => {
    if (selectedItem) {
      setShowHint(true)
      setGameStatus("answering")
    }
  }

  const checkAnswer = async () => {
    if (!selectedItem || !userAnswer.trim()) return

    const normalizedUserAnswer = userAnswer.toLowerCase().trim()
    const normalizedCorrectAnswer = selectedItem.answer.toLowerCase().trim()

    setTotalAttempts(totalAttempts + 1)

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      setCorrectAnswers(correctAnswers + 1)
      const pointsEarned = 10
      setScore(score + pointsEarned)
      setGameStatus("correct")

      if (user) {
        await saveGameResult({
          userId: user.id,
          gameType: "mystery-wheel",
          score: pointsEarned,
          date: new Date().toISOString(),
          details: {
            word: selectedItem.answer,
            hint: selectedItem.hint,
            category: selectedItem.category,
          },
        })
      }
    } else {
      setGameStatus("incorrect")
    }
  }

  const handleNextRound = () => {
    initializeWheel()
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && gameStatus === "answering") {
      checkAnswer()
    }
  }

  const getSectionAngle = (index: number) => {
    return (360 / WHEEL_SECTIONS) * index
  }

  const getSectionColor = (index: number) => {
    const colors = [
      "#FF6B6B",
      "#4ECDC4",
      "#45B7D1",
      "#FFA07A",
      "#98D8C8",
      "#F7DC6F",
      "#BB8FCE",
      "#85C1E2",
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <BackButton />
      <h1 className="text-3xl font-bold mb-6 text-center">วงล้อปริศนา</h1>

      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white">
          <CardTitle className="text-center text-2xl">Mystery Wheel Game</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center mb-6">
            {/* Score Display */}
            <div className="flex gap-6 mb-6 text-center">
              <div className="bg-blue-100 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-600">คะแนน</div>
                <div className="text-2xl font-bold text-blue-600">{score}</div>
              </div>
              <div className="bg-green-100 px-4 py-2 rounded-lg">
                <div className="text-sm text-gray-600">ถูกต้อง</div>
                <div className="text-2xl font-bold text-green-600">{correctAnswers}/{totalAttempts}</div>
              </div>
            </div>

            {/* Wheel Container */}
            <div className="relative mb-6">
              <div
                ref={wheelRef}
                className="relative w-80 h-80 mx-auto"
                style={{
                  transform: `rotate(${currentRotation}deg)`,
                  transition: isSpinning
                    ? `transform ${ROTATION_DURATION}ms cubic-bezier(0.17, 0.67, 0.12, 0.99)`
                    : "none",
                  willChange: isSpinning ? "transform" : "auto",
                }}
              >
                <svg viewBox="0 0 320 320" className="w-full h-full">
                  <circle cx="160" cy="160" r="150" fill="#fff" stroke="#333" strokeWidth="4" />
                  {wheelItems.map((item, index) => {
                    const startAngle = getSectionAngle(index) - 90
                    const endAngle = getSectionAngle(index + 1) - 90
                    const angle = (startAngle + endAngle) / 2

                    const x1 = 160 + 150 * Math.cos((startAngle * Math.PI) / 180)
                    const y1 = 160 + 150 * Math.sin((startAngle * Math.PI) / 180)
                    const x2 = 160 + 150 * Math.cos((endAngle * Math.PI) / 180)
                    const y2 = 160 + 150 * Math.sin((endAngle * Math.PI) / 180)

                    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

                    return (
                      <g key={index}>
                        <path
                          d={`M 160 160 L ${x1} ${y1} A 150 150 0 ${largeArcFlag} 1 ${x2} ${y2} Z`}
                          fill={getSectionColor(index)}
                          stroke="#333"
                          strokeWidth="2"
                        />
                        <text
                          x={160 + 90 * Math.cos((angle * Math.PI) / 180)}
                          y={160 + 90 * Math.sin((angle * Math.PI) / 180)}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          className="fill-white font-bold text-sm"
                          transform={`rotate(${angle + 90}, ${160 + 90 * Math.cos((angle * Math.PI) / 180)}, ${160 + 90 * Math.sin((angle * Math.PI) / 180)})`}
                        >
                          {index + 1}
                        </text>
                      </g>
                    )
                  })}
                  <circle cx="160" cy="160" r="20" fill="#333" />
                  <circle cx="160" cy="160" r="15" fill="#fff" />
                </svg>
              </div>

              {/* Pointer */}
              <div
                className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 translate-y-2"
                style={{ zIndex: 10 }}
              >
                <svg width="40" height="40" viewBox="0 0 40 40">
                  <polygon points="20,40 30,10 20,15 10,10" fill="#FFD700" stroke="#333" strokeWidth="2" />
                </svg>
              </div>
            </div>

            {/* Game Controls */}
            {gameStatus === "idle" && !selectedItem && (
              <Button onClick={spinWheel} disabled={isSpinning} className="bg-purple-600 hover:bg-purple-700 mb-4">
                {isSpinning ? "กำลังหมุน..." : "หมุนวงล้อ"}
              </Button>
            )}

            {selectedItem && gameStatus === "idle" && (
              <div className="text-center w-full">
                <Card className="bg-blue-50 border-blue-300 mb-4">
                  <CardContent className="p-4">
                    <p className="text-lg font-semibold mb-2">
                      วงล้อหยุดที่ช่อง {selectedIndex + 1}
                    </p>
                    <p className="text-sm text-gray-600 mb-4">คลิกปุ่มด้านล่างเพื่อดูคำใบ้</p>
                    <Button onClick={showHintForSelected} className="bg-blue-600 hover:bg-blue-700">
                      ดูคำใบ้
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Hint Display */}
            {showHint && selectedItem && (
              <div className="w-full max-w-md mb-4">
                <Card className="bg-yellow-50 border-yellow-300">
                  <CardContent className="p-4">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 mb-2">คำใบ้:</p>
                      <p className="text-2xl font-bold text-yellow-700">{selectedItem.hint}</p>
                      <p className="text-xs text-gray-500 mt-2">หมวดหมู่: {selectedItem.category}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Answer Input */}
            {gameStatus === "answering" && (
              <div className="w-full max-w-md mb-4">
                <Input
                  type="text"
                  placeholder="พิมพ์คำตอบภาษาอังกฤษ..."
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="text-center text-lg"
                  autoFocus
                />
                <Button onClick={checkAnswer} className="w-full mt-4 bg-green-600 hover:bg-green-700">
                  ตรวจคำตอบ
                </Button>
              </div>
            )}

            {/* Result Display */}
            {gameStatus === "correct" && (
              <div className="w-full max-w-md mb-4">
                <Card className="bg-green-50 border-green-300">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600 mb-2">ถูกต้อง!</p>
                    <p className="text-lg mb-2">
                      คำตอบที่ถูกต้องคือ: <span className="font-bold">{selectedItem?.answer}</span>
                    </p>
                    <p className="text-sm text-green-700">คุณได้คะแนน +10 คะแนน</p>
                    <Button onClick={handleNextRound} className="mt-4 bg-purple-600 hover:bg-purple-700">
                      หมุนรอบถัดไป
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}

            {gameStatus === "incorrect" && (
              <div className="w-full max-w-md mb-4">
                <Card className="bg-red-50 border-red-300">
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-red-600 mb-2">ผิด!</p>
                    <p className="text-lg mb-2">
                      คำตอบที่ถูกต้องคือ: <span className="font-bold">{selectedItem?.answer}</span>
                    </p>
                    <Button onClick={handleNextRound} className="mt-4 bg-purple-600 hover:bg-purple-700">
                      หมุนรอบถัดไป
                    </Button>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          <div className="text-center mt-6">
            <Button onClick={() => router.push("/games")} variant="outline">
              กลับไปหน้าเกมส์
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


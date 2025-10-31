"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, X } from "lucide-react"

interface MatchingOption {
  id: number
  text: string
  matchId?: number
  side?: string
}

interface MatchingExerciseProps {
  options: MatchingOption[]
  selections: { [key: number]: number }
  onSelect: (leftId: number, rightId: number) => void
  isCorrect: boolean | null
  disabled: boolean
}

export function MatchingExercise({ options, selections, onSelect, isCorrect, disabled }: MatchingExerciseProps) {
  const [selectedLeft, setSelectedLeft] = useState<number | null>(null)
  const [shuffledLeftOptions, setShuffledLeftOptions] = useState<MatchingOption[]>([])
  const [shuffledRightOptions, setShuffledRightOptions] = useState<MatchingOption[]>([])

  // แยกตัวเลือกฝั่งซ้ายและขวา
  let leftOptions: MatchingOption[] = []
  let rightOptions: MatchingOption[] = []

  // ตรวจสอบว่ามี side property หรือไม่
  const hasSideProperty = options.some((option) => option.side !== undefined)

  if (hasSideProperty) {
    // ถ้ามี side property ให้แยกตามค่า side
    leftOptions = options.filter((option) => option.side === "left")
    rightOptions = options.filter((option) => option.side === "right")
  } else {
    // ถ้าไม่มี side property ให้แยกตามค่า matchId
    leftOptions = options.filter((option) => option.matchId !== undefined)
    rightOptions = options.filter((option) => !option.matchId)
  }

  // ถ้าไม่มีตัวเลือกฝั่งขวา ให้สร้างตัวเลือกฝั่งขวาจากตัวเลือกฝั่งซ้าย
  if (rightOptions.length === 0 && leftOptions.length > 0) {
    rightOptions = leftOptions.map((option) => ({
      id: option.matchId || 0,
      text: `Option for ${option.text}`,
      matchId: option.id,
    }))
  }

  // สลับตำแหน่งตัวเลือกทั้งฝั่งซ้ายและขวาเมื่อโหลดคอมโพเนนต์
  useEffect(() => {
    // สลับตำแหน่งตัวเลือกฝั่งซ้าย
    const shuffledLeft = [...leftOptions].sort(() => Math.random() - 0.5)
    setShuffledLeftOptions(shuffledLeft)

    // สลับตำแหน่งตัวเลือกฝั่งขวา
    const shuffledRight = [...rightOptions].sort(() => Math.random() - 0.5)
    setShuffledRightOptions(shuffledRight)
  }, [JSON.stringify(options)]) // ใช้ JSON.stringify เพื่อเปรียบเทียบ options

  const handleLeftClick = (id: number) => {
    if (disabled) return
    setSelectedLeft(id)
  }

  const handleRightClick = (id: number) => {
    if (disabled || selectedLeft === null) return
    onSelect(selectedLeft, id)
    setSelectedLeft(null)
  }

  const isLeftSelected = (id: number) => selectedLeft === id
  const isRightSelected = (id: number) => {
    return Object.entries(selections).some(([leftId, rightId]) => Number(leftId) === selectedLeft && rightId === id)
  }
  const isMatched = (leftId: number) => leftId in selections
  const getMatchedRightId = (leftId: number) => selections[leftId]

  // ฟังก์ชันตรวจสอบว่าคู่ที่จับคู่กันถูกต้องหรือไม่
  const isPairCorrect = (leftId: number, rightId: number) => {
    const leftItem = options.find((item) => item.id === leftId && item.side === "left")
    if (!leftItem) return false

    // ตรวจสอบว่า matchId ของ leftItem ตรงกับ id ของ rightItem หรือไม่
    return leftItem.matchId === rightId
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="space-y-2">
        {(shuffledLeftOptions.length > 0 ? shuffledLeftOptions : leftOptions).map((option) => (
          <Button
            key={option.id}
            variant={isLeftSelected(option.id) ? "default" : isMatched(option.id) ? "outline" : "outline"}
            className={`w-full justify-start ${
              isCorrect !== null && isMatched(option.id)
                ? isPairCorrect(option.id, getMatchedRightId(option.id))
                  ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                  : "bg-red-100 border-red-500 text-red-700"
                : ""
            }`}
            onClick={() => handleLeftClick(option.id)}
            disabled={disabled || isMatched(option.id)}
          >
            {option.text}
            {isCorrect !== null &&
              isMatched(option.id) &&
              (isPairCorrect(option.id, getMatchedRightId(option.id)) ? (
                <Check className="ml-auto h-5 w-5 text-indigo-500" />
              ) : (
                <X className="ml-auto h-5 w-5 text-red-500" />
              ))}
          </Button>
        ))}
      </div>
      <div className="space-y-2">
        {(shuffledRightOptions.length > 0 ? shuffledRightOptions : rightOptions).map((option) => (
          <Button
            key={option.id}
            variant={
              Object.values(selections).includes(option.id)
                ? "outline"
                : isRightSelected(option.id)
                  ? "default"
                  : "outline"
            }
            className={`w-full justify-start ${
              isCorrect !== null &&
              Object.entries(selections).some(
                ([leftId, rightId]) => rightId === option.id && isPairCorrect(Number(leftId), rightId),
              )
                ? "bg-indigo-100 border-indigo-500 text-indigo-700"
                : isCorrect !== null &&
                    Object.entries(selections).some(
                      ([leftId, rightId]) => rightId === option.id && !isPairCorrect(Number(leftId), rightId),
                    )
                  ? "bg-red-100 border-red-500 text-red-700"
                  : ""
            }`}
            onClick={() => handleRightClick(option.id)}
            disabled={disabled || Object.values(selections).includes(option.id)}
          >
            {option.text}
            {isCorrect !== null &&
              Object.entries(selections).some(([leftId, rightId]) => {
                return (
                  rightId === option.id &&
                  (isPairCorrect(Number(leftId), rightId) ? (
                    <Check className="ml-auto h-5 w-5 text-indigo-500" />
                  ) : (
                    <X className="ml-auto h-5 w-5 text-red-500" />
                  ))
                )
              })}
          </Button>
        ))}
      </div>
    </div>
  )
}

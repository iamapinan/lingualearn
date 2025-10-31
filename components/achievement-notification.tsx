"use client"

import { useState, useEffect } from "react"
import { Trophy, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { getAchievementById } from "@/lib/db/data/achievements-data"
import { AchievementCard } from "./achievement-card"

interface AchievementNotificationProps {
  achievementId: number
  onClose: () => void
  onClaim: () => void
}

export function AchievementNotification({ achievementId, onClose, onClaim }: AchievementNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const achievement = getAchievementById(achievementId)

  useEffect(() => {
    // Play achievement sound
    const audio = new Audio("/sounds/achievement-unlocked.mp3")
    audio.play().catch((err) => console.error("Error playing achievement sound:", err))

    // Animate in
    setTimeout(() => setIsVisible(true), 100)

    // Auto-close after 10 seconds
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onClose, 500) // Wait for animation to complete
    }, 10000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!achievement) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={cn(
          "bg-white rounded-lg shadow-lg p-6 max-w-md w-full transform transition-all duration-500",
          isVisible ? "scale-100 opacity-100" : "scale-90 opacity-0",
        )}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            <Trophy className="h-6 w-6 text-yellow-500 mr-2" />
            <h2 className="text-xl font-bold">Achievement Unlocked!</h2>
          </div>
          <button
            onClick={() => {
              setIsVisible(false)
              setTimeout(onClose, 500)
            }}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-6">
          <AchievementCard
            id={achievement.id}
            name={achievement.name}
            description={achievement.description}
            icon={achievement.icon}
            category={achievement.category}
            rarity={achievement.rarity}
            unlocked={true}
            unlockedAt={new Date().toISOString()}
            xpReward={achievement.xpReward}
            pointsReward={achievement.pointsReward}
          />
        </div>

        <div className="flex justify-center">
          <button
            onClick={() => {
              onClaim()
              setIsVisible(false)
              setTimeout(onClose, 500)
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-full transition-colors"
          >
            Claim Rewards
          </button>
        </div>
      </div>
    </div>
  )
}

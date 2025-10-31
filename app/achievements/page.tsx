"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Trophy, Filter } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { AchievementCard } from "@/components/achievement-card"
import { AchievementNotification } from "@/components/achievement-notification"
import { achievements, ACHIEVEMENT_CATEGORIES, getAchievementsByCategory } from "@/lib/db/data/achievements-data"
import { getUserAchievements, claimAchievementReward, ensureDatabaseIndexes } from "@/lib/database"
import type { UserAchievement } from "@/lib/database-types"

export default function AchievementsPage() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showNotification, setShowNotification] = useState(false)
  const [newAchievementId, setNewAchievementId] = useState<number | null>(null)

  useEffect(() => {
    const loadAchievements = async () => {
      if (!user) return

      try {
        setLoading(true)

        // Ensure all required indexes exist
        await ensureDatabaseIndexes()

        try {
          const userAchievementsData = await getUserAchievements(user.id)
          setUserAchievements(userAchievementsData)

          // Check for unclaimed achievements to show notification
          const unclaimedAchievement = userAchievementsData.find((ua) => ua.unlocked && !ua.claimed)

          if (unclaimedAchievement) {
            setNewAchievementId(unclaimedAchievement.achievementId)
            setShowNotification(true)
          }
        } catch (achievementsError) {
          console.error("Error loading achievements data:", achievementsError)
          // Set empty achievements array to prevent further errors
          setUserAchievements([])
        }

        setLoading(false)
      } catch (dbError) {
        console.error("Error initializing database:", dbError)
        setLoading(false)
      }
    }

    loadAchievements()
  }, [user])

  const handleClaimReward = async (achievementId: number) => {
    if (!user) return

    try {
      const result = await claimAchievementReward(user.id, achievementId)
      if (result) {
        // Update the local state to mark achievement as claimed
        setUserAchievements((prev) =>
          prev.map((ua) => (ua.achievementId === achievementId ? { ...ua, claimed: true } : ua)),
        )

        // Close notification if it's showing
        setShowNotification(false)

        // Play reward sound
        const audio = new Audio("/sounds/points.mp3")
        audio.play().catch((err) => console.error("Error playing reward sound:", err))
      }
    } catch (error) {
      console.error("Error claiming achievement reward:", error)
    }
  }

  const getFilteredAchievements = () => {
    if (selectedCategory === "all") {
      return achievements
    }
    return getAchievementsByCategory(selectedCategory)
  }

  const isAchievementUnlocked = (achievementId: number) => {
    return userAchievements.some((ua) => ua.achievementId === achievementId && ua.unlocked)
  }

  const getAchievementUnlockDate = (achievementId: number) => {
    const achievement = userAchievements.find((ua) => ua.achievementId === achievementId && ua.unlocked)
    return achievement?.unlockedAt || null
  }

  const isAchievementClaimed = (achievementId: number) => {
    return userAchievements.some((ua) => ua.achievementId === achievementId && ua.claimed)
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading achievements...</p>
        </div>
      </div>
    )
  }

  const filteredAchievements = getFilteredAchievements()
  const unlockedAchievements = filteredAchievements.filter((a) => isAchievementUnlocked(a.id))
  const lockedAchievements = filteredAchievements.filter((a) => !isAchievementUnlocked(a.id))

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      {showNotification && newAchievementId && (
        <AchievementNotification
          achievementId={newAchievementId}
          onClose={() => setShowNotification(false)}
          onClaim={() => handleClaimReward(newAchievementId)}
        />
      )}

      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Achievements</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span className="font-medium">
            {unlockedAchievements.length} / {achievements.length} Unlocked
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <select
            className="border rounded-md px-2 py-1 text-sm"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value={ACHIEVEMENT_CATEGORIES.PROGRESS}>Progress</option>
            <option value={ACHIEVEMENT_CATEGORIES.STREAK}>Streak</option>
            <option value={ACHIEVEMENT_CATEGORIES.MASTERY}>Mastery</option>
            <option value={ACHIEVEMENT_CATEGORIES.VOCABULARY}>Vocabulary</option>
            <option value={ACHIEVEMENT_CATEGORIES.GAMES}>Games</option>
            <option value={ACHIEVEMENT_CATEGORIES.PRACTICE}>Practice</option>
            <option value={ACHIEVEMENT_CATEGORIES.SPECIAL}>Special</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="unlocked" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="unlocked">Unlocked ({unlockedAchievements.length})</TabsTrigger>
          <TabsTrigger value="locked">Locked ({lockedAchievements.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="unlocked">
          {unlockedAchievements.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {unlockedAchievements.map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  id={achievement.id}
                  name={achievement.name}
                  description={achievement.description}
                  icon={achievement.icon}
                  category={achievement.category}
                  rarity={achievement.rarity}
                  unlocked={true}
                  unlockedAt={getAchievementUnlockDate(achievement.id)}
                  claimed={isAchievementClaimed(achievement.id)}
                  xpReward={achievement.xpReward}
                  pointsReward={achievement.pointsReward}
                  onClick={() => {
                    if (!isAchievementClaimed(achievement.id)) {
                      handleClaimReward(achievement.id)
                    }
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">No Achievements Unlocked Yet</h3>
              <p className="text-gray-400">Complete lessons and challenges to earn achievements!</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="locked">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lockedAchievements.map((achievement) => (
              <AchievementCard
                key={achievement.id}
                id={achievement.id}
                name={achievement.name}
                description={achievement.description}
                icon={achievement.icon}
                category={achievement.category}
                rarity={achievement.rarity}
                unlocked={false}
                xpReward={achievement.xpReward}
                pointsReward={achievement.pointsReward}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

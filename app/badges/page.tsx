"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, Trophy, Star, Medal, Award, GraduationCap, BookOpen, Target, Flame } from "lucide-react"
import { getUserBadges } from "@/lib/database"
import { useAuth } from "@/components/auth-provider"

interface Badge {
  id: number
  name: string
  description: string
  icon: string
  category: string
  rarity: string
  earnedAt: string
  displayed: boolean
}

export default function BadgesPage() {
  const { user } = useAuth()
  const [badges, setBadges] = useState<Badge[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadBadges = async () => {
      if (!user) return

      try {
        const badgesData = await getUserBadges(user.id)
        setBadges(badgesData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading badges:", error)
        setLoading(false)
      }
    }

    loadBadges()
  }, [user])

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Trophy":
        return <Trophy className="h-6 w-6" />
      case "Star":
        return <Star className="h-6 w-6" />
      case "Medal":
        return <Medal className="h-6 w-6" />
      case "Award":
        return <Award className="h-6 w-6" />
      case "BookOpen":
        return <BookOpen className="h-6 w-6" />
      case "GraduationCap":
        return <GraduationCap className="h-6 w-6" />
      case "Target":
        return <Target className="h-6 w-6" />
      case "Flame":
        return <Flame className="h-6 w-6" />
      default:
        return <Award className="h-6 w-6" />
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-500"
      case "uncommon":
        return "bg-green-100 text-green-500"
      case "rare":
        return "bg-blue-100 text-blue-500"
      case "epic":
        return "bg-purple-100 text-purple-500"
      case "legendary":
        return "bg-yellow-100 text-yellow-500"
      default:
        return "bg-gray-100 text-gray-500"
    }
  }

  const getDisplayBadges = (): Badge[] => {
    return badges
  }

  const getLocked = (): Badge[] => {
    // Sample locked badges for display
    const lockedBadges = [
      {
        id: 100,
        name: "Polyglot",
        description: "Reach level 5 in 3 different languages",
        icon: "GraduationCap",
        category: "mastery",
        rarity: "legendary",
        earnedAt: "",
        displayed: false,
      },
      {
        id: 101,
        name: "Vocabulary Master",
        description: "Learn 100 vocabulary words",
        icon: "BookOpen",
        category: "vocabulary",
        rarity: "epic",
        earnedAt: "",
        displayed: false,
      },
      {
        id: 102,
        name: "Perfect Week",
        description: "Complete all daily missions for a week",
        icon: "Target",
        category: "achievement",
        rarity: "rare",
        earnedAt: "",
        displayed: false,
      },
      {
        id: 103,
        name: "Multilingual",
        description: "Study words in 3 different languages",
        icon: "Star",
        category: "exploration",
        rarity: "uncommon",
        earnedAt: "",
        displayed: false,
      },
    ]

    return lockedBadges
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading badges...</p>
        </div>
      </div>
    )
  }

  const displayBadges = getDisplayBadges()
  const lockedBadges = getLocked()

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Badges Collection</h1>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Your Badges</h2>
        {displayBadges.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {displayBadges.map((badge) => (
              <Card key={badge.id} className="hover:shadow-lg transition-shadow hover-transition">
                <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                  <div className={`p-3 rounded-full mb-2 ${getRarityColor(badge.rarity)}`}>
                    {getBadgeIcon(badge.icon)}
                  </div>
                  <h3 className="font-medium">{badge.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                  </span>
                  <p className="text-xs text-gray-400 mt-2">Earned {new Date(badge.earnedAt).toLocaleDateString()}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">You haven't earned any badges yet.</p>
              <p className="text-gray-500">Complete missions and challenges to earn badges!</p>
            </CardContent>
          </Card>
        )}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">Badges to Earn</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {lockedBadges.map((badge) => (
            <Card key={badge.id} className="hover:shadow-lg transition-shadow hover-transition opacity-60">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className={`p-3 rounded-full mb-2 bg-gray-200`}>{getBadgeIcon(badge.icon)}</div>
                <h3 className="font-medium">{badge.name}</h3>
                <p className="text-xs text-gray-500 mb-2">{badge.description}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getRarityColor(badge.rarity)}`}>
                  {badge.rarity.charAt(0).toUpperCase() + badge.rarity.slice(1)}
                </span>
                <p className="text-xs text-gray-400 mt-2">Locked</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

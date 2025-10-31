"use client"

import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Star,
  Medal,
  Award,
  GraduationCap,
  BookOpen,
  Target,
  Flame,
  Zap,
  BookMarked,
  Library,
  BookText,
  BookOpenCheck,
  Gamepad2,
  Puzzle,
  ScanText,
  Brain,
  Ear,
  Mic,
  Dumbbell,
  Moon,
  Sunrise,
  Calendar,
  Globe,
  Footprints,
  CalendarCheck,
  CalendarDays,
  Scroll,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface AchievementCardProps {
  id: number
  name: string
  description: string
  icon: string
  category: string
  rarity: string
  unlocked: boolean
  unlockedAt?: string | null
  claimed?: boolean
  xpReward: number
  pointsReward: number
  onClick?: () => void
  className?: string
}

export function AchievementCard({
  id,
  name,
  description,
  icon,
  category,
  rarity,
  unlocked,
  unlockedAt,
  claimed = false,
  xpReward,
  pointsReward,
  onClick,
  className,
}: AchievementCardProps) {
  // Function to get the appropriate icon component
  const getIconComponent = (iconName: string) => {
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
      case "Zap":
        return <Zap className="h-6 w-6" />
      case "BookMarked":
        return <BookMarked className="h-6 w-6" />
      case "Library":
        return <Library className="h-6 w-6" />
      case "BookText":
        return <BookText className="h-6 w-6" />
      case "BookOpenCheck":
        return <BookOpenCheck className="h-6 w-6" />
      case "Gamepad2":
        return <Gamepad2 className="h-6 w-6" />
      case "Puzzle":
        return <Puzzle className="h-6 w-6" />
      case "ScanText":
        return <ScanText className="h-6 w-6" />
      case "Brain":
        return <Brain className="h-6 w-6" />
      case "Ear":
        return <Ear className="h-6 w-6" />
      case "Mic":
        return <Mic className="h-6 w-6" />
      case "Dumbbell":
        return <Dumbbell className="h-6 w-6" />
      case "Moon":
        return <Moon className="h-6 w-6" />
      case "Sunrise":
        return <Sunrise className="h-6 w-6" />
      case "Calendar":
        return <Calendar className="h-6 w-6" />
      case "Globe":
        return <Globe className="h-6 w-6" />
      case "Footprints":
        return <Footprints className="h-6 w-6" />
      case "CalendarCheck":
        return <CalendarCheck className="h-6 w-6" />
      case "CalendarDays":
        return <CalendarDays className="h-6 w-6" />
      case "Scroll":
        return <Scroll className="h-6 w-6" />
      default:
        return <Award className="h-6 w-6" />
    }
  }

  // Function to get background color based on rarity
  const getRarityColor = (rarity: string, unlocked: boolean) => {
    if (!unlocked) return "bg-gray-100 text-gray-400"

    switch (rarity) {
      case "common":
        return "bg-blue-100 text-blue-600"
      case "uncommon":
        return "bg-green-100 text-green-600"
      case "rare":
        return "bg-purple-100 text-purple-600"
      case "epic":
        return "bg-indigo-100 text-indigo-600"
      case "legendary":
        return "bg-yellow-100 text-yellow-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  // Function to get border color based on rarity
  const getRarityBorder = (rarity: string, unlocked: boolean) => {
    if (!unlocked) return "border-gray-200"

    switch (rarity) {
      case "common":
        return "border-blue-200"
      case "uncommon":
        return "border-green-200"
      case "rare":
        return "border-purple-200"
      case "epic":
        return "border-indigo-200"
      case "legendary":
        return "border-yellow-200"
      default:
        return "border-gray-200"
    }
  }

  // Function to get badge color based on rarity
  const getRarityBadgeColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "uncommon":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "rare":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
      case "epic":
        return "bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <div
      className={cn(
        "relative border rounded-lg p-4 transition-all duration-200",
        unlocked ? "hover:shadow-md cursor-pointer" : "opacity-70",
        getRarityBorder(rarity, unlocked),
        className,
      )}
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-3">
        <div className={cn("p-3 rounded-full", getRarityColor(rarity, unlocked))}>{getIconComponent(icon)}</div>

        <div>
          <h3 className="font-bold text-lg">{name}</h3>
          <p className="text-sm text-gray-500 mb-2">{description}</p>

          <Badge className={cn("font-medium", getRarityBadgeColor(rarity))}>
            {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
          </Badge>
        </div>

        {unlocked && (
          <div className="mt-2 text-sm text-gray-500">
            Unlocked {unlockedAt ? new Date(unlockedAt).toLocaleDateString() : ""}
          </div>
        )}

        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-md">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="font-bold text-yellow-700">+{xpReward} XP</span>
          </div>
          <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-md">
            <Trophy className="h-4 w-4 text-purple-500" />
            <span className="font-bold text-purple-700">+{pointsReward} Points</span>
          </div>
        </div>

        {unlocked && !claimed && (
          <div className="absolute top-2 right-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  )
}

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { Trophy, Star } from "lucide-react"

interface GameCardProps {
  title: string
  description: string
  imageSrc: string
  xpReward?: number
  difficulty: "easy" | "medium" | "hard"
  href?: string
  bestScore?: number
  timesPlayed?: number
  onClick?: () => void
}

export function GameCard({
  title,
  description,
  imageSrc,
  xpReward = 20,
  difficulty,
  href,
  bestScore,
  timesPlayed,
  onClick,
}: GameCardProps) {
  // Map difficulty to color
  const difficultyColor = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
  }

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer">
      <div className="relative h-[240px]">
        <Image
          src={imageSrc || "/placeholder.svg?height=200&width=300&query=educational game"}
          alt={title}
          fill
          className="object-cover w-full h-240"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${difficultyColor[difficulty]}`}>
            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
          </span>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-bold mb-1">{title}</h3>
        <p className="text-sm text-gray-500 mb-3">{description}</p>

        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">+{xpReward} XP</span>
          </div>

          {bestScore !== undefined && (
            <div className="flex items-center gap-1">
              <Trophy className="h-4 w-4 text-indigo-500" />
              <span className="text-sm font-medium">{bestScore} pts</span>
            </div>
          )}
        </div>

        {timesPlayed !== undefined && <p className="text-xs text-gray-400 mb-3">Played {timesPlayed} times</p>}

        <Button className="w-full bg-indigo-500 hover:bg-indigo-600">Play Now</Button>
      </CardContent>
    </Card>
  )
}

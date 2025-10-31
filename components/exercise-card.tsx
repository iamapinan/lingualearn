import type React from "react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ExerciseCardProps {
  title: string
  description: string
  href: string
  difficulty?: "beginner" | "intermediate" | "advanced" | "all-levels"
  exerciseCount?: number
  tags?: string[]
  icon?: React.ReactNode
}

export function ExerciseCard({
  title,
  description,
  href,
  difficulty = "all-levels",
  exerciseCount = 5,
  tags = [],
  icon,
}: ExerciseCardProps) {
  // Map difficulty to color
  const difficultyColor = {
    beginner: "bg-green-100 text-green-800",
    intermediate: "bg-blue-100 text-blue-800",
    advanced: "bg-purple-100 text-purple-800",
    "all-levels": "bg-gray-100 text-gray-800",
  }

  // Safely capitalize the first letter with null check
  const capitalizedDifficulty = difficulty ? difficulty.charAt(0).toUpperCase() + difficulty.slice(1) : "All Levels"

  return (
    <Link href={href} className="block transition-transform hover:scale-[1.02]">
      <Card className="h-full border-indigo-100 hover:border-indigo-300 shadow-sm hover:shadow-md transition-all">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-bold text-indigo-700">{title}</CardTitle>
            {icon && <div className="text-indigo-500">{icon}</div>}
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm text-gray-600 mb-3">{description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className={difficultyColor[difficulty] || difficultyColor["all-levels"]}>
              {capitalizedDifficulty}
            </Badge>
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="bg-indigo-50 text-indigo-700">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="text-xs text-gray-500">{exerciseCount} exercises</div>
        </CardFooter>
      </Card>
    </Link>
  )
}

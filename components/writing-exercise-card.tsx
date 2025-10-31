import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PenLine } from "lucide-react"
import Link from "next/link"

interface WritingExerciseCardProps {
  title: string
  description: string
  difficulty: "beginner" | "intermediate" | "advanced"
  exerciseCount: number
  category: string
  href: string
}

export function WritingExerciseCard({
  title,
  description,
  difficulty,
  exerciseCount,
  category,
  href,
}: WritingExerciseCardProps) {
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
            <PenLine className="h-5 w-5 text-purple-600" />
          </div>
          <Badge
            variant={
              difficulty === "beginner" ? "outline" : difficulty === "intermediate" ? "secondary" : "destructive"
            }
          >
            {difficulty}
          </Badge>
        </div>
        <h3 className="font-bold text-lg mt-2">{title}</h3>
        <p className="text-sm text-gray-500">{category}</p>
      </CardHeader>
      <CardContent className="pb-2 flex-grow">
        <p className="text-sm text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center">
        <p className="text-xs text-gray-500">{exerciseCount} exercises</p>
        <Button asChild>
          <Link href={href}>Start Practice</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

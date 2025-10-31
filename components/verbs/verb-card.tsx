"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Verb } from "@/lib/database-types"

interface VerbCardProps {
  verb: Verb
  onClick?: () => void
}

export function VerbCard({ verb, onClick }: VerbCardProps) {
  const accuracyRate = verb.correctCount + verb.incorrectCount > 0
    ? Math.round((verb.correctCount / (verb.correctCount + verb.incorrectCount)) * 100)
    : 0

  const difficultyColors = {
    1: "bg-green-100 text-green-800",
    2: "bg-yellow-100 text-yellow-800",
    3: "bg-red-100 text-red-800",
  }

  const categoryColors = {
    regular: "bg-blue-100 text-blue-800",
    irregular: "bg-purple-100 text-purple-800",
  }

  return (
    <Card 
      className="hover:shadow-lg transition-shadow cursor-pointer" 
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{verb.baseForm}</CardTitle>
          <div className="flex gap-2">
            <Badge className={categoryColors[verb.category]}>
              {verb.category === "regular" ? "Regular" : "Irregular"}
            </Badge>
            <Badge className={difficultyColors[verb.difficulty as 1 | 2 | 3]}>
              Level {verb.difficulty}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-600">Past Simple:</span>
              <p className="font-medium">{verb.pastSimple}</p>
            </div>
            <div>
              <span className="text-gray-600">Past Participle:</span>
              <p className="font-medium">{verb.pastParticiple}</p>
            </div>
          </div>

          <div>
            <span className="text-gray-600 text-sm">แปล:</span>
            <p className="font-medium">{verb.translation}</p>
          </div>

          {verb.exampleSentence && (
            <div>
              <span className="text-gray-600 text-sm">ตัวอย่าง:</span>
              <p className="text-sm italic">{verb.exampleSentence}</p>
            </div>
          )}

          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-sm">
              <span className="text-gray-600">ความแม่นยำ:</span>
              <span className="font-semibold ml-1">{accuracyRate}%</span>
            </div>
            <div className="text-xs text-gray-500">
              ถูก: {verb.correctCount} | ผิด: {verb.incorrectCount}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


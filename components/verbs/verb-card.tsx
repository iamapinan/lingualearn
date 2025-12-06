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
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex gap-2">
            <Badge className={categoryColors[verb.category]}>
              {verb.category === "regular" ? "Regular" : "Irregular"}
            </Badge>
            <Badge className={difficultyColors[verb.difficulty as 1 | 2 | 3]}>
              Level {verb.difficulty}
            </Badge>
          </div>
          <div className="text-xs text-gray-500">
            แม่นยำ: {accuracyRate}%
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 3 Forms Grid */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-xs text-gray-500 block mb-1">V1 (Base)</span>
              <p className="font-bold text-indigo-600 break-all">{verb.baseForm}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-xs text-gray-500 block mb-1">V2 (Past)</span>
              <p className="font-bold text-indigo-600 break-all">{verb.pastSimple}</p>
            </div>
            <div className="p-2 bg-gray-50 rounded-lg border border-gray-100">
              <span className="text-xs text-gray-500 block mb-1">V3 (Participle)</span>
              <p className="font-bold text-indigo-600 break-all">{verb.pastParticiple}</p>
            </div>
          </div>

          <div className="pt-2 border-t border-gray-100">
            <div className="mb-2">
              <span className="text-gray-500 text-sm mr-2">แปล:</span>
              <span className="font-medium text-gray-900">{verb.translation}</span>
            </div>

            {verb.exampleSentence && (
              <div className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded">
                "{verb.exampleSentence}"
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Trophy, Medal, Star, Zap, BookOpen, Gamepad, Activity } from "lucide-react"
import { BackButton } from "@/components/back-button"
import { useAuth } from "@/components/auth-provider"

interface LeaderboardEntry {
  id: number
  name: string
  totalXp: number
  totalPoints: number
  level: number
  lessonsCompleted: number
  activityCount: number
  streak: number
}

export default function LeaderboardPage() {
  const { user } = useAuth()
  const [xpLeaderboard, setXpLeaderboard] = useState<LeaderboardEntry[]>([])
  const [activityLeaderboard, setActivityLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("xp")

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch("/api/leaderboard")
        if (response.ok) {
          const data = await response.json()
          setXpLeaderboard(data.xpLeaderboard || [])
          setActivityLeaderboard(data.activityLeaderboard || [])
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [])

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-6 w-6 text-yellow-500" />
    if (rank === 2) return <Medal className="h-6 w-6 text-gray-400" />
    if (rank === 3) return <Medal className="h-6 w-6 text-orange-600" />
    return null
  }

  const getRankBadge = (rank: number) => {
    if (rank === 1) return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white"
    if (rank === 2) return "bg-gradient-to-r from-gray-300 to-gray-500 text-white"
    if (rank === 3) return "bg-gradient-to-r from-orange-400 to-orange-600 text-white"
    return "bg-gray-100 text-gray-700"
  }

  const renderLeaderboardEntry = (entry: LeaderboardEntry, rank: number, type: "xp" | "activity") => {
    const isCurrentUser = user && entry.id === user.id
    return (
      <div
        key={entry.id}
        className={`flex items-center gap-4 p-4 rounded-lg border transition-all ${
          isCurrentUser
            ? "bg-indigo-50 border-indigo-300 shadow-md"
            : "bg-white border-gray-200 hover:shadow-sm"
        }`}
      >
        <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${getRankBadge(rank)}`}>
          {getRankIcon(rank) || <span>{rank}</span>}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-lg ${isCurrentUser ? "text-indigo-700" : "text-gray-900"}`}>
              {entry.name}
            </h3>
            {isCurrentUser && (
              <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs rounded-full">คุณ</span>
            )}
          </div>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500" />
              Level {entry.level}
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="h-4 w-4 text-blue-500" />
              {entry.lessonsCompleted} บทเรียน
            </span>
            {entry.streak > 0 && (
              <span className="flex items-center gap-1">
                <Zap className="h-4 w-4 text-orange-500" />
                {entry.streak} วัน
              </span>
            )}
          </div>
        </div>

        <div className="text-right">
          {type === "xp" ? (
            <div>
              <div className="text-2xl font-bold text-indigo-600">{entry.totalPoints.toLocaleString()}</div>
              <div className="text-sm text-gray-500">คะแนน</div>
            </div>
          ) : (
            <div>
              <div className="text-2xl font-bold text-green-600">{entry.activityCount.toLocaleString()}</div>
              <div className="text-sm text-gray-500">กิจกรรม</div>
            </div>
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <BackButton />
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
            <p className="text-lg">กำลังโหลด...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <BackButton />
      <div className="mb-6 text-center">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          🏆 Leaderboard 🏆
        </h1>
        <p className="text-gray-600">ดูอันดับผู้ใช้ที่มีคะแนนสูงสุดและทำกิจกรรมบ่อยที่สุด</p>
      </div>

      <Card className="border border-indigo-100 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <CardTitle className="text-center text-2xl">อันดับผู้ใช้</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="xp" className="flex items-center gap-2">
                <Trophy className="h-4 w-4" />
                คะแนนสูงสุด
              </TabsTrigger>
              <TabsTrigger value="activity" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                ทำกิจกรรมบ่อยที่สุด
              </TabsTrigger>
            </TabsList>

            <TabsContent value="xp">
              <div className="space-y-3">
                {xpLeaderboard.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">ยังไม่มีข้อมูล</div>
                ) : (
                  xpLeaderboard.map((entry, index) => renderLeaderboardEntry(entry, index + 1, "xp"))
                )}
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <div className="space-y-3">
                {activityLeaderboard.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">ยังไม่มีข้อมูล</div>
                ) : (
                  activityLeaderboard.map((entry, index) => renderLeaderboardEntry(entry, index + 1, "activity"))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <div className="mt-6 text-center text-sm text-gray-500">
        <p>อัพเดทแบบเรียลไทม์ • อันดับจะเปลี่ยนแปลงตามกิจกรรมของผู้ใช้</p>
      </div>
    </div>
  )
}


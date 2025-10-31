"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Star,
  Trophy,
  Flame,
  Calendar,
  Award,
  Target,
  Check,
  Mic,
  Gamepad,
  Brain,
  Headphones,
  BookText,
  Sparkles,
  Zap,
  BarChart2,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import LearningPath from "@/components/learning-path"
import { calculateLevelFromXP, calculateXPForNextLevel, calculateLevelProgress } from "@/lib/scoring-system"
import { GameCard } from "@/components/game-card"

export default function HomePage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [languages, setLanguages] = useState<any[]>([])
  const [selectedLanguage, setSelectedLanguage] = useState<number>(1)
  const [lessons, setLessons] = useState<any[]>([])
  const [completedLessons, setCompletedLessons] = useState<any[]>([])
  const [challenges, setChallenges] = useState<any[]>([])
  const [missions, setMissions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHomeData = async () => {
      if (!user || !token) {
        console.log("No user or token, redirecting to /auth")
        router.push("/auth")
        return
      }

      console.log("Loading home data for user:", user.name)

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        }

        console.log("Fetching APIs...")
        const [languagesRes, lessonsRes, completionsRes, challengesRes, missionsRes] = await Promise.all([
          fetch("/api/languages"),
          fetch(`/api/lessons?languageId=${selectedLanguage}`),
          fetch("/api/lesson-completions", { headers }),
          fetch("/api/challenges", { headers }),
          fetch("/api/missions", { headers }),
        ])

        console.log("API responses:", {
          languages: languagesRes.status,
          lessons: lessonsRes.status,
          completions: completionsRes.status,
          challenges: challengesRes.status,
          missions: missionsRes.status,
        })

        if (languagesRes.ok) {
          const data = await languagesRes.json()
          console.log("Languages loaded:", data.languages?.length)
          setLanguages(data.languages || [])
        } else {
          console.error("Languages API failed:", await languagesRes.text())
        }

        if (lessonsRes.ok) {
          const data = await lessonsRes.json()
          console.log("Lessons loaded:", data.lessons?.length)
          setLessons(data.lessons || [])
        } else {
          console.error("Lessons API failed:", await lessonsRes.text())
        }

        if (completionsRes.ok) {
          const data = await completionsRes.json()
          console.log("Completions loaded:", data.completions?.length)
          setCompletedLessons(data.completions || [])
        } else {
          console.error("Completions API failed:", await completionsRes.text())
        }

        if (challengesRes.ok) {
          const data = await challengesRes.json()
          console.log("Challenges loaded:", data.challenges?.length)
          setChallenges(data.challenges || [])
        } else {
          console.error("Challenges API failed:", await challengesRes.text())
        }

        if (missionsRes.ok) {
          const data = await missionsRes.json()
          console.log("Missions loaded:", data.missions?.length)
          setMissions(data.missions || [])
        } else {
          console.error("Missions API failed:", await missionsRes.text())
        }

        console.log("Home data loading complete")
        setLoading(false)
      } catch (error) {
        console.error("Error loading home data:", error)
        setLoading(false)
      }
    }

    loadHomeData()
  }, [user, token, router, selectedLanguage])

  if (loading || !user) {
    return (
      <div className="w-full max-w-full mx-auto px-10 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">กำลังโหลด...</p>
        </div>
      </div>
    )
  }

  const userLevel = calculateLevelFromXP(user.totalXp || 0)
  const xpForNextLevel = calculateXPForNextLevel(user.totalXp || 0)
  const levelProgress = calculateLevelProgress(user.totalXp || 0)
  const selectedLanguageData = languages.find((lang) => lang.id === selectedLanguage)

  return (
    <div className="w-full max-w-full mx-auto px-10 py-8 bg-gradient-to-b from-indigo-50 to-purple-50 min-h-screen">
      {/* Hero Section */}
      <div className="mb-8 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">ยินดีต้อนรับกลับมา, {user.name}!</h1>
            <p className="text-indigo-100 mb-4">เริ่มต้นการเรียนรู้ภาษาของคุณวันนี้</p>
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-300" />
                Level {userLevel}
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-medium flex items-center">
                <Trophy className="h-4 w-4 mr-1 text-orange-300" />
                {completedLessons.length} บทเรียน
              </div>
            </div>
            <div className="mb-2">
              <div className="flex justify-between items-center mb-1 text-xs">
                <span>Level {userLevel}</span>
                <span>Level {userLevel + 1}</span>
              </div>
              <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-full"
                  style={{ width: `${levelProgress}%` }}
                ></div>
              </div>
              <div className="mt-1 text-xs text-right">{xpForNextLevel} XP ถึง level ถัดไป</div>
            </div>
          </div>
          <div className="flex-shrink-0 w-32 h-32 relative">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Quick Actions */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3 mt-2">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-bold">เรียนต่อ</h3>
                <p className="text-xs text-white/80 mb-3">ทำบทเรียนต่อ</p>
                <Button
                  size="sm"
                  className="bg-white text-emerald-700 hover:bg-white/90 w-full"
                  onClick={() => router.push(`/lesson/${lessons[0]?.id || 101}`)}
                >
                  เริ่ม
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3 mt-2">
                  <Headphones className="h-6 w-6" />
                </div>
                <h3 className="font-bold">ฟัง</h3>
                <p className="text-xs text-white/80 mb-3">ฝึกการฟัง</p>
                <Button
                  size="sm"
                  className="bg-white text-indigo-700 hover:bg-white/90 w-full"
                  onClick={() => router.push("/practice/listening")}
                >
                  ฝึก
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-500 to-pink-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3 mt-2">
                  <Mic className="h-6 w-6" />
                </div>
                <h3 className="font-bold">พูด</h3>
                <p className="text-xs text-white/80 mb-3">ฝึกการออกเสียง</p>
                <Button
                  size="sm"
                  className="bg-white text-pink-700 hover:bg-white/90 w-full"
                  onClick={() => router.push("/practice/speaking")}
                >
                  ฝึก
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mb-3 mt-2">
                  <BookText className="h-6 w-6" />
                </div>
                <h3 className="font-bold">อ่าน</h3>
                <p className="text-xs text-white/80 mb-3">ฝึกการอ่าน</p>
                <Button
                  size="sm"
                  className="bg-white text-orange-700 hover:bg-white/90 w-full"
                  onClick={() => router.push("/practice/reading")}
                >
                  ฝึก
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Learning Path */}
          <Card className="border border-indigo-100 shadow-md">
            <CardHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 pb-2">
              <CardTitle className="text-lg flex items-center gap-2 text-indigo-800">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                {selectedLanguageData?.name} เส้นทางการเรียน
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <LearningPath />
            </CardContent>
          </Card>

          {/* Mini Games */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-indigo-800">
                <Gamepad className="h-5 w-5 text-indigo-600" />
                เกมสนุกๆ
              </h2>
              <Button
                variant="outline"
                onClick={() => router.push("/games")}
                className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
              >
                ดูทั้งหมด
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <GameCard
                title="Word Scramble"
                description="จัดเรียงตัวอักษรให้ถูกต้อง"
                imageSrc="/wscb.png"
                xpReward={20}
                difficulty="easy"
                href="/games/word-scramble"
                bestScore={120}
                timesPlayed={5}
              />

              <GameCard
                title="Memory Match"
                description="จับคู่คำศัพท์"
                imageSrc="/memory-card-game.png"
                xpReward={25}
                difficulty="medium"
                href="/games/memory-match"
                bestScore={85}
                timesPlayed={3}
              />

              <GameCard
                title="Speed Challenge"
                description="แปลให้เร็วที่สุด"
                imageSrc="/speed-challenge-cover.svg"
                xpReward={30}
                difficulty="hard"
                href="/games/speed-challenge"
                bestScore={210}
                timesPlayed={7}
              />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Daily Stats */}
          <Card className="border border-indigo-100 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <BarChart2 className="h-5 w-5" />
                สถิติของคุณ
              </h2>
            </div>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4 text-indigo-500" />
                    <h3 className="text-sm font-semibold text-indigo-700">XP</h3>
                  </div>
                  <p className="text-xl font-bold text-indigo-900">{user.totalXp || 0}</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-amber-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="h-4 w-4 text-amber-500" />
                    <h3 className="text-sm font-semibold text-amber-700">Streak</h3>
                  </div>
                  <p className="text-xl font-bold text-amber-900">{user.streak || 0} วัน</p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <BookOpen className="h-4 w-4 text-green-500" />
                    <h3 className="text-sm font-semibold text-green-700">บทเรียน</h3>
                  </div>
                  <p className="text-xl font-bold text-green-900">{completedLessons.length}</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Trophy className="h-4 w-4 text-purple-500" />
                    <h3 className="text-sm font-semibold text-purple-700">Level</h3>
                  </div>
                  <p className="text-xl font-bold text-purple-900">{userLevel}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Daily Goals */}
          <Card className="border border-indigo-100 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-teal-600 p-4 text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                เป้าหมายรายวัน
              </h2>
            </div>
            <CardContent className="p-4">
              <div className="space-y-4">
                {challenges.slice(0, 3).map((challenge, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        challenge.completed
                          ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                          : "bg-gradient-to-br from-indigo-400 to-indigo-500 text-white"
                      }`}
                    >
                      {challenge.completed ? <Check className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{challenge.title}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          {challenge.progress}/{challenge.requirementCount}
                        </p>
                        <p className="text-sm font-medium text-indigo-500 flex items-center">
                          <Sparkles className="h-3 w-3 mr-1 text-amber-500" />+{challenge.xpReward} XP
                        </p>
                      </div>
                      <Progress
                        value={(challenge.progress / challenge.requirementCount) * 100}
                        className="h-1.5 mt-1"
                      />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-green-200 text-green-700 hover:bg-green-50"
                onClick={() => router.push("/challenges")}
              >
                ดูทั้งหมด
              </Button>
            </CardContent>
          </Card>

          {/* Missions */}
          <Card className="border border-indigo-100 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-4 text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <Award className="h-5 w-5" />
                ภารกิจ
              </h2>
            </div>
            <CardContent className="p-4">
              <div className="space-y-4">
                {missions.slice(0, 3).map((mission, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        mission.completed
                          ? "bg-gradient-to-br from-green-400 to-emerald-500 text-white"
                          : "bg-gradient-to-br from-amber-400 to-amber-500 text-white"
                      }`}
                    >
                      {mission.completed ? <Check className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{mission.title}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500">
                          {mission.progress}/{mission.requirementCount}
                        </p>
                        <p className="text-sm font-medium text-amber-500 flex items-center">
                          <Sparkles className="h-3 w-3 mr-1 text-amber-500" />+{mission.xpReward} XP
                        </p>
                      </div>
                      <Progress value={(mission.progress / mission.requirementCount) * 100} className="h-1.5 mt-1" />
                    </div>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                className="w-full mt-4 border-amber-200 text-amber-700 hover:bg-amber-50"
                onClick={() => router.push("/missions")}
              >
                ดูทั้งหมด
              </Button>
            </CardContent>
          </Card>

          {/* Verbs Card - NEW */}
          <Card className="border-0 shadow-md overflow-hidden bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <Brain className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">Verbs</h3>
                  <p className="text-sm text-white/80">เรียนรู้คำกริยา</p>
                </div>
              </div>
              <p className="mb-4 text-white/90">
                ฝึกฝนคำกริยาภาษาอังกฤษทั้ง regular และ irregular
              </p>
              <Button
                className="w-full bg-white text-purple-700 hover:bg-white/90"
                onClick={() => router.push("/verbs")}
              >
                เริ่มฝึก Verbs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

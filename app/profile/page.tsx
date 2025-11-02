"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Trophy, Star, BookOpen, Calendar, Clock, Award, Flame, Target, TrendingUp, KeyRound, User } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ChangePasswordDialog } from "@/components/auth/change-password-dialog"
import { EditNameDialog } from "@/components/auth/edit-name-dialog"
import {
  getUserStats,
  getUserCompletedLessons,
  getLanguageCompletionPercentage,
  getUserBadges,
} from "@/lib/database"
import { calculateLevelFromXP, calculateXPForNextLevel, calculateLevelProgress } from "@/lib/scoring-system"

export default function ProfilePage() {
  const router = useRouter()
  const { user, token, updateUser } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [completedLessons, setCompletedLessons] = useState<any[]>([])
  const [languageProgress, setLanguageProgress] = useState<{ [key: string]: number }>({})
  const [badges, setBadges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [changePasswordDialogOpen, setChangePasswordDialogOpen] = useState(false)
  const [editNameDialogOpen, setEditNameDialogOpen] = useState(false)

  useEffect(() => {
    const loadProfileData = async () => {
      if (!user) {
        router.push("/auth")
        return
      }

      try {
        // Get user stats
        const userStats = await getUserStats()
        setStats(userStats)

        // Get completed lessons
        const lessons = await getUserCompletedLessons(user.id)
        setCompletedLessons(lessons)

        // Get language progress
        const spanishProgress = await getLanguageCompletionPercentage(user.id, 4)
        const frenchProgress = await getLanguageCompletionPercentage(user.id, 3)
        const englishProgress = await getLanguageCompletionPercentage(user.id, 1)
        const thaiProgress = await getLanguageCompletionPercentage(user.id, 2)
        const japaneseProgress = await getLanguageCompletionPercentage(user.id, 5)
        const chineseProgress = await getLanguageCompletionPercentage(user.id, 6)
        const koreanProgress = await getLanguageCompletionPercentage(user.id, 7)

        setLanguageProgress({
          english: englishProgress,
          thai: thaiProgress,
          french: frenchProgress,
          spanish: spanishProgress,
          japanese: japaneseProgress,
          chinese: chineseProgress,
          korean: koreanProgress,
        })

        // Get user badges
        const userBadges = await getUserBadges(user.id)
        setBadges(userBadges)

        setLoading(false)
      } catch (error) {
        console.error("Error loading profile data:", error)
        setLoading(false)
      }
    }

    loadProfileData()
  }, [user, router])

  if (loading || !user) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading profile...</p>
        </div>
      </div>
    )
  }

  // คำนวณระดับและความก้าวหน้า
  const userLevel = calculateLevelFromXP(stats?.totalXp || 0)
  const xpForNextLevel = calculateXPForNextLevel(stats?.totalXp || 0)
  const levelProgress = calculateLevelProgress(stats?.totalXp || 0)

  // คำนวณสถิติเพิ่มเติม
  const totalLessonsCompleted = completedLessons.length
  const perfectLessons = completedLessons.filter((lesson) => lesson.correctAnswers === lesson.totalQuestions).length
  const averageAccuracy =
    completedLessons.length > 0
      ? Math.round(
          completedLessons.reduce((sum, lesson) => sum + (lesson.correctAnswers / lesson.totalQuestions) * 100, 0) /
            completedLessons.length,
        )
      : 0

  const handleChangePassword = async (oldPassword: string, newPassword: string) => {
    const response = await fetch("/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ oldPassword, newPassword }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "ไม่สามารถเปลี่ยนรหัสผ่านได้")
    }

    alert("เปลี่ยนรหัสผ่านสำเร็จ")
  }

  const handleUpdateName = async (newName: string) => {
    if (!token) {
      throw new Error("ไม่พบ token การยืนยันตัวตน")
    }

    const response = await fetch("/api/users/me", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newName }),
    })

    if (!response.ok) {
      const data = await response.json()
      throw new Error(data.error || "ไม่สามารถอัปเดตชื่อได้")
    }

    const data = await response.json()
    
    // อัปเดต user ใน context
    updateUser(data.user)

    alert("อัปเดตชื่อสำเร็จ")
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="flex-1">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-indigo-100">
                    <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-indigo-500">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold">{user.name}</h1>
                    <p className="text-gray-500">Joined {new Date(user.joinedDate).toLocaleDateString()}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                        <Star className="h-3 w-3 mr-1" />
                        Level {userLevel}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-fit"
                    onClick={() => setEditNameDialogOpen(true)}
                  >
                    <User className="h-4 w-4 mr-2" />
                    แก้ไขชื่อ
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-fit"
                    onClick={() => setChangePasswordDialogOpen(true)}
                  >
                    <KeyRound className="h-4 w-4 mr-2" />
                    เปลี่ยนรหัสผ่าน
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-indigo-500" />
                  <h2 className="text-lg font-bold">Level Progress</h2>
                </div>
                <div className="text-sm text-gray-500">
                  {stats?.totalXp || 0} XP / {(stats?.totalXp || 0) + xpForNextLevel} XP
                </div>
              </div>
              <Progress value={levelProgress} className="h-2 mb-4" />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Level {userLevel}</span>
                <span>
                  {xpForNextLevel} XP to Level {userLevel + 1}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-indigo-500" />
                Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {badges.length > 0 ? (
                  badges.slice(0, 6).map((badge, index) => (
                    <div key={index} className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                        <Award className="h-6 w-6 text-indigo-500" />
                      </div>
                      <p className="text-sm font-medium">{badge.name}</p>
                      <p className="text-xs text-gray-500">{new Date(badge.earnedAt).toLocaleDateString()}</p>
                    </div>
                  ))
                ) : (
                  <p className="col-span-3 text-center text-gray-500">No badges earned yet. Keep learning!</p>
                )}
              </div>
              {badges.length > 6 && (
                <Button variant="link" className="w-full mt-4" onClick={() => router.push("/badges")}>
                  View all badges
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Tabs defaultValue="stats" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="languages">Languages</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="stats">
              <Card>
                <CardContent className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <BookOpen className="h-5 w-5 text-indigo-500" />
                        <h3 className="font-semibold">Lessons</h3>
                      </div>
                      <p className="text-2xl font-bold">{totalLessonsCompleted}</p>
                      <p className="text-sm text-gray-500">completed</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Star className="h-5 w-5 text-indigo-500" />
                        <h3 className="font-semibold">XP</h3>
                      </div>
                      <p className="text-2xl font-bold">{stats?.totalXp || 0}</p>
                      <p className="text-sm text-gray-500">total points</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="h-5 w-5 text-indigo-500" />
                        <h3 className="font-semibold">Accuracy</h3>
                      </div>
                      <p className="text-2xl font-bold">{averageAccuracy}%</p>
                      <p className="text-sm text-gray-500">average</p>
                    </div>
                    <div className="bg-indigo-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Trophy className="h-5 w-5 text-indigo-500" />
                        <h3 className="font-semibold">Perfect</h3>
                      </div>
                      <p className="text-2xl font-bold">{perfectLessons}</p>
                      <p className="text-sm text-gray-500">perfect lessons</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-indigo-500" />
                      Recent Progress
                    </h3>
                    {completedLessons.length > 0 ? (
                      <div className="space-y-3">
                        {completedLessons.slice(0, 5).map((lesson, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">Lesson #{lesson.lessonId}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(lesson.completedAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">{lesson.score}%</p>
                              <p className="text-sm text-gray-500">
                                {lesson.correctAnswers}/{lesson.totalQuestions} correct
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No lessons completed yet. Start learning!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="languages">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🇬🇧</span>
                          <h3 className="font-semibold">English</h3>
                        </div>
                        <span className="text-sm font-medium">{languageProgress.english}%</span>
                      </div>
                      <Progress value={languageProgress.english} className="h-2 bg-blue-200" />
                    </div>
                    {/* <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🇪🇸</span>
                          <h3 className="font-semibold">Spanish</h3>
                        </div>
                        <span className="text-sm font-medium">{languageProgress.spanish}%</span>
                      </div>
                      <Progress value={languageProgress.spanish} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🇫🇷</span>
                          <h3 className="font-semibold">French</h3>
                        </div>
                        <span className="text-sm font-medium">{languageProgress.french}%</span>
                      </div>
                      <Progress value={languageProgress.french} className="h-2" />
                    </div> */}

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🇹🇭</span>
                          <h3 className="font-semibold">Thai</h3>
                        </div>
                        <span className="text-sm font-medium">{languageProgress.thai}%</span>
                      </div>
                      <Progress value={languageProgress.thai} className="h-2 bg-blue-200" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🇯🇵</span>
                          <h3 className="font-semibold">Japanese</h3>
                        </div>
                        <span className="text-sm font-medium">{languageProgress.japanese}%</span> 
                      </div>
                      <Progress value={languageProgress.japanese} className="h-2 bg-blue-200" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🇨🇳</span>
                          <h3 className="font-semibold">Chinese</h3>
                        </div>
                        <span className="text-sm font-medium">{languageProgress.chinese}%</span> 
                      </div>
                      <Progress value={languageProgress.chinese} className="h-2 bg-blue-200" />
                    </div>
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🇰🇷</span>
                          <h3 className="font-semibold">Korean</h3>
                        </div>
                        <span className="text-sm font-medium">{languageProgress.korean}%</span> 
                      </div>
                      <Progress value={languageProgress.korean} className="h-2 bg-blue-200" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-indigo-500" />
                      Recent Activity
                    </h3>

                    {completedLessons.length > 0 ? (
                      <div className="space-y-3">
                        {completedLessons.slice(0, 10).map((lesson, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <BookOpen className="h-5 w-5 text-indigo-500" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">Completed Lesson #{lesson.lessonId}</p>
                              <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Clock className="h-3 w-3" />
                                <span>{new Date(lesson.completedAt).toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-semibold">
                              {lesson.score}%
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-4">No recent activity. Start learning!</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <EditNameDialog
        open={editNameDialogOpen}
        onClose={() => setEditNameDialogOpen(false)}
        onUpdateName={handleUpdateName}
        currentName={user.name}
      />
      <ChangePasswordDialog
        open={changePasswordDialogOpen}
        onClose={() => setChangePasswordDialogOpen(false)}
        onChangePassword={handleChangePassword}
      />
    </div>
  )
}

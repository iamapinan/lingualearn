"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Star, CheckCircle, Clock, Trophy, Calendar, Target, Flame } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface Mission {
  id: number
  title: string
  description: string
  type: string
  requirements: string
  xpReward: number
  pointsReward: number
  badgeId?: number
  order: number
  category: string
  progress: number
  requirementCount: number
  completed: boolean
  claimed: boolean
}

export default function MissionsPage() {
  const { user, token } = useAuth()
  const [missions, setMissions] = useState<Mission[]>([])
  const [loading, setLoading] = useState(true)
  const [claimingMission, setClaimingMission] = useState<number | null>(null)

  useEffect(() => {
    const loadMissions = async () => {
      if (!user || !token) return

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const response = await fetch("/api/missions", { headers })
        if (response.ok) {
          const data = await response.json()
          setMissions(data.missions || [])
        }
      } catch (error) {
        console.error("Error loading missions:", error)
      } finally {
        setLoading(false)
      }
    }

    loadMissions()
  }, [user, token])

  const handleClaimReward = async (missionId: number) => {
    if (!user || !token) return

    try {
      setClaimingMission(missionId)
      const response = await fetch(`/api/missions/${missionId}/claim`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.ok) {
        // Refresh missions
        const missionsRes = await fetch("/api/missions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (missionsRes.ok) {
          const data = await missionsRes.json()
          setMissions(data.missions || [])
        }
      }
      setClaimingMission(null)
    } catch (error) {
      console.error("Error claiming reward:", error)
      setClaimingMission(null)
    }
  }

  const getMissionIcon = (type: string) => {
    switch (type) {
      case "daily":
        return <Calendar className="h-6 w-6 text-indigo-500" />
      case "weekly":
        return <Flame className="h-6 w-6 text-orange-500" />
      case "achievement":
        return <Trophy className="h-6 w-6 text-yellow-500" />
      default:
        return <Target className="h-6 w-6 text-blue-500" />
    }
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading missions...</p>
        </div>
      </div>
    )
  }

  // Group missions by category
  const dailyMissions = missions.filter((mission) => mission.type === "daily")
  const weeklyMissions = missions.filter((mission) => mission.type === "weekly")
  const achievementMissions = missions.filter((mission) => mission.type === "achievement")

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Missions</h1>
      </div>

      <Tabs defaultValue="daily" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <div className="grid gap-4">
            {dailyMissions.map((mission) => (
              <Card key={mission.id} className={mission.completed ? "border-indigo-200 bg-indigo-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-indigo-100">{getMissionIcon(mission.type)}</div>
                    <div>
                      <h3 className="font-bold">{mission.title}</h3>
                      <p className="text-sm text-gray-500">{mission.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-medium">
                      {mission.progress} / {mission.requirementCount}
                    </span>
                  </div>
                  <Progress
                    value={(mission.progress / mission.requirementCount) * 100}
                    className="h-2 bg-gray-200 mb-3"
                  />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-md">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-yellow-700">+{mission.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-md">
                        <Trophy className="h-4 w-4 text-purple-500" />
                        <span className="font-bold text-purple-700">+{mission.pointsReward} Points</span>
                      </div>
                    </div>

                    {mission.completed ? (
                      mission.claimed ? (
                        <Button className="bg-gray-300" disabled>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Claimed
                        </Button>
                      ) : (
                        <Button
                          className="bg-indigo-500 hover:bg-indigo-600"
                          onClick={() => handleClaimReward(mission.id)}
                          disabled={claimingMission === mission.id}
                        >
                          {claimingMission === mission.id ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                              Claiming...
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Claim Reward
                            </>
                          )}
                        </Button>
                      )
                    ) : (
                      <Button variant="outline" disabled>
                        <Clock className="mr-2 h-4 w-4" />
                        In Progress
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {dailyMissions.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No daily missions available.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="weekly">
          <div className="grid gap-4">
            {weeklyMissions.map((mission) => (
              <Card key={mission.id} className={mission.completed ? "border-indigo-200 bg-indigo-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-orange-100">{getMissionIcon(mission.type)}</div>
                    <div>
                      <h3 className="font-bold">{mission.title}</h3>
                      <p className="text-sm text-gray-500">{mission.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-medium">
                      {mission.progress} / {mission.requirementCount}
                    </span>
                  </div>
                  <Progress
                    value={(mission.progress / mission.requirementCount) * 100}
                    className="h-2 bg-gray-200 mb-3"
                  />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-md">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-yellow-700">+{mission.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-md">
                        <Trophy className="h-4 w-4 text-purple-500" />
                        <span className="font-bold text-purple-700">+{mission.pointsReward} Points</span>
                      </div>
                      {mission.badgeId && (
                        <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-md">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="font-bold text-blue-700">Badge</span>
                        </div>
                      )}
                    </div>

                    {mission.completed ? (
                      mission.claimed ? (
                        <Button className="bg-gray-300" disabled>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Claimed
                        </Button>
                      ) : (
                        <Button
                          className="bg-indigo-500 hover:bg-indigo-600"
                          onClick={() => handleClaimReward(mission.id)}
                          disabled={claimingMission === mission.id}
                        >
                          {claimingMission === mission.id ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                              Claiming...
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Claim Reward
                            </>
                          )}
                        </Button>
                      )
                    ) : (
                      <Button variant="outline" disabled>
                        <Clock className="mr-2 h-4 w-4" />
                        In Progress
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {weeklyMissions.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No weekly missions available.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="achievements">
          <div className="grid gap-4">
            {achievementMissions.map((mission) => (
              <Card key={mission.id} className={mission.completed ? "border-indigo-200 bg-indigo-50" : ""}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-full bg-yellow-100">{getMissionIcon(mission.type)}</div>
                    <div>
                      <h3 className="font-bold">{mission.title}</h3>
                      <p className="text-sm text-gray-500">{mission.description}</p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center text-sm mb-1">
                    <span>Progress</span>
                    <span className="font-medium">
                      {mission.progress} / {mission.requirementCount}
                    </span>
                  </div>
                  <Progress
                    value={(mission.progress / mission.requirementCount) * 100}
                    className="h-2 bg-gray-200 mb-3"
                  />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded-md">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-bold text-yellow-700">+{mission.xpReward} XP</span>
                      </div>
                      <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-md">
                        <Trophy className="h-4 w-4 text-purple-500" />
                        <span className="font-bold text-purple-700">+{mission.pointsReward} Points</span>
                      </div>
                      {mission.badgeId && (
                        <div className="flex items-center gap-1 bg-blue-100 px-2 py-1 rounded-md">
                          <CheckCircle className="h-4 w-4 text-blue-500" />
                          <span className="font-bold text-blue-700">Badge</span>
                        </div>
                      )}
                    </div>

                    {mission.completed ? (
                      mission.claimed ? (
                        <Button className="bg-gray-300" disabled>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Claimed
                        </Button>
                      ) : (
                        <Button
                          className="bg-indigo-500 hover:bg-indigo-600"
                          onClick={() => handleClaimReward(mission.id)}
                          disabled={claimingMission === mission.id}
                        >
                          {claimingMission === mission.id ? (
                            <>
                              <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                              Claiming...
                            </>
                          ) : (
                            <>
                              <Star className="mr-2 h-4 w-4" />
                              Claim Reward
                            </>
                          )}
                        </Button>
                      )
                    ) : (
                      <Button variant="outline" disabled>
                        <Clock className="mr-2 h-4 w-4" />
                        In Progress
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {achievementMissions.length === 0 && (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">No achievement missions available.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

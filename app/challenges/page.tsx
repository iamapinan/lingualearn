"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, Zap, PenLine, Timer } from "lucide-react"
import Link from "next/link"

export default function ChallengesPage() {
  const router = useRouter()
  const { user, token } = useAuth()
  const [challenges, setChallenges] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChallenges = async () => {
      if (!user || !token) {
        router.push("/auth")
        return
      }

      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        }

        const response = await fetch("/api/challenges", { headers })
        if (response.ok) {
          const data = await response.json()
          setChallenges(data.challenges || [])
        }
      } catch (error) {
        console.error("Error loading challenges:", error)
      } finally {
        setLoading(false)
      }
    }

    loadChallenges()
  }, [user, token, router])

  const handleClaimReward = async (challengeId: number) => {
    if (!user || !token) return

    try {
      const response = await fetch(`/api/challenges/${challengeId}/complete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId: user.id }),
      })

      if (response.ok) {
        // Refresh challenges
        const challengesRes = await fetch("/api/challenges", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        if (challengesRes.ok) {
          const data = await challengesRes.json()
          setChallenges(data.challenges || [])
        }
      }
    } catch (error) {
      console.error("Error claiming challenge reward:", error)
    }
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2 text-center text-purple-800">Challenges</h1>
      <p className="text-center text-gray-600 mb-6">Complete challenges to earn XP and rewards</p>

      {/* Special Challenges Section */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 text-purple-700">Special Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Timed Writing Challenge Card */}
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Timer className="h-6 w-6 text-purple-600" />
                </div>
                <Badge variant="outline" className="bg-purple-100">
                  Special
                </Badge>
              </div>
              <CardTitle className="text-xl mt-2">Timed Writing Challenges</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-gray-700 mb-3">
                Test your writing skills under time pressure! Complete writing tasks within the time limit to earn
                special rewards.
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded flex items-center gap-1">
                  <Clock size={12} />
                  Time-based
                </div>
                <div className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded flex items-center gap-1">
                  <Trophy size={12} />
                  Special Rewards
                </div>
                <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded flex items-center gap-1">
                  <PenLine size={12} />
                  Writing Skills
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/challenges/timed-writing">Start Challenge</Link>
              </Button>
            </CardFooter>
          </Card>

          {/* Speed Challenge Card */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:shadow-md transition-shadow">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Zap className="h-6 w-6 text-amber-600" />
                </div>
                <Badge variant="outline" className="bg-amber-100">
                  Special
                </Badge>
              </div>
              <CardTitle className="text-xl mt-2">Speed Challenges</CardTitle>
            </CardHeader>
            <CardContent className="pb-2">
              <p className="text-gray-700 mb-3">
                How fast can you answer? Test your vocabulary recall speed and earn bonus points for quick responses.
              </p>
              <div className="flex flex-wrap gap-2">
                <div className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded flex items-center gap-1">
                  <Clock size={12} />
                  Speed-based
                </div>
                <div className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded flex items-center gap-1">
                  <Trophy size={12} />
                  XP Multipliers
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href="/games/speed-challenge">Start Challenge</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      {/* Daily Challenges Section */}
      <h2 className="text-xl font-bold mb-4 text-purple-700">Daily Challenges</h2>
      {loading ? (
        <div className="text-center py-8">Loading challenges...</div>
      ) : challenges.length === 0 ? (
        <div className="text-center py-8">No challenges available at the moment.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((challenge) => (
            <Card key={challenge.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge variant="outline">{challenge.type}</Badge>
                  <Badge variant="secondary">{challenge.xpReward} XP</Badge>
                </div>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
                <Progress value={(challenge.progress / challenge.requirementCount) * 100} className="h-2 mb-1" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Progress</span>
                  <span>
                    {challenge.progress} / {challenge.requirementCount}
                  </span>
                </div>
              </CardContent>
              <CardFooter>
                {challenge.completed ? (
                  <Button className="w-full" disabled>
                    Completed
                  </Button>
                ) : challenge.progress >= challenge.requirementCount ? (
                  <Button className="w-full bg-indigo-500 hover:bg-indigo-600" onClick={() => handleClaimReward(challenge.id)}>
                    Claim Reward
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => {
                      // Navigate to relevant section based on challenge type
                      if (challenge.type === "lesson") {
                        router.push("/")
                      } else if (challenge.type === "vocabulary") {
                        router.push("/vocabulary")
                      } else {
                        router.push("/practice")
                      }
                    }}
                  >
                    Go to {challenge.type.charAt(0).toUpperCase() + challenge.type.slice(1)}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

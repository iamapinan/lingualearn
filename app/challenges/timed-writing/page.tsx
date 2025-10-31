"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Clock, Trophy, Award, AlertCircle, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { saveTimedWritingChallenge, getTimedWritingStats } from "@/lib/database"
import { useToast } from "@/hooks/use-toast"
import { Confetti } from "@/components/confetti"

interface TimedWritingChallenge {
  id: number
  title: string
  prompt: string
  instructions: string
  timeLimit: number // in seconds
  minWordCount: number
  difficulty: "beginner" | "intermediate" | "advanced"
  category: string
  xpReward: number
  pointsReward: number
  specialReward?: {
    type: "badge" | "streak_bonus" | "xp_multiplier"
    value: string | number
  }
}

export default function TimedWritingChallengePage() {
  const router = useRouter()
  const { toast } = useToast()
  const [userId, setUserId] = useState<number | null>(null)
  const [challenges, setChallenges] = useState<TimedWritingChallenge[]>([])
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState<number | null>(null)
  const [userAnswer, setUserAnswer] = useState("")
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [isActive, setIsActive] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState<{
    wordCount: number
    timeTaken: number
    isSuccessful: boolean
    feedback: string
    reward: {
      xp: number
      points: number
      special?: {
        type: string
        value: string | number
      }
    }
  } | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [showConfetti, setShowConfetti] = useState(false)
  const [stats, setStats] = useState<{
    totalCompleted: number
    bestTime: number
    averageTime: number
    successRate: number
  } | null>(null)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number | null>(null)

  // Sample timed writing challenges
  const timedWritingChallenges: TimedWritingChallenge[] = [
    {
      id: 1,
      title: "Quick Introduction",
      prompt: "Write a brief introduction about yourself.",
      instructions: "Include your name, where you're from, and one hobby you enjoy.",
      timeLimit: 60, // 1 minute
      minWordCount: 30,
      difficulty: "beginner",
      category: "personal",
      xpReward: 20,
      pointsReward: 30,
    },
    {
      id: 2,
      title: "Daily Routine",
      prompt: "Describe your typical morning routine.",
      instructions: "Write about what you do from waking up until you start work or school.",
      timeLimit: 90, // 1.5 minutes
      minWordCount: 50,
      difficulty: "beginner",
      category: "daily life",
      xpReward: 25,
      pointsReward: 40,
    },
    {
      id: 3,
      title: "Movie Review",
      prompt: "Write a short review of the last movie you watched.",
      instructions: "Include the title, what you liked or disliked, and whether you would recommend it.",
      timeLimit: 120, // 2 minutes
      minWordCount: 70,
      difficulty: "intermediate",
      category: "entertainment",
      xpReward: 35,
      pointsReward: 50,
    },
    {
      id: 4,
      title: "Travel Experience",
      prompt: "Describe a memorable travel experience.",
      instructions: "Include where you went, what you did, and why it was memorable.",
      timeLimit: 150, // 2.5 minutes
      minWordCount: 80,
      difficulty: "intermediate",
      category: "travel",
      xpReward: 40,
      pointsReward: 60,
      specialReward: {
        type: "badge",
        value: "Travel Writer",
      },
    },
    {
      id: 5,
      title: "Problem Solution",
      prompt: "Identify a common problem in your city and propose a solution.",
      instructions: "Describe the problem, its effects, and your proposed solution.",
      timeLimit: 180, // 3 minutes
      minWordCount: 100,
      difficulty: "advanced",
      category: "society",
      xpReward: 50,
      pointsReward: 75,
    },
    {
      id: 6,
      title: "Technology Impact",
      prompt: "Discuss how technology has changed education.",
      instructions: "Explain both positive and negative impacts of technology on learning.",
      timeLimit: 210, // 3.5 minutes
      minWordCount: 120,
      difficulty: "advanced",
      category: "technology",
      xpReward: 60,
      pointsReward: 90,
      specialReward: {
        type: "xp_multiplier",
        value: 1.5,
      },
    },
    {
      id: 7,
      title: "Book Summary",
      prompt: "Summarize a book you've read recently.",
      instructions: "Include the title, author, main plot points, and your opinion.",
      timeLimit: 150, // 2.5 minutes
      minWordCount: 90,
      difficulty: "intermediate",
      category: "literature",
      xpReward: 45,
      pointsReward: 65,
    },
    {
      id: 8,
      title: "Career Goals",
      prompt: "Write about your career goals for the next five years.",
      instructions: "Describe what you hope to achieve and how you plan to get there.",
      timeLimit: 180, // 3 minutes
      minWordCount: 100,
      difficulty: "intermediate",
      category: "career",
      xpReward: 50,
      pointsReward: 70,
    },
    {
      id: 9,
      title: "Environmental Issue",
      prompt: "Discuss an environmental issue that concerns you.",
      instructions: "Explain the issue, its causes, effects, and possible solutions.",
      timeLimit: 240, // 4 minutes
      minWordCount: 150,
      difficulty: "advanced",
      category: "environment",
      xpReward: 70,
      pointsReward: 100,
      specialReward: {
        type: "badge",
        value: "Environmental Advocate",
      },
    },
    {
      id: 10,
      title: "Cultural Tradition",
      prompt: "Describe an important cultural tradition from your country or region.",
      instructions: "Explain what the tradition is, its history, and why it's important.",
      timeLimit: 180, // 3 minutes
      minWordCount: 120,
      difficulty: "advanced",
      category: "culture",
      xpReward: 55,
      pointsReward: 80,
    },
  ]

  useEffect(() => {
    // Get user from localStorage
    const userStr = localStorage.getItem("lingualearn_user")
    if (userStr) {
      const user = JSON.parse(userStr)
      setUserId(user.id)

      // Load user stats
      const loadStats = async () => {
        if (user.id) {
          const userStats = await getTimedWritingStats(user.id)
          setStats(userStats)
        }
      }

      loadStats()
    } else {
      // Redirect to auth page if no user
      router.push("/auth")
    }

    // Set challenges
    setChallenges(timedWritingChallenges)
  }, [router])

  // Filter challenges based on selected category and difficulty
  const filteredChallenges = challenges.filter((challenge) => {
    const categoryMatch = selectedCategory === "all" || challenge.category === selectedCategory
    const difficultyMatch = selectedDifficulty === "all" || challenge.difficulty === selectedDifficulty
    return categoryMatch && difficultyMatch
  })

  const startChallenge = (index: number) => {
    setCurrentChallengeIndex(index)
    setUserAnswer("")
    setTimeRemaining(filteredChallenges[index].timeLimit)
    setIsActive(true)
    setIsCompleted(false)
    setShowResults(false)
    setResults(null)
    startTimeRef.current = Date.now()

    // Start timer
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          // Time's up
          clearInterval(timerRef.current)
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const handleTimeUp = () => {
    setIsActive(false)
    setIsCompleted(true)

    // Evaluate submission
    evaluateSubmission(true)
  }

  const handleSubmit = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }

    setIsActive(false)
    setIsCompleted(true)

    // Evaluate submission
    evaluateSubmission(false)
  }

  const evaluateSubmission = (isTimeUp: boolean) => {
    if (currentChallengeIndex === null) return

    const challenge = filteredChallenges[currentChallengeIndex]
    const wordCount = userAnswer.trim().split(/\s+/).filter(Boolean).length
    const timeTaken = challenge.timeLimit - (timeRemaining || 0)
    const isSuccessful = !isTimeUp && wordCount >= challenge.minWordCount

    let feedback = ""
    let xpReward = 0
    let pointsReward = 0
    const specialReward = challenge.specialReward

    if (isTimeUp) {
      feedback = "Time's up! You didn't complete the challenge in time."
    } else if (wordCount < challenge.minWordCount) {
      feedback = `Your response is too short. You wrote ${wordCount} words, but the minimum is ${challenge.minWordCount}.`
    } else {
      // Calculate rewards based on time taken and word count
      const timeEfficiency = Math.min(1, challenge.timeLimit / (timeTaken * 2)) // Bonus for finishing quickly
      const wordCountBonus = Math.min(1, wordCount / (challenge.minWordCount * 1.5)) // Bonus for writing more

      xpReward = Math.round(challenge.xpReward * (1 + timeEfficiency * 0.5))
      pointsReward = Math.round(challenge.pointsReward * (1 + wordCountBonus * 0.5))

      // Apply special reward if available
      if (specialReward && specialReward.type === "xp_multiplier") {
        xpReward = Math.round(xpReward * (specialReward.value as number))
      }

      feedback = `Great job! You completed the challenge with ${wordCount} words in ${formatTime(timeTaken)}.`

      // Show confetti for successful completion
      setShowConfetti(true)
      setTimeout(() => setShowConfetti(false), 3000)
    }

    const resultData = {
      wordCount,
      timeTaken,
      isSuccessful,
      feedback,
      reward: {
        xp: isSuccessful ? xpReward : 0,
        points: isSuccessful ? pointsReward : 0,
        special:
          isSuccessful && specialReward
            ? {
                type: specialReward.type,
                value: specialReward.value,
              }
            : undefined,
      },
    }

    setResults(resultData)
    setShowResults(true)

    // Save challenge result to database
    if (userId) {
      saveTimedWritingChallenge(userId, {
        challengeId: challenge.id,
        wordCount,
        timeTaken,
        isSuccessful,
        xpEarned: resultData.reward.xp,
        pointsEarned: resultData.reward.points,
        specialReward: resultData.reward.special,
        date: new Date().toISOString(),
        content: userAnswer,
      })

      // Show toast notification
      if (isSuccessful) {
        toast({
          title: "Challenge Completed!",
          description: `You earned ${resultData.reward.xp} XP and ${resultData.reward.points} points.`,
          variant: "success",
        })
      } else {
        toast({
          title: "Challenge Failed",
          description: isTimeUp ? "You ran out of time." : "Your response didn't meet the requirements.",
          variant: "destructive",
        })
      }
    }
  }

  const resetChallenge = () => {
    setCurrentChallengeIndex(null)
    setUserAnswer("")
    setTimeRemaining(null)
    setIsActive(false)
    setIsCompleted(false)
    setShowResults(false)
    setResults(null)

    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
  }

  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Get unique categories for filter
  const categories = ["all", ...new Set(challenges.map((ch) => ch.category))]
  const difficulties = ["all", "beginner", "intermediate", "advanced"]

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  return (
    <div className="container mx-auto py-6 max-w-6xl">
      {showConfetti && <Confetti />}

      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push("/challenges")} className="flex items-center gap-2">
          <ArrowLeft size={16} />
          Back to Challenges
        </Button>
        <div className="flex items-center gap-2">
          {stats && (
            <Badge variant="outline" className="bg-purple-100">
              Completed: {stats.totalCompleted}
            </Badge>
          )}
        </div>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-center text-purple-800">Timed Writing Challenges</h1>
      <p className="text-center text-gray-600 mb-6">
        Test your writing skills under time pressure and earn special rewards!
      </p>

      {currentChallengeIndex === null ? (
        <>
          {/* Challenge selection view */}
          <div className="mb-6">
            <Tabs defaultValue="all" onValueChange={(value) => setSelectedCategory(value)}>
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-medium">Categories</h2>
                <select
                  className="border rounded px-2 py-1 text-sm"
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                >
                  {difficulties.map((diff) => (
                    <option key={diff} value={diff}>
                      {diff.charAt(0).toUpperCase() + diff.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <TabsList className="grid grid-cols-4 mb-4 block">
                {categories.map((category) => (
                  <TabsTrigger key={category} value={category} className="capitalize">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Stats card */}
          {stats && (
            <Card className="mb-6 bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
              <CardHeader>
                <CardTitle className="text-xl text-purple-800">Your Writing Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Challenges Completed</p>
                    <p className="text-2xl font-bold text-purple-700">{stats.totalCompleted}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Best Time</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {stats.bestTime ? formatTime(stats.bestTime) : "N/A"}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Average Time</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {stats.averageTime ? formatTime(Math.round(stats.averageTime)) : "N/A"}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <p className="text-sm text-gray-500">Success Rate</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {stats.successRate ? `${Math.round(stats.successRate)}%` : "N/A"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Challenge cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChallenges.map((challenge, index) => (
              <Card key={challenge.id} className="h-full flex flex-col hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between">
                    <Badge
                      variant={
                        challenge.difficulty === "beginner"
                          ? "outline"
                          : challenge.difficulty === "intermediate"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {challenge.difficulty}
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatTime(challenge.timeLimit)}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl mt-2">{challenge.title}</CardTitle>
                  <p className="text-sm text-gray-500 capitalize">{challenge.category}</p>
                </CardHeader>
                <CardContent className="pb-2 flex-grow">
                  <p className="text-sm text-gray-700 mb-2">{challenge.prompt}</p>
                  <p className="text-xs text-gray-500">{challenge.instructions}</p>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <div className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded flex items-center gap-1">
                      <Award size={12} />
                      {challenge.xpReward} XP
                    </div>
                    <div className="text-xs bg-indigo-50 text-indigo-700 px-2 py-1 rounded flex items-center gap-1">
                      <Trophy size={12} />
                      {challenge.pointsReward} Points
                    </div>
                    {challenge.specialReward && (
                      <div className="text-xs bg-amber-50 text-amber-700 px-2 py-1 rounded flex items-center gap-1">
                        <Award size={12} />
                        {challenge.specialReward.type === "badge"
                          ? `Badge: ${challenge.specialReward.value}`
                          : challenge.specialReward.type === "xp_multiplier"
                            ? `${challenge.specialReward.value}x XP Multiplier`
                            : `Streak Bonus: ${challenge.specialReward.value}`}
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button onClick={() => startChallenge(index)} className="w-full">
                    Start Challenge
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Active challenge view */}
          <Card className="mb-6 border-2 border-purple-200">
            <CardHeader>
              <div className="flex justify-between items-center">
                <Badge
                  variant={
                    filteredChallenges[currentChallengeIndex].difficulty === "beginner"
                      ? "outline"
                      : filteredChallenges[currentChallengeIndex].difficulty === "intermediate"
                        ? "secondary"
                        : "destructive"
                  }
                >
                  {filteredChallenges[currentChallengeIndex].difficulty}
                </Badge>
                <div className="flex items-center gap-2">
                  <Clock
                    size={16}
                    className={timeRemaining && timeRemaining < 30 ? "text-red-500 animate-pulse" : ""}
                  />
                  <span className={`font-mono ${timeRemaining && timeRemaining < 30 ? "text-red-500 font-bold" : ""}`}>
                    {timeRemaining !== null ? formatTime(timeRemaining) : "00:00"}
                  </span>
                </div>
              </div>
              <CardTitle className="text-xl font-bold text-purple-800 mt-2">
                {filteredChallenges[currentChallengeIndex].title}
              </CardTitle>
              <p className="text-gray-600 font-medium">{filteredChallenges[currentChallengeIndex].prompt}</p>
              <p className="text-gray-500 text-sm">{filteredChallenges[currentChallengeIndex].instructions}</p>

              <div className="mt-2 flex items-center gap-2 text-sm">
                <AlertCircle size={14} className="text-amber-500" />
                <span>Minimum {filteredChallenges[currentChallengeIndex].minWordCount} words required</span>
              </div>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Write your response here..."
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                disabled={!isActive || isCompleted}
                className="min-h-[200px] focus:border-purple-500"
              />

              <div className="mt-3 flex justify-between text-sm text-gray-500">
                <span>
                  Words: {userAnswer.trim().split(/\s+/).filter(Boolean).length} /
                  {filteredChallenges[currentChallengeIndex].minWordCount} minimum
                </span>
                <span>
                  {isActive ? "Time remaining" : isCompleted ? "Challenge completed" : "Challenge not started"}
                </span>
              </div>

              {showResults && results && (
                <div
                  className={`mt-4 p-4 rounded-md ${
                    results.isSuccessful ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-2 mb-3">
                    {results.isSuccessful ? (
                      <CheckCircle className="text-green-500 mt-0.5" size={18} />
                    ) : (
                      <XCircle className="text-red-500 mt-0.5" size={18} />
                    )}
                    <p className={results.isSuccessful ? "text-green-700" : "text-red-700"}>{results.feedback}</p>
                  </div>

                  {results.isSuccessful && (
                    <div className="bg-white p-3 rounded-md">
                      <h3 className="font-medium text-purple-800 mb-2">Rewards Earned:</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div className="flex items-center gap-2">
                          <Trophy size={16} className="text-amber-500" />
                          <span>{results.reward.xp} XP</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Award size={16} className="text-indigo-500" />
                          <span>{results.reward.points} Points</span>
                        </div>
                        {results.reward.special && (
                          <div className="flex items-center gap-2">
                            <Award size={16} className="text-purple-500" />
                            <span>
                              {results.reward.special.type === "badge"
                                ? `Badge: ${results.reward.special.value}`
                                : results.reward.special.type === "xp_multiplier"
                                  ? `${results.reward.special.value}x XP Multiplier`
                                  : `Streak Bonus: ${results.reward.special.value}`}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetChallenge}>
                {isCompleted ? "Back to Challenges" : "Cancel"}
              </Button>

              {isActive && !isCompleted && (
                <Button onClick={handleSubmit} disabled={userAnswer.trim().length === 0}>
                  Submit
                </Button>
              )}

              {isCompleted && !showResults && <Button onClick={() => setShowResults(true)}>View Results</Button>}

              {showResults && <Button onClick={resetChallenge}>Try Another Challenge</Button>}
            </CardFooter>
          </Card>
        </>
      )}
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { VerbPractice } from "@/components/verbs/verb-practice"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import type { Verb } from "@/lib/database-types"

type PracticeMode = "pastSimple" | "pastParticiple" | "mixed" | "allThree"

export default function VerbPracticePage() {
  const [verbs, setVerbs] = useState<Verb[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState<"mode" | "count" | "practice">("mode")
  const [selectedMode, setSelectedMode] = useState<PracticeMode>("mixed")
  const [practiceVerbs, setPracticeVerbs] = useState<Verb[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchVerbs()
  }, [])

  const fetchVerbs = async () => {
    try {
      const token = localStorage.getItem("lingualearn_token")
      
      // Try to get verbs that need review first
      let response = await fetch("/api/verbs?needsReview=true", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch verbs")
      }

      let data = await response.json()
      
      // If no verbs need review, get all verbs
      if (data.verbs.length === 0) {
        response = await fetch("/api/verbs", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        
        if (response.ok) {
          data = await response.json()
        }
      }
      
      setVerbs(data.verbs || [])
    } catch (error) {
      console.error("Error fetching verbs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const selectMode = (mode: PracticeMode) => {
    setSelectedMode(mode)
    setStep("count")
  }

  const startPractice = (count: number) => {
    const shuffled = [...verbs].sort(() => Math.random() - 0.5)
    setPracticeVerbs(shuffled.slice(0, count))
    setStep("practice")
  }

  const handleComplete = async (score: { correct: number; total: number }) => {
    // Award XP based on performance
    try {
      const userStr = localStorage.getItem("lingualearn_user")
      if (userStr) {
        const user = JSON.parse(userStr)
        const { updateUserStats } = await import("@/lib/database")
        
        // Calculate XP: base 5 XP per correct answer
        const xpEarned = score.correct * 5
        
        if (xpEarned > 0) {
          await updateUserStats({
            totalXp: (user.totalXp || 0) + xpEarned,
            totalPoints: (user.totalPoints || 0) + xpEarned,
          })

          // Update user in localStorage
          const updatedUser = {
            ...user,
            totalXp: (user.totalXp || 0) + xpEarned,
            totalPoints: (user.totalPoints || 0) + xpEarned,
          }
          localStorage.setItem("lingualearn_user", JSON.stringify(updatedUser))
          
          // Dispatch event to notify other components
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("userUpdated"))
          }
        }
      }
    } catch (error) {
      console.error("Error awarding XP for verb practice:", error)
    }
    
    setStep("mode")
    router.push("/verbs")
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        </div>
      </PageContainer>
    )
  }

  if (step === "practice") {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto">
          <VerbPractice verbs={practiceVerbs} onComplete={handleComplete} mode={selectedMode} />
        </div>
      </PageContainer>
    )
  }

  if (step === "count") {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto space-y-6">
          <div>
            <Button
              onClick={() => setStep("mode")}
              variant="ghost"
              className="mb-4"
            >
              ← กลับ
            </Button>
            <h1 className="text-3xl font-bold">ฝึกฝน Verbs</h1>
            <p className="text-gray-600 mt-1">เลือกจำนวนคำที่ต้องการฝึกฝน</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">
                {selectedMode === "pastSimple" && "โหมด: Past Simple (V2)"}
                {selectedMode === "pastParticiple" && "โหมด: Past Participle (V3)"}
                {selectedMode === "mixed" && "โหมด: Mixed (V2 & V3)"}
                {selectedMode === "allThree" && "โหมด: Three Forms (V1, V2, V3)"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-6">
                <p className="text-lg">
                  คุณมี <span className="font-bold text-indigo-600">{verbs.length}</span> คำ
                  ที่ควรทบทวน
                </p>
              </div>

              <div className="grid gap-3">
                <Button
                  onClick={() => startPractice(5)}
                  disabled={verbs.length < 5}
                  className="w-full h-16 text-lg bg-green-500 hover:bg-green-600"
                >
                  ฝึก 5 คำ (ระยะสั้น)
                </Button>
                <Button
                  onClick={() => startPractice(10)}
                  disabled={verbs.length < 10}
                  className="w-full h-16 text-lg bg-blue-500 hover:bg-blue-600"
                >
                  ฝึก 10 คำ (แนะนำ)
                </Button>
                <Button
                  onClick={() => startPractice(20)}
                  disabled={verbs.length < 20}
                  className="w-full h-16 text-lg bg-purple-500 hover:bg-purple-600"
                >
                  ฝึก 20 คำ (ระยะยาว)
                </Button>
                <Button
                  onClick={() => startPractice(verbs.length)}
                  disabled={verbs.length === 0}
                  className="w-full h-16 text-lg bg-red-500 hover:bg-red-600"
                >
                  ฝึกทั้งหมด ({verbs.length} คำ)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">ฝึกฝน Verbs สามช่อง</h1>
          <p className="text-gray-600 mt-1">เลือกโหมดการฝึกที่คุณต้องการ</p>
        </div>

        <div className="grid gap-4">
          <div onClick={() => selectMode("pastSimple")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-green-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 text-green-600 rounded-full p-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Past Simple (V2)</h3>
                    <p className="text-gray-600 mb-2">ฝึกแปลง Base Form เป็น Past Simple</p>
                    <p className="text-sm text-gray-500">ตัวอย่าง: go → went, eat → ate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div onClick={() => selectMode("pastParticiple")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-purple-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-100 text-purple-600 rounded-full p-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Past Participle (V3)</h3>
                    <p className="text-gray-600 mb-2">ฝึกแปลง Base Form เป็น Past Participle</p>
                    <p className="text-sm text-gray-500">ตัวอย่าง: go → gone, eat → eaten</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div onClick={() => selectMode("mixed")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-blue-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-100 text-blue-600 rounded-full p-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Mixed (V2 & V3)</h3>
                    <p className="text-gray-600 mb-2">สุ่มฝึกทั้ง Past Simple และ Past Participle</p>
                    <p className="text-sm text-gray-500">ความท้าทายระดับกลาง - แนะนำ!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div onClick={() => selectMode("allThree")} className="cursor-pointer">
            <Card className="hover:shadow-lg transition-shadow border-2 hover:border-orange-500">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="bg-orange-100 text-orange-600 rounded-full p-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">Three Forms (V1, V2, V3)</h3>
                    <p className="text-gray-600 mb-2">ฝึกครบทั้ง 3 รูปแบบ รวมถึง Base Form</p>
                    <p className="text-sm text-gray-500">ความท้าทายสูงสุด - สำหรับผู้เชี่ยวชาญ!</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Button
          onClick={() => router.push("/verbs")}
          variant="outline"
          className="w-full"
        >
          กลับไปดู Verbs
        </Button>
      </div>
    </PageContainer>
  )
}


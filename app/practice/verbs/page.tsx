"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { VerbPractice } from "@/components/verbs/verb-practice"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import type { Verb } from "@/lib/database-types"

export default function VerbPracticePage() {
  const [verbs, setVerbs] = useState<Verb[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [practiceStarted, setPracticeStarted] = useState(false)
  const [practiceVerbs, setPracticeVerbs] = useState<Verb[]>([])
  const router = useRouter()

  useEffect(() => {
    fetchVerbs()
  }, [])

  const fetchVerbs = async () => {
    try {
      const token = localStorage.getItem("lingualearn_token")
      const response = await fetch("/api/verbs?needsReview=true", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch verbs")
      }

      const data = await response.json()
      setVerbs(data.verbs)
    } catch (error) {
      console.error("Error fetching verbs:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const startPractice = (count: number) => {
    const shuffled = [...verbs].sort(() => Math.random() - 0.5)
    setPracticeVerbs(shuffled.slice(0, count))
    setPracticeStarted(true)
  }

  const handleComplete = () => {
    setPracticeStarted(false)
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

  if (practiceStarted) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto">
          <VerbPractice verbs={practiceVerbs} onComplete={handleComplete} />
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">ฝึกฝน Verbs</h1>
          <p className="text-gray-600 mt-1">เลือกจำนวนคำที่ต้องการฝึกฝน</p>
        </div>

        <Card>
          <CardContent className="p-6 space-y-4">
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

            <Button
              onClick={() => router.push("/verbs")}
              variant="outline"
              className="w-full mt-4"
            >
              กลับไปดู Verbs
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}


"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { VerbCard } from "@/components/verbs/verb-card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import type { Verb } from "@/lib/database-types"

export default function VerbsPage() {
  const [verbs, setVerbs] = useState<Verb[]>([])
  const [filteredVerbs, setFilteredVerbs] = useState<Verb[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all")
  const router = useRouter()

  useEffect(() => {
    fetchVerbs()
  }, [])

  useEffect(() => {
    filterVerbs()
  }, [verbs, categoryFilter, difficultyFilter])

  const fetchVerbs = async () => {
    try {
      const token = localStorage.getItem("lingualearn_token")
      const response = await fetch("/api/verbs", {
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

  const filterVerbs = () => {
    let filtered = [...verbs]

    if (categoryFilter !== "all") {
      filtered = filtered.filter((verb) => verb.category === categoryFilter)
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((verb) => verb.difficulty === parseInt(difficultyFilter))
    }

    setFilteredVerbs(filtered)
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

  return (
    <PageContainer>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Verbs</h1>
            <p className="text-gray-600 mt-1">เรียนรู้และฝึกฝนคำกริยา</p>
          </div>
          <Button
            onClick={() => router.push("/practice/verbs")}
            className="bg-indigo-500 hover:bg-indigo-600"
          >
            เริ่มฝึกฝน
          </Button>
        </div>

        <div className="flex gap-4">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ประเภท" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="regular">Regular</SelectItem>
              <SelectItem value="irregular">Irregular</SelectItem>
            </SelectContent>
          </Select>

          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="ระดับความยาก" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">ทั้งหมด</SelectItem>
              <SelectItem value="1">ง่าย</SelectItem>
              <SelectItem value="2">ปานกลาง</SelectItem>
              <SelectItem value="3">ยาก</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredVerbs.length > 0 ? (
            filteredVerbs.map((verb) => (
              <VerbCard key={verb.id} verb={verb} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">ไม่พบ verbs ตามเงื่อนไขที่เลือก</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}


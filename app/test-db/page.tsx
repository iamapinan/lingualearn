"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestDBPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem("lingualearn_token")
      const headers: any = { "Content-Type": "application/json" }
      if (token) headers.Authorization = `Bearer ${token}`

      const tests = await Promise.all([
        fetch("/api/languages").then(r => r.json()),
        fetch("/api/lessons?languageId=1").then(r => r.json()),
        token ? fetch("/api/lesson-completions", { headers }).then(r => r.json()) : Promise.resolve({ error: "No token" }),
        token ? fetch("/api/challenges", { headers }).then(r => r.json()) : Promise.resolve({ error: "No token" }),
        token ? fetch("/api/missions", { headers }).then(r => r.json()) : Promise.resolve({ error: "No token" }),
        token ? fetch("/api/verbs", { headers }).then(r => r.json()) : Promise.resolve({ error: "No token" }),
      ])

      setResult({
        token: token ? "มี" : "ไม่มี",
        languages: tests[0],
        lessons: tests[1],
        completions: tests[2],
        challenges: tests[3],
        missions: tests[4],
        verbs: tests[5],
      })
    } catch (error: any) {
      setResult({ error: error.message })
    }
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>ทดสอบการเชื่อมต่อฐานข้อมูล</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testConnection} disabled={loading}>
            {loading ? "กำลังทดสอบ..." : "ทดสอบเชื่อมต่อ"}
          </Button>

          {result && (
            <div className="mt-4 p-4 bg-gray-100 rounded">
              <pre className="text-xs overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, AlertCircle, Loader2 } from "lucide-react"

export default function SeedPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)

  const checkStats = async () => {
    try {
      const response = await fetch("/api/seed/verbs")
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error checking stats:", error)
    }
  }

  const seedVerbs = async () => {
    setLoading(true)
    setResult(null)
    
    try {
      const response = await fetch("/api/seed/verbs", {
        method: "POST",
      })
      const data = await response.json()
      setResult(data)
      
      // Refresh stats
      await checkStats()
    } catch (error: any) {
      setResult({
        success: false,
        error: error.message,
      })
    }
    
    setLoading(false)
  }

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">เพิ่มข้อมูล Verbs เข้าฐานข้อมูล</CardTitle>
          <CardDescription>
            กดปุ่มด้านล่างเพื่อเพิ่มคำ verbs ทั้งหมด 70+ คำเข้าสู่ฐานข้อมูล
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Check Stats Button */}
          <Button
            onClick={checkStats}
            variant="outline"
            className="w-full"
          >
            ตรวจสอบสถานะปัจจุบัน
          </Button>

          {/* Stats Display */}
          {stats && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  <p><strong>จำนวน Verbs ในระบบ:</strong> {stats.stats?.total || 0} คำ</p>
                  {stats.stats?.byCategory && (
                    <>
                      <p>• Regular: {stats.stats.byCategory.regular} คำ</p>
                      <p>• Irregular: {stats.stats.byCategory.irregular} คำ</p>
                    </>
                  )}
                  {stats.stats?.byDifficulty && (
                    <>
                      <p>• Easy: {stats.stats.byDifficulty.easy} คำ</p>
                      <p>• Medium: {stats.stats.byDifficulty.medium} คำ</p>
                      <p>• Hard: {stats.stats.byDifficulty.hard} คำ</p>
                    </>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Seed Button */}
          <Button
            onClick={seedVerbs}
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                กำลังเพิ่มข้อมูล...
              </>
            ) : (
              "เพิ่มข้อมูล Verbs"
            )}
          </Button>

          {/* Result Display */}
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              {result.success ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              <AlertDescription>
                {result.success ? (
                  <div>
                    <p className="font-semibold text-green-700">{result.message}</p>
                    <p className="text-sm mt-1">
                      เพิ่มสำเร็จ: {result.inserted} / {result.total} คำ
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="font-semibold">เกิดข้อผิดพลาด</p>
                    <p className="text-sm mt-1">{result.message || result.error}</p>
                    {result.details && (
                      <p className="text-xs mt-1 opacity-75">{result.details}</p>
                    )}
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Info */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
            <h3 className="font-semibold text-blue-900 mb-2">ข้อมูล Verbs ที่จะเพิ่ม:</h3>
            <ul className="space-y-1 text-blue-800">
              <li>• Irregular Verbs (Easy): 25 คำ</li>
              <li>• Irregular Verbs (Medium): 20 คำ</li>
              <li>• Irregular Verbs (Hard): 10 คำ</li>
              <li>• Regular Verbs (Easy): 15 คำ</li>
              <li>• Regular Verbs (Medium): 15 คำ</li>
              <li>• Regular Verbs (Hard): 10 คำ</li>
              <li className="font-semibold pt-2">รวมทั้งหมด: 95 คำ</li>
            </ul>
          </div>

          {/* Navigation */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={() => window.location.href = "/verbs"}
              variant="outline"
              className="flex-1"
            >
              ดู Verbs ทั้งหมด
            </Button>
            <Button
              onClick={() => window.location.href = "/"}
              variant="outline"
              className="flex-1"
            >
              กลับหน้าหลัก
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


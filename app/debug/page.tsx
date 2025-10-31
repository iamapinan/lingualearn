"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/components/auth-provider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function DebugPage() {
  const { user, token } = useAuth()
  const [apiTests, setApiTests] = useState<any>({})
  const [testing, setTesting] = useState(false)

  const testAPI = async (endpoint: string, requiresAuth = false) => {
    try {
      const headers = requiresAuth && token ? { Authorization: `Bearer ${token}` } : {}
      const response = await fetch(endpoint, { headers })
      const data = await response.json()
      return {
        status: response.status,
        ok: response.ok,
        data,
      }
    } catch (error: any) {
      return {
        status: "error",
        ok: false,
        error: error.message,
      }
    }
  }

  const runTests = async () => {
    setTesting(true)
    const results: any = {}

    // Test public APIs
    results.languages = await testAPI("/api/languages")
    results.lessons = await testAPI("/api/lessons?languageId=1")
    results.verbs = await testAPI("/api/verbs")

    // Test auth APIs
    if (token) {
      results.me = await testAPI("/api/auth/me", true)
      results.challenges = await testAPI("/api/challenges", true)
      results.missions = await testAPI("/api/missions", true)
      results.completions = await testAPI("/api/lesson-completions", true)
    }

    setApiTests(results)
    setTesting(false)
  }

  useEffect(() => {
    runTests()
  }, [token])

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Debug Information</h1>

      <div className="grid gap-6">
        {/* Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>User:</strong> {user ? JSON.stringify(user, null, 2) : "Not logged in"}
              </p>
              <p>
                <strong>Token:</strong> {token ? `${token.substring(0, 20)}...` : "No token"}
              </p>
              <p>
                <strong>LocalStorage Token:</strong>{" "}
                {typeof window !== "undefined"
                  ? localStorage.getItem("token")
                    ? `${localStorage.getItem("token")?.substring(0, 20)}...`
                    : "No token"
                  : "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* API Tests */}
        <Card>
          <CardHeader>
            <CardTitle>API Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={runTests} disabled={testing} className="mb-4">
              {testing ? "Testing..." : "Run Tests"}
            </Button>

            <div className="space-y-4">
              {Object.entries(apiTests).map(([endpoint, result]: any) => (
                <div key={endpoint} className="border p-4 rounded">
                  <h3 className="font-bold mb-2">
                    {endpoint} - {result.ok ? "✅ OK" : "❌ FAIL"}
                  </h3>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-40">
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Browser Info */}
        <Card>
          <CardHeader>
            <CardTitle>Browser Console</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              เปิด Browser Console (F12 หรือ Cmd+Option+I) เพื่อดู errors เพิ่มเติม
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


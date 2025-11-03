"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen } from "lucide-react"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"
import { useAuth } from "@/components/auth-provider"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login")
  const router = useRouter()
  const { user, login } = useAuth()

  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const handleAuthSuccess = (userData: any, token: string) => {
    login(userData, token)
    router.push("/")
  }

  if (user) {
    return null
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div>
              <img src="/logo.svg" alt="LinguaLearn" width={96} height={96} />
            </div>
          </div>
          <CardTitle className="text-2xl">ยินดีต้อนรับสู่ LinguaLearn</CardTitle>
          <CardDescription>
            เรียนรู้ภาษาใหม่ได้อย่างสนุกสนาน
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "login" | "register")}>
            {/* <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">เข้าสู่ระบบ</TabsTrigger>
            </TabsList> */}
            
            <TabsContent value="login">
              <LoginForm
                onSuccess={handleAuthSuccess}
                onSwitchToRegister={() => setActiveTab("login")}
              />
            </TabsContent>
            
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

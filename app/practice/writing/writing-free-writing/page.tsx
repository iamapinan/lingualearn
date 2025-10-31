"use client"

import { useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Lightbulb, Check } from "lucide-react"

const prompts = [
  {
    id: 1,
    topic: "My Daily Routine",
    prompt: "Write about your typical day. What time do you wake up? What do you do in the morning, afternoon, and evening?",
    minWords: 50,
  },
  {
    id: 2,
    topic: "My Favorite Place",
    prompt: "Describe your favorite place. Where is it? Why do you like it? What do you do there?",
    minWords: 50,
  },
  {
    id: 3,
    topic: "My Dream",
    prompt: "Write about your dream for the future. What do you want to be? What do you want to do?",
    minWords: 50,
  },
]

export default function WritingFreeWritingPage() {
  const [currentPrompt, setCurrentPrompt] = useState(0)
  const [userText, setUserText] = useState("")
  const [submitted, setSubmitted] = useState(false)
  const [completed, setCompleted] = useState(false)

  const prompt = prompts[currentPrompt]
  const wordCount = userText.trim() ? userText.trim().split(/\s+/).length : 0
  const isMinimumMet = wordCount >= prompt.minWords

  const handleSubmit = () => {
    if (!isMinimumMet) return
    setSubmitted(true)
  }

  const nextPrompt = () => {
    if (currentPrompt < prompts.length - 1) {
      setCurrentPrompt(currentPrompt + 1)
      setUserText("")
      setSubmitted(false)
    } else {
      setCompleted(true)
    }
  }

  if (completed) {
    return (
      <PageContainer>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">เยี่ยมมาก!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl">🎉</div>
              <p className="text-xl">
                คุณเขียนครบทุกหัวข้อแล้ว!
              </p>
              <p className="text-gray-600">
                การฝึกเขียนเป็นประจำจะช่วยพัฒนาทักษะการใช้ภาษาของคุณ
              </p>
              <div className="space-x-4">
                <Button onClick={() => window.location.reload()}>
                  เขียนอีกครั้ง
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/practice/writing"}>
                  กลับไปหน้า Writing
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
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Free Writing</h1>
          <p className="text-gray-600 mt-1">เขียนเรื่องตามหัวข้อที่กำหนด</p>
        </div>

        <div className="flex gap-2 justify-center">
          {prompts.map((p, index) => (
            <Badge
              key={p.id}
              variant={index === currentPrompt ? "default" : "outline"}
              className={index < currentPrompt ? "bg-green-500" : ""}
            >
              {index < currentPrompt ? <Check className="h-3 w-3 mr-1" /> : null}
              Topic {index + 1}
            </Badge>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{prompt.topic}</span>
              <Badge variant="secondary">{wordCount} / {prompt.minWords} words</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-semibold text-purple-900 mb-2">Writing Prompt:</p>
                  <p className="text-gray-700">{prompt.prompt}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    เขียนอย่างน้อย {prompt.minWords} คำ
                  </p>
                </div>
              </div>
            </div>

            {!submitted ? (
              <div className="space-y-3">
                <Textarea
                  value={userText}
                  onChange={(e) => setUserText(e.target.value)}
                  placeholder="Start writing here..."
                  className="min-h-[300px] text-base"
                  autoFocus
                />
                
                <div className="flex items-center justify-between">
                  <p className={`text-sm ${
                    isMinimumMet ? "text-green-600" : "text-gray-500"
                  }`}>
                    {isMinimumMet ? "✓ เขียนครบจำนวนคำแล้ว" : `เขียนอีก ${prompt.minWords - wordCount} คำ`}
                  </p>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isMinimumMet}
                  >
                    ส่งงานเขียน
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                  <p className="text-green-800 font-semibold mb-4">เยี่ยมมาก! คุณเขียนได้ดีมาก</p>
                  <div className="p-4 bg-white rounded border">
                    <p className="text-gray-800 whitespace-pre-wrap">{userText}</p>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 mb-2">💡 Tips for improvement:</p>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                    <li>ตรวจสอบการสะกดคำและไวยากรณ์</li>
                    <li>ใช้คำเชื่อมประโยคให้หลากหลาย</li>
                    <li>อ่านออกเสียงเพื่อตรวจสอบความลื่นไหล</li>
                  </ul>
                </div>

                <Button onClick={nextPrompt} className="w-full">
                  {currentPrompt < prompts.length - 1 ? "หัวข้อถัดไป" : "เสร็จสิ้น"}
                </Button>
              </div>
            )}

            <div className="text-center text-sm text-gray-500">
              หัวข้อที่ {currentPrompt + 1} / {prompts.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}


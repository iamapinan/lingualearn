"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, FileText, RefreshCw, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

interface Topic {
  id: number
  title: string
  description: string
  minWords: number
  prompts: string[]
}

const topics: Topic[] = [
  {
    id: 1,
    title: "แนะนำตัวเอง",
    description: "เขียนบทความแนะนำตัวเองให้เพื่อนใหม่รู้จัก",
    minWords: 50,
    prompts: [
      "What's your name and where are you from?",
      "What are your hobbies and interests?",
      "What do you do for a living or study?",
      "What makes you unique?"
    ]
  },
  {
    id: 2,
    title: "วันหยุดที่น่าจดจำ",
    description: "เล่าเรื่องวันหยุดที่คุณชอบที่สุด",
    minWords: 60,
    prompts: [
      "Where did you go?",
      "Who did you go with?",
      "What did you do there?",
      "Why was it memorable?"
    ]
  },
  {
    id: 3,
    title: "อาหารโปรด",
    description: "บรรยายเกี่ยวกับอาหารที่คุณชอบที่สุด",
    minWords: 50,
    prompts: [
      "What is your favorite food?",
      "How does it taste?",
      "When did you first try it?",
      "Why do you like it?"
    ]
  },
  {
    id: 4,
    title: "ความฝันในอนาคต",
    description: "เขียนเกี่ยวกับสิ่งที่คุณอยากทำในอนาคต",
    minWords: 60,
    prompts: [
      "What is your dream?",
      "Why is this important to you?",
      "What are you doing to achieve it?",
      "When do you hope to accomplish it?"
    ]
  },
  {
    id: 5,
    title: "เพื่อนสนิท",
    description: "อธิบายเกี่ยวกับเพื่อนสนิทของคุณ",
    minWords: 50,
    prompts: [
      "Who is your best friend?",
      "How did you meet?",
      "What do you like to do together?",
      "Why are they special to you?"
    ]
  }
]

export default function FreeWritingPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null)
  const [userText, setUserText] = useState("")
  const [completed, setCompleted] = useState(false)
  const [wordCount, setWordCount] = useState(0)

  const handleTextChange = (text: string) => {
    setUserText(text)
    const words = text.trim().split(/\s+/).filter(word => word.length > 0)
    setWordCount(words.length)
  }

  const handleSubmit = () => {
    if (wordCount >= (selectedTopic?.minWords || 0)) {
      setCompleted(true)
    }
  }

  const resetTopic = () => {
    setUserText("")
    setWordCount(0)
    setCompleted(false)
  }

  const changeTopic = () => {
    setSelectedTopic(null)
    setUserText("")
    setWordCount(0)
    setCompleted(false)
  }

  if (!selectedTopic) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-4">
        <div className="mx-auto max-w-4xl pt-8">
          <div className="mb-6">
            <Link href="/practice/writing">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                กลับ
              </Button>
            </Link>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">เลือกหัวข้อที่ต้องการเขียน</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {topics.map((topic) => (
                  <motion.div
                    key={topic.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card
                      className="cursor-pointer border-2 hover:border-green-300 hover:shadow-lg transition-all"
                      onClick={() => setSelectedTopic(topic)}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-green-600" />
                          {topic.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 mb-3">
                          {topic.description}
                        </p>
                        <Badge variant="outline">
                          ขั้นต่ำ {topic.minWords} คำ
                        </Badge>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-4">
        <div className="mx-auto max-w-2xl pt-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="border-2 border-green-200 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
                <CardTitle className="text-center text-2xl">
                  🎉 เสร็จสิ้นการเขียน!
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <div className="text-xl font-semibold text-gray-800 mb-2">
                    ยินดีด้วย! คุณเขียนครบแล้ว
                  </div>
                  <div className="text-gray-600">
                    จำนวนคำทั้งหมด: <span className="font-bold text-green-600">{wordCount}</span> คำ
                  </div>
                </div>

                <div className="mb-6 p-6 bg-gray-50 rounded-lg border">
                  <div className="font-medium text-gray-700 mb-2">
                    งานเขียนของคุณ:
                  </div>
                  <div className="text-gray-800 whitespace-pre-wrap">
                    {userText}
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    onClick={resetTopic}
                    variant="outline"
                    size="lg"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    เขียนใหม่
                  </Button>
                  <Button
                    onClick={changeTopic}
                    size="lg"
                    className="bg-gradient-to-r from-green-500 to-teal-500"
                  >
                    เลือกหัวข้อใหม่
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-blue-50 p-4">
      <div className="mx-auto max-w-4xl pt-8">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={changeTopic}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            เปลี่ยนหัวข้อ
          </Button>
          <div className="text-right">
            <div className="text-sm text-gray-600">จำนวนคำ</div>
            <div className={`text-2xl font-bold ${
              wordCount >= selectedTopic.minWords ? "text-green-600" : "text-orange-600"
            }`}>
              {wordCount} / {selectedTopic.minWords}
            </div>
          </div>
        </div>

        <Card className="mb-6 border-2 border-green-200">
          <CardHeader className="bg-gradient-to-r from-green-100 to-teal-100">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-green-600" />
              {selectedTopic.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-2">
              {selectedTopic.description}
            </p>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-4">
              <div className="font-medium text-gray-700 mb-3">
                คำถามช่วยคิด:
              </div>
              <ul className="space-y-2">
                {selectedTopic.prompts.map((prompt, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-600">
                    <span className="text-green-600 font-semibold">{index + 1}.</span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 shadow-lg">
          <CardHeader>
            <CardTitle>เขียนงานของคุณที่นี่</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={userText}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="เริ่มเขียนที่นี่..."
              className="min-h-[400px] text-base leading-relaxed"
            />
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                {wordCount < selectedTopic.minWords ? (
                  <span className="text-orange-600">
                    ต้องการอีก {selectedTopic.minWords - wordCount} คำ
                  </span>
                ) : (
                  <span className="text-green-600">
                    ✓ ครบตามเกณฑ์แล้ว
                  </span>
                )}
              </div>
              
              <Button
                onClick={handleSubmit}
                disabled={wordCount < selectedTopic.minWords}
                size="lg"
                className="bg-gradient-to-r from-green-500 to-teal-500"
              >
                ส่งงาน
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Volume2, Check, X } from "lucide-react"

const conversations = [
  {
    id: 1,
    dialogue: [
      { speaker: "A", text: "Hello! How are you today?" },
      { speaker: "B", text: "I'm fine, thank you. And you?" },
      { speaker: "A", text: "I'm great! What are you doing this weekend?" },
      { speaker: "B", text: "I'm going to the park with my family." },
    ],
    question: "What is B going to do this weekend?",
    options: [
      "Go to the park with family",
      "Stay at home",
      "Visit friends",
      "Go shopping",
    ],
    correct: "Go to the park with family",
  },
  {
    id: 2,
    dialogue: [
      { speaker: "A", text: "Excuse me, where is the library?" },
      { speaker: "B", text: "Go straight and turn left. It's next to the bank." },
      { speaker: "A", text: "Thank you very much!" },
    ],
    question: "Where is the library?",
    options: [
      "Next to the bank",
      "Across from the bank",
      "Behind the bank",
      "In front of the bank",
    ],
    correct: "Next to the bank",
  },
]

export default function ListeningConversationsPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)

  const conversation = conversations[currentExercise]
  const progress = ((currentExercise + 1) / conversations.length) * 100

  const playConversation = async () => {
    setIsPlaying(true)
    
    for (const line of conversation.dialogue) {
      const utterance = new SpeechSynthesisUtterance(line.text)
      utterance.lang = "en-US"
      utterance.rate = 0.8
      
      await new Promise((resolve) => {
        utterance.onend = resolve
        window.speechSynthesis.speak(utterance)
      })
      
      await new Promise(resolve => setTimeout(resolve, 500))
    }
    
    setIsPlaying(false)
  }

  const checkAnswer = () => {
    if (!selectedAnswer) return
    
    const isCorrect = selectedAnswer === conversation.correct
    if (isCorrect) {
      setScore(score + 1)
    }
    setShowResult(true)
  }

  const nextExercise = () => {
    if (currentExercise < conversations.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setSelectedAnswer(null)
      setShowResult(false)
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
              <CardTitle className="text-center">เสร็จสิ้น!</CardTitle>
            </CardHeader>
            <CardContent className="text-center space-y-4">
              <div className="text-6xl font-bold text-indigo-600">
                {score}/{conversations.length}
              </div>
              <p className="text-xl">
                คะแนนของคุณ: {Math.round((score / conversations.length) * 100)}%
              </p>
              <div className="space-x-4">
                <Button onClick={() => window.location.reload()}>
                  ฝึกอีกครั้ง
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/practice/listening"}>
                  กลับไปหน้า Listening
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
          <h1 className="text-3xl font-bold">Conversation Practice</h1>
          <p className="text-gray-600 mt-1">ฟังบทสนทนาและตอบคำถาม</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{currentExercise + 1} / {conversations.length}</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Conversation {currentExercise + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <Button
                size="lg"
                onClick={playConversation}
                disabled={isPlaying}
                className="bg-indigo-500 hover:bg-indigo-600 h-32 w-32 rounded-full"
              >
                <Volume2 className="h-12 w-12" />
              </Button>
            </div>

            <div className="text-center text-gray-600">
              <p>{isPlaying ? "กำลังเล่นบทสนทนา..." : "คลิกปุ่มเพื่อฟังบทสนทนา"}</p>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg space-y-2">
              <p className="font-semibold text-gray-700">บทสนทนา:</p>
              {conversation.dialogue.map((line, index) => (
                <div key={index} className="flex gap-2">
                  <span className="font-semibold text-indigo-600">{line.speaker}:</span>
                  <span className="text-gray-700">{line.text}</span>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <p className="font-semibold">{conversation.question}</p>
              
              {conversation.options.map((option) => (
                <button
                  key={option}
                  onClick={() => !showResult && setSelectedAnswer(option)}
                  disabled={showResult}
                  className={`w-full p-4 text-left border rounded-lg transition-all ${
                    selectedAnswer === option
                      ? "border-indigo-500 bg-indigo-50"
                      : "border-gray-200 hover:border-indigo-300"
                  } ${
                    showResult && option === conversation.correct
                      ? "border-green-500 bg-green-50"
                      : showResult && selectedAnswer === option && option !== conversation.correct
                      ? "border-red-500 bg-red-50"
                      : ""
                  } disabled:cursor-not-allowed`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showResult && option === conversation.correct && (
                      <Check className="h-5 w-5 text-green-600" />
                    )}
                    {showResult && selectedAnswer === option && option !== conversation.correct && (
                      <X className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showResult ? (
              <div className="space-y-3">
                {selectedAnswer === conversation.correct ? (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    ✓ ถูกต้อง!
                  </div>
                ) : (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                    ✗ ไม่ถูกต้อง คำตอบที่ถูกคือ: {conversation.correct}
                  </div>
                )}
                <Button onClick={nextExercise} className="w-full">
                  {currentExercise < conversations.length - 1 ? "ข้อถัดไป" : "เสร็จสิ้น"}
                </Button>
              </div>
            ) : (
              <Button
                onClick={checkAnswer}
                disabled={!selectedAnswer}
                className="w-full"
              >
                ตรวจคำตอบ
              </Button>
            )}

            <div className="text-center text-sm text-gray-500">
              คะแนน: {score} / {currentExercise + (showResult ? 1 : 0)}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}


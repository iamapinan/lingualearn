"use client"

import { useState, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Mic, Volume2 } from "lucide-react"

const exercises = [
  {
    id: 1,
    sentence: "I am learning English",
    translation: "ฉันกำลังเรียนภาษาอังกฤษ",
  },
  {
    id: 2,
    sentence: "What time is it?",
    translation: "ตอนนี้กี่โมง?",
  },
  {
    id: 3,
    sentence: "Can you help me please?",
    translation: "ช่วยฉันหน่อยได้ไหม?",
  },
  {
    id: 4,
    sentence: "I don't understand",
    translation: "ฉันไม่เข้าใจ",
  },
  {
    id: 5,
    sentence: "Could you repeat that?",
    translation: "คุณช่วยพูดอีกครั้งได้ไหม?",
  },
]

export default function SpeakingSentencesPage() {
  const [currentExercise, setCurrentExercise] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [shuffledExercises, setShuffledExercises] = useState(exercises)

  useEffect(() => {
    const shuffled = [...exercises].sort(() => Math.random() - 0.5)
    setShuffledExercises(shuffled)
  }, [])

  const exercise = shuffledExercises[currentExercise]
  const progress = ((currentExercise + 1) / shuffledExercises.length) * 100

  const playExample = () => {
    const utterance = new SpeechSynthesisUtterance(exercise.sentence)
    utterance.lang = "en-US"
    utterance.rate = 0.7
    window.speechSynthesis.speak(utterance)
  }

  const startRecording = () => {
    setIsRecording(true)
    
    setTimeout(() => {
      setIsRecording(false)
      setHasRecorded(true)
      setScore(score + 1)
    }, 3000)
  }

  const nextExercise = () => {
    if (currentExercise < shuffledExercises.length - 1) {
      setCurrentExercise(currentExercise + 1)
      setHasRecorded(false)
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
              <div className="text-6xl font-bold text-green-600">
                {score}/{shuffledExercises.length}
              </div>
              <p className="text-xl">
                คุณฝึกพูดประโยคครบทั้งหมดแล้ว!
              </p>
              <div className="space-x-4">
                <Button onClick={() => window.location.reload()}>
                  ฝึกอีกครั้ง
                </Button>
                <Button variant="outline" onClick={() => window.location.href = "/practice/speaking"}>
                  กลับไปหน้า Speaking
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
          <h1 className="text-3xl font-bold">Sentence Practice</h1>
          <p className="text-gray-600 mt-1">ฝึกพูดประโยคเต็ม</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{currentExercise + 1} / {shuffledExercises.length}</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Exercise {currentExercise + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center space-y-4">
              <div className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <p className="text-2xl font-bold text-green-700 mb-3">{exercise.sentence}</p>
                <p className="text-gray-600">{exercise.translation}</p>
              </div>

              <Button
                onClick={playExample}
                variant="outline"
                className="gap-2"
              >
                <Volume2 className="h-5 w-5" />
                ฟังตัวอย่าง
              </Button>
            </div>

            <div className="border-t pt-6">
              <p className="text-center text-gray-600 mb-4">
                กดปุ่มไมโครโฟนและพูดประโยคนี้
              </p>
              
              <div className="flex justify-center">
                {!hasRecorded ? (
                  <Button
                    size="lg"
                    onClick={startRecording}
                    disabled={isRecording}
                    className={`h-32 w-32 rounded-full ${
                      isRecording
                        ? "bg-red-500 hover:bg-red-600 animate-pulse"
                        : "bg-green-500 hover:bg-green-600"
                    }`}
                  >
                    <Mic className="h-12 w-12" />
                  </Button>
                ) : (
                  <div className="text-center space-y-4 w-full">
                    <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
                      <p className="text-green-700 font-semibold">เยี่ยมมาก! คุณพูดได้คล่องแล้ว</p>
                    </div>
                    <Button onClick={nextExercise} className="w-full">
                      {currentExercise < shuffledExercises.length - 1 ? "ข้อถัดไป" : "เสร็จสิ้น"}
                    </Button>
                  </div>
                )}
              </div>

              {isRecording && (
                <p className="text-center text-red-600 mt-4 animate-pulse">
                  กำลังบันทึก...
                </p>
              )}
            </div>

            <div className="text-center text-sm text-gray-500">
              ประโยคที่ฝึกแล้ว: {score} / {shuffledExercises.length}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}


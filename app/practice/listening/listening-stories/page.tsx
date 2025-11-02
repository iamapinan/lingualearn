"use client"

import { useState, useRef, useEffect } from "react"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Volume2, Check, X, Square } from "lucide-react"

const stories = [
  {
    id: 1,
    title: "The Lost Dog",
    story: "Once upon a time, there was a little dog named Max. Max loved to play in the park. One day, Max got lost. His owner was very worried. She looked everywhere for Max. Finally, she found Max near the big oak tree. Max was happy to see his owner again.",
    questions: [
      {
        question: "What was the dog's name?",
        options: ["Max", "Tom", "Jack", "Buddy"],
        correct: "Max",
      },
      {
        question: "Where did they find the dog?",
        options: ["Near the big oak tree", "At the park entrance", "In the playground", "By the pond"],
        correct: "Near the big oak tree",
      },
    ],
  },
  {
    id: 2,
    title: "The Magic Garden",
    story: "Emma discovered a beautiful garden behind her house. The flowers were red, yellow, and blue. Every morning, Emma would water the flowers. The flowers grew bigger and more beautiful each day. Emma felt proud of her garden. Her neighbors loved to see the colorful flowers.",
    questions: [
      {
        question: "What color were the flowers?",
        options: ["Red, yellow, and blue", "Green and purple", "Only red", "Black and white"],
        correct: "Red, yellow, and blue",
      },
      {
        question: "When did Emma water the flowers?",
        options: ["Every morning", "Every evening", "Once a week", "Never"],
        correct: "Every morning",
      },
    ],
  },
  {
    id: 3,
    title: "The Brave Firefighter",
    story: "John was a firefighter. One day, there was a fire in a tall building. John rushed to help. He carried a woman down the stairs. The woman was safe. Everyone was grateful to John for his bravery. John felt proud to help others.",
    questions: [
      {
        question: "What was John's job?",
        options: ["Firefighter", "Teacher", "Doctor", "Police officer"],
        correct: "Firefighter",
      },
      {
        question: "What did John carry?",
        options: ["A woman down the stairs", "A ladder", "A hose", "A fire extinguisher"],
        correct: "A woman down the stairs",
      },
    ],
  },
  {
    id: 4,
    title: "The Library Adventure",
    story: "Sarah loved reading books. Every Saturday, she visited the local library. She borrowed three new books each week. The librarian was always helpful and friendly. Sarah enjoyed learning about different places and people through stories.",
    questions: [
      {
        question: "How many books did Sarah borrow each week?",
        options: ["One book", "Two books", "Three books", "Four books"],
        correct: "Three books",
      },
      {
        question: "When did Sarah visit the library?",
        options: ["Every Saturday", "Every Sunday", "Every Monday", "Every Friday"],
        correct: "Every Saturday",
      },
    ],
  },
  {
    id: 5,
    title: "The Birthday Party",
    story: "Tommy turned ten years old. His family threw a big birthday party. There were balloons, cake, and presents. All his friends came to celebrate. Tommy blew out the candles and made a wish. It was the best birthday ever.",
    questions: [
      {
        question: "How old did Tommy turn?",
        options: ["Eight years old", "Nine years old", "Ten years old", "Eleven years old"],
        correct: "Ten years old",
      },
      {
        question: "What did Tommy blow out?",
        options: ["Balloons", "Candles", "Presents", "Cake"],
        correct: "Candles",
      },
    ],
  },
  {
    id: 6,
    title: "The Friendly Neighbor",
    story: "Mrs. Johnson lived next door. She was very kind and helpful. She baked cookies every Sunday. She shared them with the children on the street. Everyone loved visiting Mrs. Johnson. She always had good stories to tell.",
    questions: [
      {
        question: "What did Mrs. Johnson bake every Sunday?",
        options: ["Bread", "Cookies", "Cake", "Pie"],
        correct: "Cookies",
      },
      {
        question: "Who did she share the cookies with?",
        options: ["Only her family", "The children on the street", "Her work colleagues", "Nobody"],
        correct: "The children on the street",
      },
    ],
  },
  {
    id: 7,
    title: "The Rainy Day",
    story: "It was raining heavily outside. Emma decided to stay indoors. She read a book and drank hot chocolate. Her cat curled up on her lap. The sound of rain was peaceful. Emma enjoyed her cozy afternoon at home.",
    questions: [
      {
        question: "What was the weather like?",
        options: ["Sunny", "Rainy", "Snowy", "Windy"],
        correct: "Rainy",
      },
      {
        question: "What did Emma drink?",
        options: ["Coffee", "Tea", "Hot chocolate", "Water"],
        correct: "Hot chocolate",
      },
    ],
  },
]

export default function ListeningStoriesPage() {
  const [currentStory, setCurrentStory] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPlayed, setHasPlayed] = useState(false)
  const isPlayingRef = useRef(false)
  const [shuffledStories, setShuffledStories] = useState(stories)

  useEffect(() => {
    const shuffled = [...stories].sort(() => Math.random() - 0.5)
    setShuffledStories(shuffled)
  }, [])

  const story = shuffledStories[currentStory]
  const question = story.questions[currentQuestion]
  const totalQuestions = shuffledStories.reduce((sum, s) => sum + s.questions.length, 0)
  const currentQuestionNumber = shuffledStories
    .slice(0, currentStory)
    .reduce((sum, s) => sum + s.questions.length, 0) + currentQuestion + 1
  const progress = (currentQuestionNumber / totalQuestions) * 100

  const stopStory = () => {
    window.speechSynthesis.cancel()
    isPlayingRef.current = false
    setIsPlaying(false)
  }

  const playStory = async () => {
    isPlayingRef.current = true
    setIsPlaying(true)
    
    const sentences = story.story.split(/[.!?]+/).filter(s => s.trim().length > 0)
    
    for (const sentence of sentences) {
      if (!isPlayingRef.current) break
      
      const utterance = new SpeechSynthesisUtterance(sentence.trim() + ".")
      utterance.lang = "en-US"
      utterance.rate = 0.7
      
      await new Promise((resolve) => {
        utterance.onend = resolve
        window.speechSynthesis.speak(utterance)
      })
      
      await new Promise(resolve => setTimeout(resolve, 800))
    }
    
    isPlayingRef.current = false
    setIsPlaying(false)
    setHasPlayed(true)
  }

  const checkAnswer = () => {
    if (!selectedAnswer) return
    
    const isCorrect = selectedAnswer === question.correct
    if (isCorrect) {
      setScore(score + 1)
    }
    setShowResult(true)
  }

  const nextQuestion = () => {
    stopStory()
    
    if (currentQuestion < story.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setHasPlayed(false)
    } else {
      if (currentStory < shuffledStories.length - 1) {
        setCurrentStory(currentStory + 1)
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowResult(false)
        setHasPlayed(false)
      } else {
        setCompleted(true)
      }
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
                {score}/{totalQuestions}
              </div>
              <p className="text-xl">
                คะแนนของคุณ: {Math.round((score / totalQuestions) * 100)}%
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
          <h1 className="text-3xl font-bold">Audio Stories</h1>
          <p className="text-gray-600 mt-1">ฟังเรื่องสั้นและตอบคำถาม</p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progress</span>
            <span>{currentQuestionNumber} / {totalQuestions}</span>
          </div>
          <Progress value={progress} />
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Story: {story.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center gap-4">
              {!hasPlayed && (
                <Button
                  size="lg"
                  onClick={playStory}
                  disabled={isPlaying}
                  className="bg-indigo-500 hover:bg-indigo-600 h-32 w-32 rounded-full"
                >
                  <Volume2 className="h-12 w-12" />
                </Button>
              )}
              {isPlaying && (
                <Button
                  size="lg"
                  onClick={stopStory}
                  className="bg-red-500 hover:bg-red-600 h-32 w-32 rounded-full"
                >
                  <Square className="h-12 w-12" />
                </Button>
              )}
            </div>

            <div className="text-center text-gray-600">
              <p>{isPlaying ? "กำลังเล่นเรื่อง..." : hasPlayed ? "เรื่องจบแล้ว" : "คลิกปุ่มเพื่อฟังเรื่อง"}</p>
            </div>

            {hasPlayed && (
              <>
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <p className="font-semibold text-gray-700">เรื่องราว:</p>
                  <p className="text-gray-700 leading-relaxed">{story.story}</p>
                </div>

                <div className="space-y-3">
                  <p className="font-semibold">Question {currentQuestion + 1}: {question.question}</p>
                  
                  {question.options.map((option) => (
                    <button
                      key={option}
                      onClick={() => !showResult && setSelectedAnswer(option)}
                      disabled={showResult}
                      className={`w-full p-4 text-left border rounded-lg transition-all ${
                        selectedAnswer === option
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-indigo-300"
                      } ${
                        showResult && option === question.correct
                          ? "border-green-500 bg-green-50"
                          : showResult && selectedAnswer === option && option !== question.correct
                          ? "border-red-500 bg-red-50"
                          : ""
                      } disabled:cursor-not-allowed`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{option}</span>
                        {showResult && option === question.correct && (
                          <Check className="h-5 w-5 text-green-600" />
                        )}
                        {showResult && selectedAnswer === option && option !== question.correct && (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>

                {showResult ? (
                  <div className="space-y-3">
                    {selectedAnswer === question.correct ? (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
                        ✓ ถูกต้อง!
                      </div>
                    ) : (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                        ✗ ไม่ถูกต้อง คำตอบที่ถูกคือ: {question.correct}
                      </div>
                    )}
                    <Button onClick={nextQuestion} className="w-full">
                      {currentQuestionNumber < totalQuestions ? "ข้อถัดไป" : "เสร็จสิ้น"}
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
              </>
            )}

            <div className="text-center text-sm text-gray-500">
              คะแนน: {score} / {currentQuestionNumber - (showResult ? 0 : 1)}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  )
}


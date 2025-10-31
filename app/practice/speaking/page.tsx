"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/components/auth-provider"
import {
  getUserVocabulary,
  updateUserStats,
  saveSpeakingPracticeProgress,
  getSpeakingPracticeProgress,
} from "@/lib/database"
import { playCorrectSound, playIncorrectSound } from "@/lib/audio-utils"
import { Mic, MicOff, Volume2, Check, X, ArrowRight } from "lucide-react"

export default function SpeakingPracticePage() {
  const router = useRouter()
  const { user } = useAuth()
  const { toast } = useToast()

  const [vocabulary, setVocabulary] = useState<any[]>([])
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null)
  const [score, setScore] = useState(0)
  const [progress, setProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [exerciseComplete, setExerciseComplete] = useState(false)
  const [speechRecognitionSupported, setSpeechRecognitionSupported] = useState(true)
  const [pronunciationScore, setPronunciationScore] = useState<number | null>(null)
  const [pronunciationFeedback, setPronunciationFeedback] = useState<string>("")
  const [practiceHistory, setPracticeHistory] = useState<Array<{ word: string; correct: boolean; score: number }>>([])
  const [additionalWords, setAdditionalWords] = useState<Array<{ word: string; translation: string }>>([
    { word: "opportunity", translation: "โอกาส" },
    { word: "development", translation: "การพัฒนา" },
    { word: "experience", translation: "ประสบการณ์" },
    { word: "technology", translation: "เทคโนโล���ี" },
    { word: "environment", translation: "สิ่งแวดล้อม" },
    { word: "government", translation: "รัฐบาล" },
    { word: "community", translation: "ชุมชน" },
    { word: "education", translation: "การศึกษา" },
    { word: "information", translation: "ข้อมูล" },
    { word: "relationship", translation: "ความสัมพันธ์" },
    { word: "understanding", translation: "ความเข้าใจ" },
    { word: "organization", translation: "องค์กร" },
    { word: "international", translation: "ระหว่างประเทศ" },
    { word: "communication", translation: "การสื่อส���ร" },
    { word: "responsibility", translation: "ความรับผิดชอบ" },
  ])

  const recognitionRef = useRef<any>(null)

  // Load vocabulary
  useEffect(() => {
    const loadVocabulary = async () => {
      if (!user) {
        router.push("/auth")
        return
      }

      try {
        const userVocab = await getUserVocabulary(user.id)

        // Filter to only include items with English words
        const filteredVocab = userVocab
          .filter((item) => item.languageCode === "en")
          .map((item) => ({
            id: item.id,
            word: item.word,
            translation: item.translation,
          }))

        // Combine with additional words
        const combinedVocab = [
          ...filteredVocab,
          ...additionalWords.map((item, index) => ({
            id: 10000 + index, // Use high IDs to avoid conflicts
            word: item.word,
            translation: item.translation,
          })),
        ]

        // Shuffle and take only 15 items for the exercise
        const shuffledVocab = [...combinedVocab].sort(() => Math.random() - 0.5).slice(0, 15)

        setVocabulary(shuffledVocab)
        setLoading(false)

        // Load practice history from database
        const speakingProgress = await getSpeakingPracticeProgress(user.id)
        if (speakingProgress && speakingProgress.history) {
          // Convert database history to local format
          const formattedHistory = speakingProgress.history.map((item: any) => ({
            word: item.word,
            correct: item.correct,
            score: item.score,
          }))
          setPracticeHistory(formattedHistory)
        }
      } catch (error) {
        console.error("Error loading vocabulary:", error)
        setLoading(false)
      }
    }

    loadVocabulary()

    // Check if SpeechRecognition is supported
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      if (!SpeechRecognition) {
        setSpeechRecognitionSupported(false)
        toast({
          title: "Speech Recognition Not Supported",
          description: "Your browser doesn't support speech recognition. Try using Chrome.",
          variant: "destructive",
        })
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop()
      }
    }
  }, [user, router, toast])

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && speechRecognitionSupported) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = "en-US"

        recognitionRef.current.onresult = async (event: any) => {
          const transcript = event.results[0][0].transcript.toLowerCase().trim()
          const confidence = event.results[0][0].confidence
          setTranscript(transcript)

          // Check if the spoken word matches the current word
          const currentWord = vocabulary[currentWordIndex]?.word.toLowerCase()

          // Calculate similarity score between spoken word and target word
          const similarityScore = calculateSimilarity(transcript, currentWord)
          const pronunciationScoreValue = Math.round(confidence * 100 * similarityScore)
          setPronunciationScore(pronunciationScoreValue)

          // Generate feedback based on score
          let feedback = ""
          if (pronunciationScoreValue >= 90) {
            feedback = "Excellent pronunciation!"
          } else if (pronunciationScoreValue >= 75) {
            feedback = "Good pronunciation. Keep practicing!"
          } else if (pronunciationScoreValue >= 60) {
            feedback = "Fair pronunciation. Try to enunciate more clearly."
          } else {
            feedback = "Try again. Focus on each syllable."
          }
          setPronunciationFeedback(feedback)

          // Determine if correct based on similarity and confidence
          const isCorrect = similarityScore > 0.7 && confidence > 0.6

          if (isCorrect) {
            setFeedback("correct")
            playCorrectSound()
            setScore((prev) => prev + 10)
          } else {
            setFeedback("incorrect")
            playIncorrectSound()
          }

          // Add to practice history
          const historyItem = {
            word: currentWord,
            correct: isCorrect,
            score: pronunciationScoreValue,
          }

          setPracticeHistory((prev) => {
            const newHistory = [...prev, historyItem]
            // Save to localStorage
            if (user) {
              const historyKey = `lingualearn_speaking_history_${user.id}`
              localStorage.setItem(historyKey, JSON.stringify(newHistory))

              // Save to database
              saveSpeakingPracticeProgress(user.id, currentWord, isCorrect, pronunciationScoreValue)
            }
            return newHistory
          })
        }

        recognitionRef.current.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current.onerror = (event: any) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
          toast({
            title: "Speech Recognition Error",
            description: `Error: ${event.error}. Please try again.`,
            variant: "destructive",
          })
        }
      }
    }
  }, [vocabulary, currentWordIndex, toast, speechRecognitionSupported, user])

  const startListening = () => {
    if (!recognitionRef.current || !speechRecognitionSupported) return

    setTranscript("")
    setFeedback(null)
    setIsListening(true)
    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (!recognitionRef.current || !speechRecognitionSupported) return

    recognitionRef.current.stop()
    setIsListening(false)
  }

  const speakWord = () => {
    if (vocabulary.length === 0 || !vocabulary[currentWordIndex]) return

    const utterance = new SpeechSynthesisUtterance(vocabulary[currentWordIndex].word)
    utterance.lang = "en-US"
    window.speechSynthesis.speak(utterance)
  }

  const nextWord = async () => {
    if (currentWordIndex < vocabulary.length - 1) {
      setCurrentWordIndex((prev) => prev + 1)
      setTranscript("")
      setFeedback(null)
      setProgress(((currentWordIndex + 1) / vocabulary.length) * 100)
    } else {
      // Exercise complete
      setExerciseComplete(true)

      // Update user stats - add XP based on score
      if (user) {
        const xpEarned = Math.floor(score / 2)
        await updateUserStats({
          totalXp: (user.totalXp || 0) + xpEarned,
          totalPoints: (user.totalPoints || 0) + xpEarned,
        })

        // Update user in localStorage
        const updatedUser = {
          ...user,
          totalXp: (user.totalXp || 0) + xpEarned,
          totalPoints: (user.totalPoints || 0) + xpEarned,
        }
        localStorage.setItem("lingualearn_user", JSON.stringify(updatedUser))
      }
    }
  }

  const restartExercise = () => {
    setCurrentWordIndex(0)
    setTranscript("")
    setFeedback(null)
    setScore(0)
    setProgress(0)
    setExerciseComplete(false)
    setPronunciationScore(null)
    setPronunciationFeedback("")
    setPracticeHistory([])

    // Shuffle vocabulary again
    setVocabulary((prev) => [...prev].sort(() => Math.random() - 0.5))
  }

  // Function to calculate similarity between two strings (Levenshtein distance based)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const track = Array(str2.length + 1)
      .fill(null)
      .map(() => Array(str1.length + 1).fill(null))

    for (let i = 0; i <= str1.length; i += 1) {
      track[0][i] = i
    }

    for (let j = 0; j <= str2.length; j += 1) {
      track[j][0] = j
    }

    for (let j = 1; j <= str2.length; j += 1) {
      for (let i = 1; i <= str1.length; i += 1) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1
        track[j][i] = Math.min(
          track[j][i - 1] + 1, // deletion
          track[j - 1][i] + 1, // insertion
          track[j - 1][i - 1] + indicator, // substitution
        )
      }
    }

    const distance = track[str2.length][str1.length]
    const maxLength = Math.max(str1.length, str2.length)

    // Return similarity as a value between 0 and 1
    return maxLength === 0 ? 1 : 1 - distance / maxLength
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading exercise...</p>
        </div>
      </div>
    )
  }

  if (!speechRecognitionSupported) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Speaking Practice</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <MicOff className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Speech Recognition Not Supported</h2>
              <p className="text-gray-500 mb-6">
                Your browser doesn't support speech recognition. Please try using Google Chrome or another compatible
                browser.
              </p>
              <Button onClick={() => router.push("/")}>Return to Home</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (exerciseComplete) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Speaking Practice Complete!</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h2 className="text-xl font-bold mb-2">Great Job!</h2>
              <p className="text-gray-500 mb-6">You've completed the speaking practice exercise.</p>

              <div className="bg-indigo-50 p-4 rounded-lg mb-6">
                <p className="text-lg font-bold">Your Score: {score} points</p>
                <p className="text-sm text-gray-500">XP Earned: {Math.floor(score / 2)} XP</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Your Practice History</h3>
                <div className="bg-white rounded-lg shadow-sm p-4 max-h-60 overflow-y-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b">
                        <th className="pb-2">Word</th>
                        <th className="pb-2">Result</th>
                        <th className="pb-2">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {practiceHistory.slice(-vocabulary.length).map((item, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="py-2">{item.word}</td>
                          <td className="py-2">
                            {item.correct ? (
                              <span className="text-green-500">Correct</span>
                            ) : (
                              <span className="text-red-500">Incorrect</span>
                            )}
                          </td>
                          <td className="py-2">
                            <span
                              className={`${
                                item.score >= 90
                                  ? "text-green-500"
                                  : item.score >= 75
                                    ? "text-blue-500"
                                    : item.score >= 60
                                      ? "text-yellow-500"
                                      : "text-red-500"
                              }`}
                            >
                              {item.score}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => router.push("/")}>
                  Return Home
                </Button>
                <Button onClick={restartExercise}>Practice Again</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Speaking Practice</h1>
        <p className="text-gray-500">Practice your pronunciation by speaking the English words.</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-500">Progress</span>
          <span className="text-sm text-gray-500">
            {currentWordIndex + 1}/{vocabulary.length}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center py-8">
            {vocabulary.length > 0 && (
              <>
                <div className="flex justify-center mb-4">
                  <Button variant="outline" size="icon" onClick={speakWord} className="rounded-full h-12 w-12">
                    <Volume2 className="h-6 w-6" />
                  </Button>
                </div>

                <div className="mb-6">
                  <h2 className="text-3xl font-bold mb-2">{vocabulary[currentWordIndex].word}</h2>
                  <p className="text-gray-500">{vocabulary[currentWordIndex].translation}</p>
                </div>

                <div className="mb-6">
                  {isListening ? (
                    <div className="animate-pulse">
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Mic className="h-8 w-8 text-red-500" />
                      </div>
                      <p className="text-sm text-gray-500">Listening...</p>
                    </div>
                  ) : (
                    <Button
                      size="lg"
                      onClick={startListening}
                      disabled={!!feedback}
                      className="bg-indigo-500 hover:bg-indigo-600"
                    >
                      <Mic className="h-5 w-5 mr-2" />
                      Speak Now
                    </Button>
                  )}
                </div>

                {transcript && (
                  <div className="mb-6">
                    <p className="text-lg font-medium">You said:</p>
                    <p
                      className={`text-xl ${
                        feedback === "correct" ? "text-green-500" : feedback === "incorrect" ? "text-red-500" : ""
                      }`}
                    >
                      "{transcript}"
                    </p>

                    {pronunciationScore !== null && (
                      <div className="mt-2">
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <span className="text-sm text-gray-500">Pronunciation Score:</span>
                          <span
                            className={`font-medium ${
                              pronunciationScore >= 90
                                ? "text-green-500"
                                : pronunciationScore >= 75
                                  ? "text-blue-500"
                                  : pronunciationScore >= 60
                                    ? "text-yellow-500"
                                    : "text-red-500"
                            }`}
                          >
                            {pronunciationScore}%
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{pronunciationFeedback}</p>
                      </div>
                    )}
                  </div>
                )}

                {feedback && (
                  <div className="mb-6">
                    {feedback === "correct" ? (
                      <div className="flex items-center justify-center gap-2 text-green-500">
                        <Check className="h-5 w-5" />
                        <span className="font-medium">Correct!</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2 text-red-500">
                        <X className="h-5 w-5" />
                        <span className="font-medium">Try again!</span>
                      </div>
                    )}
                  </div>
                )}

                {feedback && (
                  <Button onClick={nextWord} className="bg-indigo-500 hover:bg-indigo-600">
                    Next Word
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button variant="outline" onClick={() => router.push("/")}>
          Exit Practice
        </Button>
        <div className="flex items-center gap-2">
          <span className="font-medium">Score:</span>
          <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-bold">{score}</span>
        </div>
      </div>
    </div>
  )
}

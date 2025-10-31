"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, BookOpen, Check, X, RefreshCw, Star, VolumeIcon as VolumeUp } from "lucide-react"
import { getUserVocabulary, updateVocabularyReview } from "@/lib/database"
import { useAuth } from "@/components/auth-provider"
import { VocabularyCard } from "@/components/vocabulary-card"
import { vocabulary } from "@/lib/db/data/vocabulary-data"
import { VocabularyItem } from "@/lib/database-types"

export default function VocabularyPage() {
  const { user } = useAuth()
  // const [vocabulary, setVocabulary] = useState<VocabularyItem[]>([])
  const [loading, setLoading] = useState(true)
  const [reviewMode, setReviewMode] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showTranslation, setShowTranslation] = useState(false)
  const [reviewItems, setReviewItems] = useState<VocabularyItem[]>([])
  const [reviewComplete, setReviewComplete] = useState(false)
  const [reviewStats, setReviewStats] = useState({ correct: 0, incorrect: 0 })

  useEffect(() => {
    const loadVocabulary = async () => {
      if (!user) return

      try {
        const vocabItems = vocabulary

        // Filter to only include English vocabulary
        const englishVocab = vocabItems.filter((item) => item.languageId === 1)


        // Filter items due for review (based on nextReview date)
        const now = new Date()
        const dueForReview = englishVocab.filter((item) => new Date(item.nextReview) <= now)
        setReviewItems(dueForReview)

        setLoading(false)
      } catch (error) {
        console.error("Error loading vocabulary:", error)
        setLoading(false)
      }
    }

    loadVocabulary()
  }, [user])

  const startReview = () => {
    if (reviewItems.length === 0) return

    // Shuffle the review items
    const shuffled = [...reviewItems].sort(() => Math.random() - 0.5)
    setReviewItems(shuffled)
    setCurrentIndex(0)
    setShowTranslation(false)
    setReviewMode(true)
    setReviewComplete(false)
    setReviewStats({ correct: 0, incorrect: 0 })
  }

  const handleReviewResult = async (correct: boolean) => {
    if (!user || currentIndex >= reviewItems.length) return

    const item = reviewItems[currentIndex]

    // Update review stats
    setReviewStats((prev) => ({
      correct: prev.correct + (correct ? 1 : 0),
      incorrect: prev.incorrect + (correct ? 0 : 1),
    }))

    // Calculate new difficulty and next review date
    const newDifficulty = calculateNewDifficulty(item.difficulty, correct)
    const nextReview = calculateNextReviewDate(newDifficulty)

    // Update the item in the database
    await updateVocabularyReview(item.id, {
      difficulty: newDifficulty,
      lastReviewed: new Date().toISOString(),
      nextReview: nextReview.toISOString(),
      correctCount: item.correctCount + (correct ? 1 : 0),
      incorrectCount: item.incorrectCount + (correct ? 0 : 1),
    })

    // Move to next card or end review
    if (currentIndex < reviewItems.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setShowTranslation(false)
    } else {
      setReviewComplete(true)
    }
  }

  const calculateNewDifficulty = (currentDifficulty: number, wasCorrect: boolean): number => {
    // Difficulty ranges from 1 (easiest) to 5 (hardest)
    if (wasCorrect) {
      return Math.max(1, currentDifficulty - 0.5)
    } else {
      return Math.min(5, currentDifficulty + 1)
    }
  }

  const calculateNextReviewDate = (difficulty: number): Date => {
    const now = new Date()
    let daysToAdd = 1

    // Based on difficulty, determine when to review next
    // Easier words are reviewed less frequently
    switch (Math.round(difficulty)) {
      case 1: // Very easy
        daysToAdd = 14
        break
      case 2: // Easy
        daysToAdd = 7
        break
      case 3: // Medium
        daysToAdd = 3
        break
      case 4: // Hard
        daysToAdd = 1
        break
      case 5: // Very hard
        daysToAdd = 0.5 // 12 hours
        break
    }

    const nextDate = new Date(now)
    nextDate.setDate(nextDate.getDate() + daysToAdd)
    return nextDate
  }

  const playAudio = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = "en-US" // English
    window.speechSynthesis.speak(utterance)
  }

  if (loading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-lg">Loading vocabulary...</p>
        </div>
      </div>
    )
  }

  // if (reviewMode) {
  //   if (reviewComplete) {
  //     return (
  //       <div className="container max-w-6xl mx-auto px-4 py-8">
  //         <div className="flex items-center gap-4 mb-8">
  //           <Button variant="ghost" size="icon" onClick={() => setReviewMode(false)}>
  //             <ArrowLeft className="h-5 w-5" />
  //           </Button>
  //           <h1 className="text-2xl font-bold">Review Complete</h1>
  //         </div>

  //         <Card className="mb-8">
  //           <CardContent className="p-6 text-center">
  //             <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //               <Star className="h-10 w-10 text-indigo-500" />
  //             </div>
  //             <h2 className="text-xl font-bold mb-2">Great job!</h2>
  //             <p className="text-gray-500 mb-6">You've completed your vocabulary review</p>

  //             <div className="grid grid-cols-2 gap-4 mb-6">
  //               <div className="bg-green-50 p-4 rounded-lg">
  //                 <div className="flex items-center justify-center gap-2 mb-1">
  //                   <Check className="h-5 w-5 text-green-500" />
  //                   <p className="font-medium">Correct</p>
  //                 </div>
  //                 <p className="text-2xl font-bold text-green-600">{reviewStats.correct}</p>
  //               </div>
  //               <div className="bg-red-50 p-4 rounded-lg">
  //                 <div className="flex items-center justify-center gap-2 mb-1">
  //                   <X className="h-5 w-5 text-red-500" />
  //                   <p className="font-medium">Incorrect</p>
  //                 </div>
  //                 <p className="text-2xl font-bold text-red-600">{reviewStats.incorrect}</p>
  //               </div>
  //             </div>

  //             <div className="flex gap-4 justify-center">
  //               <Button variant="outline" onClick={() => setReviewMode(false)}>
  //                 Back to Vocabulary
  //               </Button>
  //               <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={() => startReview()}>
  //                 Review Again
  //               </Button>
  //             </div>
  //           </CardContent>
  //         </Card>
  //       </div>
  //     )
  //   }

  //   const currentItem = reviewItems[currentIndex]

  //   return (
  //     <div className="container max-w-4xl mx-auto px-4 py-8">
  //       <div className="flex items-center gap-4 mb-8">
  //         <Button variant="ghost" size="icon" onClick={() => setReviewMode(false)}>
  //           <ArrowLeft className="h-5 w-5" />
  //         </Button>
  //         <h1 className="text-2xl font-bold">Vocabulary Review</h1>
  //         <div className="ml-auto text-sm text-gray-500">
  //           {currentIndex + 1} of {reviewItems.length}
  //         </div>
  //       </div>

  //       <VocabularyCard
  //         word={currentItem.word}
  //         translation={currentItem.translation}
  //         languageEmoji={"🇬🇧"}
  //         showTranslation={showTranslation}
  //         onFlip={() => setShowTranslation(!showTranslation)}
  //         onPlayAudio={() => playAudio(currentItem.word)}
  //         isEnglishToThai={true}
  //       />

  //       <div className="mt-6 flex justify-between">
  //         {showTranslation ? (
  //           <>
  //             <Button
  //               variant="outline"
  //               className="flex-1 mr-2 border-red-200 hover:bg-red-50"
  //               onClick={() => handleReviewResult(false)}
  //             >
  //               <X className="mr-2 h-5 w-5 text-red-500" />
  //               Difficult
  //             </Button>
  //             <Button
  //               className="flex-1 ml-2 bg-indigo-500 hover:bg-indigo-600"
  //               onClick={() => handleReviewResult(true)}
  //             >
  //               <Check className="mr-2 h-5 w-5" />
  //               Easy
  //             </Button>
  //           </>
  //         ) : (
  //           <Button className="w-full bg-indigo-500 hover:bg-indigo-600" onClick={() => setShowTranslation(true)}>
  //             Show Translation
  //           </Button>
  //         )}
  //       </div>
  //     </div>
  //   )
  // }

  const dueCount = reviewItems.length

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">English-Thai Vocabulary</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-medium">Words to Review</h2>
          <p className="text-sm text-gray-500">You have {dueCount} words</p>
        </div>
        {/* <div className="flex gap-2">
          <Button className="bg-indigo-500 hover:bg-indigo-600" onClick={() => startReview()} disabled={dueCount === 0}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Start Review
          </Button>
        </div> */}
      </div>

      <Tabs defaultValue="1" className="mb-8 flex flex-col text-left items-start">
        <TabsList className="flex flex-rows mb-4 bg-gradient-to-r from-indigo-50 to-purple-200 border-2 border-purple-200 px-0.5 rounded-full">
          <TabsTrigger value="all" className="px-4 py-2 rounded-full">All Words</TabsTrigger>
          <TabsTrigger value="1" className="px-4 py-2 rounded-full">Beginner</TabsTrigger>
          <TabsTrigger value="2" className="px-4 py-2 rounded-full">Difficult</TabsTrigger>
          <TabsTrigger value="3" className="px-4 py-2 rounded-full">Mastered</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="w-full">
          {vocabulary.length === 0 ? (
            <Card>
              <CardContent className="p-6 text-center">
                <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">You haven't learned any vocabulary words yet.</p>
                <p className="text-gray-500">Complete lessons to add words to your vocabulary list.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {vocabulary.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <span>🇬🇧</span>
                            <p className="font-bold">{item.word}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span>🇹🇭</span>
                            <p className="text-gray-500">{item.translation}</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => playAudio(item.word)}>
                            <VolumeUp className="h-4 w-4" />
                          </Button>
                          <div
                            className={`ml-2 w-2 h-2 rounded-full ${
                              item.difficulty >= 4
                                ? "bg-red-500"
                                : item.difficulty >= 3
                                  ? "bg-yellow-500"
                                  : "bg-green-500"
                            }`}
                            title={`Difficulty: ${item.difficulty.toFixed(1)}`}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        <TabsContent value="1" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full">
            {/* แสดงคำศัพท์ที่ผู้ใช้มีความยากในการจำ */}
            {vocabulary
              .filter((item) => item.difficulty === 1)
              .map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow w-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>🇬🇧</span>
                          <p className="font-bold">{item.word}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🇹🇭</span>
                          <p className="text-gray-500">{item.translation}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => playAudio(item.word)}>
                        <VolumeUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="2" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* แสดงคำศัพท์ที่ผู้ใช้มีความยากในการจำ */}
            {vocabulary
              .filter((item) => item.difficulty === 2)
              .map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>🇬🇧</span>
                          <p className="font-bold">{item.word}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🇹🇭</span>
                          <p className="text-gray-500">{item.translation}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => playAudio(item.word)}>
                        <VolumeUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
        <TabsContent value="3" className="w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* แสดงคำศัพท์ที่ผู้ใช้จำได้ดี */}
            {vocabulary
              .filter((item) => item.difficulty === 3)
              .map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2">
                          <span>🇬🇧</span>
                          <p className="font-bold">{item.word}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>🇹🇭</span>
                          <p className="text-gray-500">{item.translation}</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => playAudio(item.word)}>
                        <VolumeUp className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

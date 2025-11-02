"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { VolumeIcon, Mic, BookOpen, Pencil, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function PracticePage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <PageContainer title="Practice Skills" subtitle="Improve your language skills with targeted exercises">
      <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-5 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="listening" className="flex items-center gap-2">
            <VolumeIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Listening</span>
          </TabsTrigger>
          <TabsTrigger value="speaking" className="flex items-center gap-2">
            <Mic className="h-4 w-4" />
            <span className="hidden sm:inline">Speaking</span>
          </TabsTrigger>
          <TabsTrigger value="reading" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Reading</span>
          </TabsTrigger>
          <TabsTrigger value="writing" className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            <span className="hidden sm:inline">Writing</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center mb-2">
                  <VolumeIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle className="text-xl text-indigo-700">Listening</CardTitle>
                <CardDescription>Improve your listening comprehension</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Train your ear with audio exercises, dialogues, and comprehension questions to understand spoken
                  English better.
                </p>
                <Link href="/practice/listening">
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700">
                    Start Practice
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <Mic className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-xl text-green-700">Speaking</CardTitle>
                <CardDescription>Improve your pronunciation and fluency</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Practice speaking with pronunciation exercises, conversation prompts, and real-time feedback to
                  enhance your oral skills.
                </p>
                <Link href="/practice/speaking">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Start Practice
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-amber-100 flex items-center justify-center mb-2">
                  <BookOpen className="h-6 w-6 text-amber-600" />
                </div>
                <CardTitle className="text-xl text-amber-700">Reading</CardTitle>
                <CardDescription>Improve your reading comprehension</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Enhance your reading skills with passages, articles, and comprehension questions to better understand
                  written English.
                </p>
                <Link href="/practice/reading">
                  <Button className="w-full bg-amber-600 hover:bg-amber-700">
                    Start Practice
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-indigo-100 hover:border-indigo-300 transition-all hover:shadow-md">
              <CardHeader className="pb-2">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <Pencil className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle className="text-xl text-purple-700">Writing</CardTitle>
                <CardDescription>Improve your writing skills</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <p className="text-sm text-gray-600 mb-4">
                  Develop your writing abilities with guided exercises, error correction, and creative prompts to
                  express yourself clearly.
                </p>
                <Link href="/practice/writing">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Start Practice
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Skill Type Tabs - These will show previews of the exercises */}
        <TabsContent value="listening" className="mt-0">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-indigo-800">Listening Practice Exercises</h2>
            <Link href="/practice/listening">
              <Button variant="outline" className="text-indigo-600 border-indigo-200">
                View All Exercises
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Preview cards for listening exercises */}
            <Link href="/practice/listening/listening-basics" className="block">
              <Card className="h-full border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-indigo-700">Basic Comprehension</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Listen to simple words and phrases and select the correct option.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Beginner</span>
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded">5 exercises</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/practice/listening/listening-dictation" className="block">
              <Card className="h-full border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-indigo-700">Dictation Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Listen and type what you hear to improve your spelling and listening skills.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Intermediate</span>
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded">3 exercises</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/practice/listening/listening-conversations" className="block">
              <Card className="h-full border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-indigo-700">Conversation Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Listen to dialogues and answer questions about the conversation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Intermediate</span>
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded">2 exercises</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/practice/listening/listening-stories" className="block">
              <Card className="h-full border-indigo-100 hover:border-indigo-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-indigo-700">Audio Stories</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Listen to short stories and answer comprehension questions.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Advanced</span>
                    <span className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded">3 stories</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="speaking" className="mt-0">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-green-800">Speaking Practice Exercises</h2>
            <Link href="/practice/speaking">
              <Button variant="outline" className="text-green-600 border-green-200">
                View All Exercises
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Preview cards for speaking exercises */}
            <Link href="/practice/speaking/speaking-basics" className="block">
              <Card className="h-full border-green-100 hover:border-green-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-green-700">Pronunciation Basics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Practice pronouncing common English words with feedback.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Beginner</span>
                    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">2 exercises</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/practice/speaking/speaking-sentences" className="block">
              <Card className="h-full border-green-100 hover:border-green-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-green-700">Sentence Practice</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Speak complete sentences to improve fluency and intonation.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Intermediate</span>
                    <span className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded">2 exercises</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="reading" className="mt-0">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-amber-800">Reading Practice Exercises</h2>
            <Link href="/practice/reading">
              <Button variant="outline" className="text-amber-600 border-amber-200">
                View All Exercises
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Preview cards for reading exercises */}
            <Link href="/practice/reading/reading-basics" className="block">
              <Card className="h-full border-amber-100 hover:border-amber-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-amber-700">Basic Comprehension</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Read short passages and answer simple questions.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Beginner</span>
                    <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded">2 exercises</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/practice/reading/reading-vocabulary" className="block">
              <Card className="h-full border-amber-100 hover:border-amber-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-amber-700">Vocabulary in Context</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Identify the meaning of words based on their context in sentences.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Intermediate</span>
                    <span className="bg-amber-50 text-amber-700 text-xs px-2 py-1 rounded">2 exercises</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="writing" className="mt-0">
          <div className="mb-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-purple-800">Writing Practice Exercises</h2>
            <Link href="/practice/writing">
              <Button variant="outline" className="text-purple-600 border-purple-200">
                View All Exercises
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Preview cards for writing exercises */}
            <Link href="/practice/writing/writing-sentence-completion" className="block">
              <Card className="h-full border-purple-100 hover:border-purple-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-purple-700">Sentence Completion</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Practice completing sentences with appropriate words and phrases.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Beginner</span>
                    <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">2 exercises</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/practice/writing/writing-error-correction" className="block">
              <Card className="h-full border-purple-100 hover:border-purple-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-purple-700">Error Correction</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">Find and fix grammatical errors in sentences.</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Intermediate</span>
                    <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">2 exercises</span>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link href="/practice/writing/writing-free-writing" className="block">
              <Card className="h-full border-purple-100 hover:border-purple-300 hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-bold text-purple-700">Free Writing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-3">
                    Express your thoughts on various topics with guided prompts.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">All Levels</span>
                    <span className="bg-purple-50 text-purple-700 text-xs px-2 py-1 rounded">2 exercises</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </PageContainer>
  )
}

"use client"

import { PageContainer } from "@/components/page-container"
import { BackButton } from "@/components/back-button"
import { ExerciseCard } from "@/components/exercise-card"
import { Headphones, Ear, MessageSquare, BookText, Languages, Clock } from "lucide-react"

export default function ListeningPracticePage() {
  return (
    <PageContainer title="Listening Practice" subtitle="Improve your listening skills with these targeted exercises">
      <BackButton href="/practice" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        <ExerciseCard
          title="Basic Comprehension"
          description="Listen to simple words and phrases and select the correct option."
          href="/practice/listening/basic"
          difficulty="beginner"
          exerciseCount={10}
          tags={["Vocabulary", "Recognition"]}
          icon={<Headphones className="h-5 w-5" />}
        />
        <ExerciseCard
          title="Dictation Practice"
          description="Listen to audio and type what you hear to improve your spelling and listening skills."
          href="/practice/listening/dictation"
          difficulty="intermediate"
          exerciseCount={8}
          tags={["Spelling", "Comprehension"]}
          icon={<Ear className="h-5 w-5" />}
        />
        <ExerciseCard
          title="Conversation Practice"
          description="Listen to dialogues and answer questions about the conversation."
          href="/practice/listening/conversation"
          difficulty="intermediate"
          exerciseCount={6}
          tags={["Dialogue", "Comprehension"]}
          icon={<MessageSquare className="h-5 w-5" />}
        />
        <ExerciseCard
          title="Audio Stories"
          description="Listen to short stories and answer comprehension questions."
          href="/practice/listening/stories"
          difficulty="advanced"
          exerciseCount={5}
          tags={["Narrative", "Comprehension"]}
          icon={<BookText className="h-5 w-5" />}
        />
        <ExerciseCard
          title="Accent Training"
          description="Practice listening to different English accents from around the world."
          href="/practice/listening/accents"
          difficulty="advanced"
          exerciseCount={7}
          tags={["Accents", "Global English"]}
          icon={<Languages className="h-5 w-5" />}
        />
        <ExerciseCard
          title="Speed Listening"
          description="Challenge yourself with faster speech to improve your listening skills."
          href="/practice/listening/speed"
          difficulty="advanced"
          exerciseCount={4}
          tags={["Advanced", "Speed"]}
          icon={<Clock className="h-5 w-5" />}
        />
      </div>
    </PageContainer>
  )
}

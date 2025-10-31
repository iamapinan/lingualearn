"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PageContainer } from "@/components/page-container"
import { BackButton } from "@/components/back-button"
import { ExerciseCard } from "@/components/exercise-card"
import { allExerciseSets } from "@/lib/db/data/practice-exercises-data"
import type { ExerciseSet, SkillType } from "@/lib/practice-types"
import { useAuth } from "@/components/auth-provider"
import {
  Mic,
  BookOpen,
  Pencil,
  Headphones,
  Ear,
  MessageSquare,
  BookText,
  Languages,
  Clock,
  Music,
  Lightbulb,
  BookOpenCheck,
  FileText,
  Rocket,
  Sparkles,
  ImportIcon,
  AlertCircle,
  FileEdit,
  Mail,
  BookMarked,
  ListOrdered,
  Palette,
} from "lucide-react"

// Map of icons for different exercise types
const exerciseIcons: Record<string, React.ReactNode> = {
  "listening-basics": <Headphones className="h-5 w-5" />,
  "listening-dictation": <Ear className="h-5 w-5" />,
  "listening-conversations": <MessageSquare className="h-5 w-5" />,
  "listening-stories": <BookText className="h-5 w-5" />,
  "listening-accents": <Languages className="h-5 w-5" />,
  "listening-speed": <Clock className="h-5 w-5" />,

  "speaking-basics": <Mic className="h-5 w-5" />,
  "speaking-sentences": <MessageSquare className="h-5 w-5" />,
  "speaking-tongue-twisters": <Music className="h-5 w-5" />,
  "speaking-conversation": <MessageSquare className="h-5 w-5" />,
  "speaking-describe-images": <Palette className="h-5 w-5" />,
  "speaking-shadowing": <Sparkles className="h-5 w-5" />,

  "reading-basics": <BookOpen className="h-5 w-5" />,
  "reading-vocabulary": <BookOpenCheck className="h-5 w-5" />,
  "reading-speed": <Clock className="h-5 w-5" />,
  "reading-articles": <FileText className="h-5 w-5" />,
  "reading-cultural": <Languages className="h-5 w-5" />,
  "reading-inference": <Lightbulb className="h-5 w-5" />,

  "writing-sentence-completion": <Pencil className="h-5 w-5" />,
  "writing-translation": <ImportIcon className="h-5 w-5" />,
  "writing-error-correction": <AlertCircle className="h-5 w-5" />,
  "writing-free-writing": <FileEdit className="h-5 w-5" />,
  "writing-email": <Mail className="h-5 w-5" />,
  "writing-story": <BookMarked className="h-5 w-5" />,
  "writing-organization": <ListOrdered className="h-5 w-5" />,
  "writing-vocabulary": <Rocket className="h-5 w-5" />,
}

// Map of skill types to their display names
const skillTypeNames: Record<SkillType, string> = {
  listening: "Listening",
  speaking: "Speaking",
  reading: "Reading",
  writing: "Writing",
}

export default function SkillTypePracticePage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()

  const [exerciseSets, setExerciseSets] = useState<ExerciseSet[]>([])
  const [skillType, setSkillType] = useState<SkillType | null>(null)

  useEffect(() => {
    if (!user) {
      router.push("/auth")
      return
    }

    const type = params.skillType as SkillType
    if (!type || !allExerciseSets[type]) {
      router.push("/practice")
      return
    }

    setSkillType(type)
    setExerciseSets(allExerciseSets[type])
  }, [params, router, user])

  if (!skillType || exerciseSets.length === 0) {
    return (
      <PageContainer>
        <BackButton href="/practice" />
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">Loading exercises...</p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      title={`${skillTypeNames[skillType]} Practice`}
      subtitle={`Improve your ${skillType} skills with these targeted exercises`}
    >
      <BackButton href="/practice" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {exerciseSets.map((exerciseSet) => (
          <ExerciseCard
            key={exerciseSet.id}
            title={exerciseSet.title}
            description={exerciseSet.description}
            href={`/practice/${skillType}/${exerciseSet.id}`}
            difficulty={exerciseSet.difficulty}
            exerciseCount={exerciseSet.exercises.length}
            tags={exerciseSet.tags}
            icon={exerciseIcons[exerciseSet.id]}
          />
        ))}
      </div>
    </PageContainer>
  )
}

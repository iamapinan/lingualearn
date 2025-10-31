"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { GameCard } from "@/components/game-card"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"

export default function GamesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  const games = [
    {
      id: "memory-match",
      title: "Memory Match",
      description: "Match pairs of words to improve your vocabulary",
      image: "/memory-card-game.png",
      difficulty: "medium",
      xpReward: 25,
      category: "vocabulary",
    },
    {
      id: "word-scramble",
      title: "Word Scramble",
      description: "Unscramble the letters to form correct words",
      image: "/wscb.png",
      difficulty: "easy",
      xpReward: 20,
      category: "vocabulary",
    },
    {
      id: "speed-challenge",
      title: "Speed Challenge",
      description: "Translate words as quickly as possible",
      image: "/speed-challenge-cover.svg",
      difficulty: "hard",
      xpReward: 30,
      category: "translation",
    },
    {
      id: "hangman",
      title: "Hangman",
      description: "Guess the word before the hangman is complete",
      image: "/hangman-cover.svg",
      difficulty: "medium",
      xpReward: 25,
      category: "vocabulary",
    },
    {
      id: "word-search",
      title: "Word Search",
      description: "Find hidden words in a grid of letters",
      image: "/word-search-puzzle.png",
      difficulty: "medium",
      xpReward: 20,
      category: "vocabulary",
    },
  ]

  const handleGameClick = (gameId: string) => {
    router.push(`/games/${gameId}`)
  }

  return (
    <div className="container mx-auto p-4">
      <BackButton href="/" label="Back to Home" />
      <h1 className="text-3xl font-bold mb-6 text-center">Language Learning Games</h1>

      <div className="mb-8">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All Games</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            <TabsTrigger value="translation">Translation</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {games.map((game) => (
                <div key={game.id} onClick={() => handleGameClick(game.id)} className="cursor-pointer">
                  <GameCard
                    title={game.title}
                    description={game.description}
                    imageSrc={game.image}
                    difficulty={game.difficulty}
                    xpReward={game.xpReward}
                  />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vocabulary">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {games
                .filter((game) => game.category === "vocabulary")
                .map((game) => (
                  <div key={game.id} onClick={() => handleGameClick(game.id)} className="cursor-pointer">
                    <GameCard
                      title={game.title}
                      description={game.description}
                      imageSrc={game.image}
                      difficulty={game.difficulty}
                      xpReward={game.xpReward}
                    />
                  </div>
                ))}
            </div>
          </TabsContent>

          <TabsContent value="translation">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {games
                .filter((game) => game.category === "translation")
                .map((game) => (
                  <div key={game.id} onClick={() => handleGameClick(game.id)} className="cursor-pointer">
                    <GameCard
                      title={game.title}
                      description={game.description}
                      imageSrc={game.image}
                      difficulty={game.difficulty}
                      xpReward={game.xpReward}
                    />
                  </div>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

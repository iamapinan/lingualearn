"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { GameCard } from "@/components/game-card"
import { useRouter } from "next/navigation"
import { BackButton } from "@/components/back-button"

import { games } from "@/lib/games-data"

export default function GamesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("all")

  const handleGameClick = (gameId: string) => {
    router.push(`/games/${gameId}`)
  }

  return (
    <div className="container mx-auto p-4">
      <BackButton href="/" label="Back to Home" />
      <h1 className="text-3xl font-bold mb-6 text-center">Language Learning Games</h1>

      <div className="mb-8">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Games</TabsTrigger>
            <TabsTrigger value="vocabulary">Vocabulary</TabsTrigger>
            <TabsTrigger value="grammar">Grammar</TabsTrigger>
            <TabsTrigger value="translation">Translation</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {games.map((game) => (
                <GameCard
                  key={game.id}
                  title={game.title}
                  description={game.description}
                  imageSrc={game.image}
                  difficulty={game.difficulty}
                  xpReward={game.xpReward}
                  onClick={() => handleGameClick(game.id)}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="vocabulary">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {games
                .filter((game) => game.category === "vocabulary")
                .map((game) => (
                  <GameCard
                    key={game.id}
                    title={game.title}
                    description={game.description}
                    imageSrc={game.image}
                    difficulty={game.difficulty}
                    xpReward={game.xpReward}
                    onClick={() => handleGameClick(game.id)}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="grammar">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {games
                .filter((game) => game.category === "grammar")
                .map((game) => (
                  <GameCard
                    key={game.id}
                    title={game.title}
                    description={game.description}
                    imageSrc={game.image}
                    difficulty={game.difficulty}
                    xpReward={game.xpReward}
                    onClick={() => handleGameClick(game.id)}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="translation">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {games
                .filter((game) => game.category === "translation")
                .map((game) => (
                  <GameCard
                    key={game.id}
                    title={game.title}
                    description={game.description}
                    imageSrc={game.image}
                    difficulty={game.difficulty}
                    xpReward={game.xpReward}
                    onClick={() => handleGameClick(game.id)}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

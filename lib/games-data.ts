export type GameDifficulty = "easy" | "medium" | "hard"

export interface Game {
  id: string
  title: string
  description: string
  image: string
  difficulty: GameDifficulty
  xpReward: number
  category: string
}

export const games: Game[] = [
  {
    id: "grammar-jumper",
    title: "Grammar Jumper",
    description: "Jump on clouds by matching the correct grammar category!",
    image: "/grammar-jumper-cover.png",
    difficulty: "medium",
    xpReward: 30,
    category: "grammar",
  },
  {
    id: "memory-match",
    title: "Memory Match",
    description: "Match pairs of words to improve your vocabulary",
    image: "/memory-match-cover.png",
    difficulty: "medium",
    xpReward: 25,
    category: "vocabulary",
  },
  {
    id: "word-scramble",
    title: "Word Scramble",
    description: "Unscramble the letters to form correct words",
    image: "/word-scramble-cover.png",
    difficulty: "easy",
    xpReward: 20,
    category: "vocabulary",
  },
  {
    id: "speed-challenge",
    title: "Speed Challenge",
    description: "Translate words as quickly as possible",
    image: "/speed-challenge-cover.png",
    difficulty: "hard",
    xpReward: 30,
    category: "translation",
  },
  {
    id: "hangman",
    title: "Hangman",
    description: "Guess the word before the hangman is complete",
    image: "/hangman-cover.png",
    difficulty: "medium",
    xpReward: 25,
    category: "vocabulary",
  },
  {
    id: "word-search",
    title: "Word Search",
    description: "Find hidden words in a grid of letters",
    image: "/word-search-cover.png",
    difficulty: "medium",
    xpReward: 20,
    category: "vocabulary",
  },
  {
    id: "mystery-wheel",
    title: "Mystery Wheel Game",
    description: "Spin the wheel and guess the word from the hint",
    image: "/mystery-wheel-cover.png",
    difficulty: "medium",
    xpReward: 25,
    category: "vocabulary",
  },
  {
    id: "word-guardian",
    title: "Word Guardian",
    description: "Defeat monsters by typing words",
    image: "/word-guardian-cover.png",
    difficulty: "medium",
    xpReward: 30,
    category: "vocabulary",
  },
]

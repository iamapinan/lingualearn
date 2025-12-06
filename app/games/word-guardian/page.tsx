"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BackButton } from "@/components/back-button"
import { useAuth } from "@/components/auth-provider"
import { saveGameResult } from "@/lib/database"
import { vocabulary } from "@/lib/db/data/vocabulary-data"
import { Play, RotateCcw, Trophy } from "lucide-react"

// --- Constants & Types ---
const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 600
const PLAYER_X = 100
const PLAYER_Y = CANVAS_HEIGHT / 2
const PLAYER_SIZE = 100
const ENEMY_SIZE = 40
const PROJECTILE_SPEED = 15
const PARTICLE_COUNT = 15
const BASE_SPAWN_RATE = 2000 // ms
const MIN_SPAWN_RATE = 500 // ms

interface Entity {
  x: number
  y: number
  width: number
  height: number
  color: string
}

interface Player extends Entity {
  targetY: number
}

interface Enemy extends Entity {
  id: number
  word: string
  speed: number
  active: boolean
}

interface Projectile extends Entity {
  targetId: number
  active: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

export default function WordGuardianGame() {
  const { user, token } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Game State
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start")
  const [score, setScore] = useState(0)
  const [inputBuffer, setInputBuffer] = useState("")
  const [highScore, setHighScore] = useState(0)

  // Refs for game loop to avoid closure staleness
  const gameStateRef = useRef<"start" | "playing" | "gameover">("start")
  const scoreRef = useRef(0)
  const lastTimeRef = useRef(0)
  const lastSpawnTimeRef = useRef(0)
  const spawnRateRef = useRef(BASE_SPAWN_RATE)
  
  const playerRef = useRef<Player>({
    x: PLAYER_X,
    y: PLAYER_Y,
    width: PLAYER_SIZE,
    height: PLAYER_SIZE,
    color: "#4F46E5", // Indigo 600
    targetY: PLAYER_Y
  })
  
  const enemiesRef = useRef<Enemy[]>([])
  const projectilesRef = useRef<Projectile[]>([])
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number | undefined>(undefined)

  // Images
  const bgImageRef = useRef<HTMLImageElement | null>(null)
  const wizardImageRef = useRef<HTMLImageElement | null>(null)
  const monsterImageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const bg = new Image()
    bg.src = "/word-guardian-bg.png"
    bg.onload = () => { bgImageRef.current = bg }

    const wizard = new Image()
    wizard.src = "/wizard.png"
    wizard.onload = () => { wizardImageRef.current = wizard }

    const monster = new Image()
    monster.src = "/monster.png"
    monster.onload = () => { monsterImageRef.current = monster }
  }, [])

  // --- Game Logic ---

  const spawnEnemy = useCallback(() => {
    // Filter out words with spaces
    const validWords = vocabulary.filter(v => !v.word.includes(" "))
    if (validWords.length === 0) return

    const wordObj = validWords[Math.floor(Math.random() * validWords.length)]
    const word = wordObj.word.toLowerCase()
    
    // Ensure no duplicate words on screen
    if (enemiesRef.current.some(e => e.word === word)) return

    const y = Math.random() * (CANVAS_HEIGHT - ENEMY_SIZE * 2) + ENEMY_SIZE
    const speed = 0.5 + (scoreRef.current / 500) // Increase speed with score
    
    enemiesRef.current.push({
      id: Date.now() + Math.random(),
      x: CANVAS_WIDTH + 50,
      y,
      width: ENEMY_SIZE,
      height: ENEMY_SIZE,
      color: "#EF4444", // Red 500
      word,
      speed,
      active: true
    })
  }, [])

  const createExplosion = (x: number, y: number, color: string) => {
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particlesRef.current.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color
      })
    }
  }

  const gameOver = useCallback(() => {
    setGameState("gameover")
    gameStateRef.current = "gameover"
    
    if (scoreRef.current > highScore) {
      setHighScore(scoreRef.current)
    }

    if (user) {
      saveGameResult({
        userId: user.id,
        gameType: "word-guardian",
        score: scoreRef.current,
        date: new Date().toISOString(),
        details: {
          enemiesDefeated: scoreRef.current / 10 // Assuming 10 points per kill
        }
      }, token || undefined).catch(console.error)
    }
  }, [highScore, user, token])

  const update = useCallback((deltaTime: number) => {
    if (gameStateRef.current !== "playing") return

    // Spawning
    const now = performance.now()
    if (now - lastSpawnTimeRef.current > spawnRateRef.current) {
      spawnEnemy()
      lastSpawnTimeRef.current = now
      // Decrease spawn rate as score increases
      spawnRateRef.current = Math.max(MIN_SPAWN_RATE, BASE_SPAWN_RATE - (scoreRef.current * 2))
    }

    // Update Player (Smooth movement to target Y - optional, for now static or follows last kill?)
    // Let's make player move towards the average Y of enemies or just stay center. 
    // For now, static is fine as per requirements "Wizard character on the left".

    // Update Enemies
    enemiesRef.current.forEach(enemy => {
      enemy.x -= enemy.speed
      
      // Check collision with player
      if (enemy.x < PLAYER_X + PLAYER_SIZE) {
        gameOver()
      }
    })

    // Update Projectiles
    projectilesRef.current.forEach(proj => {
      const target = enemiesRef.current.find(e => e.id === proj.targetId)
      if (target) {
        // Homing missile logic
        const dx = target.x - proj.x
        const dy = target.y - proj.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        
        if (dist < PROJECTILE_SPEED) {
          // Hit
          proj.active = false
          target.active = false
          createExplosion(target.x, target.y, target.color)
          scoreRef.current += 10
          setScore(scoreRef.current)
        } else {
          proj.x += (dx / dist) * PROJECTILE_SPEED
          proj.y += (dy / dist) * PROJECTILE_SPEED
        }
      } else {
        proj.active = false // Target gone
      }
    })

    // Update Particles
    particlesRef.current.forEach(p => {
      p.x += p.vx
      p.y += p.vy
      p.life -= 0.02
    })

    // Cleanup
    enemiesRef.current = enemiesRef.current.filter(e => e.active)
    projectilesRef.current = projectilesRef.current.filter(p => p.active)
    particlesRef.current = particlesRef.current.filter(p => p.life > 0)

  }, [spawnEnemy, gameOver])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear background
    // ctx.fillStyle = "#1E1B4B" // Dark Indigo (Night forest bg placeholder)
    // ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    
    if (bgImageRef.current) {
      ctx.drawImage(bgImageRef.current, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    } else {
      ctx.fillStyle = "#1E1B4B"
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)
    }

    // Draw Background Elements (Stars/Moon placeholder) - Removed as we have BG image now
    // ctx.fillStyle = "#312E81"
    // ctx.beginPath()
    // ctx.arc(700, 100, 40, 0, Math.PI * 2)
    // ctx.fill()

    // Draw Player (Wizard)
    if (wizardImageRef.current) {
        ctx.drawImage(wizardImageRef.current, playerRef.current.x, playerRef.current.y, playerRef.current.width, playerRef.current.height)
    } else {
        ctx.fillStyle = playerRef.current.color
        ctx.fillRect(playerRef.current.x, playerRef.current.y, playerRef.current.width, playerRef.current.height)
        // Wizard Hat
        ctx.beginPath()
        ctx.moveTo(playerRef.current.x, playerRef.current.y)
        ctx.lineTo(playerRef.current.x + playerRef.current.width, playerRef.current.y)
        ctx.lineTo(playerRef.current.x + playerRef.current.width / 2, playerRef.current.y - 30)
        ctx.fill()
    }

    // Draw Enemies (Monsters)
    enemiesRef.current.forEach(enemy => {
      if (monsterImageRef.current) {
        ctx.drawImage(monsterImageRef.current, enemy.x, enemy.y, enemy.width, enemy.height)
      } else {
        ctx.fillStyle = enemy.color
        // Slime shape (semi-circle top, rect bottom)
        ctx.beginPath()
        ctx.arc(enemy.x + enemy.width/2, enemy.y + enemy.height/2, enemy.width/2, Math.PI, 0)
        ctx.rect(enemy.x, enemy.y + enemy.height/2, enemy.width, enemy.height/2)
        ctx.fill()
      }
      
      // Draw Word
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "bold 20px Arial"
      ctx.shadowColor = "black"
      ctx.shadowBlur = 4
      ctx.textAlign = "center"
      ctx.fillText(enemy.word, enemy.x + enemy.width/2, enemy.y - 10)
      ctx.shadowBlur = 0
      
      // Highlight matching prefix
      // This is tricky to draw efficiently, skipping for now or simple implementation:
      // We could pass the inputBuffer to draw and color the matching part differently.
    })

    // Draw Projectiles
    ctx.fillStyle = "#FBBF24" // Amber 400
    projectilesRef.current.forEach(proj => {
      ctx.beginPath()
      ctx.arc(proj.x, proj.y, 5, 0, Math.PI * 2)
      ctx.fill()
    })

    // Draw Particles
    particlesRef.current.forEach(p => {
      ctx.globalAlpha = p.life
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0
    })

  }, [])

  const loop = useCallback((timestamp: number) => {
    if (!lastTimeRef.current) lastTimeRef.current = timestamp
    const deltaTime = timestamp - lastTimeRef.current
    lastTimeRef.current = timestamp

    update(deltaTime)
    draw()

    if (gameStateRef.current === "playing") {
      animationFrameRef.current = requestAnimationFrame(loop)
    }
  }, [update, draw])

  // --- Event Handlers ---

  const startGame = () => {
    setGameState("playing")
    gameStateRef.current = "playing"
    setScore(0)
    scoreRef.current = 0
    setInputBuffer("")
    enemiesRef.current = []
    projectilesRef.current = []
    particlesRef.current = []
    lastTimeRef.current = 0
    lastSpawnTimeRef.current = 0
    spawnRateRef.current = BASE_SPAWN_RATE
    
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    animationFrameRef.current = requestAnimationFrame(loop)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameStateRef.current !== "playing") return

      // Prevent default for game keys if needed, but typing is main interaction
      if (e.key.length === 1 && e.key.match(/[a-z]/i)) {
        const char = e.key.toLowerCase()
        setInputBuffer(prev => {
          const newVal = prev + char
          checkInput(newVal)
          return newVal
        })
      } else if (e.key === "Backspace") {
        setInputBuffer(prev => prev.slice(0, -1))
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const checkInput = (input: string) => {
    // Find matching enemy
    const matchIndex = enemiesRef.current.findIndex(e => e.word === input && e.active)
    
    if (matchIndex !== -1) {
      // Kill enemy
      const enemy = enemiesRef.current[matchIndex]
      
      // Spawn projectile
      projectilesRef.current.push({
        x: playerRef.current.x + playerRef.current.width,
        y: playerRef.current.y + playerRef.current.height / 2,
        width: 10,
        height: 10,
        color: "#FBBF24",
        targetId: enemy.id,
        active: true
      })
      
      // Clear input
      setInputBuffer("")
    }
  }

  // Initial Draw
  useEffect(() => {
    if (gameState === "start") {
      draw()
    }
  }, [gameState, draw])

  return (
    <div className="container mx-auto p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl mb-4 flex justify-between items-center">
        <BackButton href="/games" />
        <div className="flex gap-4">
          <div className="bg-indigo-100 px-4 py-2 rounded-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-600" />
            <span className="font-bold text-indigo-900">Score: {score}</span>
          </div>
          <div className="bg-yellow-100 px-4 py-2 rounded-lg flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="font-bold text-yellow-900">High Score: {highScore}</span>
          </div>
        </div>
      </div>

      <Card className="w-full max-w-4xl overflow-hidden shadow-2xl border-4 border-indigo-200">
        <CardContent className="p-0 relative">
          <canvas
            ref={canvasRef}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            className="w-full h-auto block bg-slate-900 cursor-crosshair"
          />
          
          {/* UI Overlay */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 px-6 py-2 rounded-full text-white font-mono text-xl border border-white/20">
            {inputBuffer || "Type matching words..."}
            <span className="animate-pulse">|</span>
          </div>

          {gameState === "start" && (
            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white p-8 text-center">
              <h1 className="text-5xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                WORD GUARDIAN
              </h1>
              <p className="text-xl mb-8 max-w-md text-gray-300">
                You are the last wizard defending the forest. Type the words above the monsters to cast spells and defeat them!
              </p>
              <Button 
                onClick={startGame}
                size="lg"
                className="text-xl px-8 py-6 bg-indigo-600 hover:bg-indigo-500 transition-all transform hover:scale-105"
              >
                <Play className="mr-2 w-6 h-6" /> Start Game
              </Button>
            </div>
          )}

          {gameState === "gameover" && (
            <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center text-white p-8 text-center animate-in fade-in duration-300">
              <h2 className="text-4xl font-bold mb-2">GAME OVER</h2>
              <p className="text-2xl mb-6">Final Score: {score}</p>
              <Button 
                onClick={startGame}
                size="lg"
                className="text-xl px-8 py-6 bg-white text-red-900 hover:bg-gray-100 transition-all"
              >
                <RotateCcw className="mr-2 w-6 h-6" /> Play Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center text-gray-500 max-w-2xl">
        <p>Tip: Focus on the monsters closest to you! The game gets faster as your score increases.</p>
      </div>
    </div>
  )
}

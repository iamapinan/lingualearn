"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Play, RotateCcw, Trophy, Volume2, VolumeX } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { saveGameResult } from "@/lib/database"
import { gameWords, GameWord, WordCategory } from "./words"

// Game Constants
const GRAVITY = 0.5
const JUMP_FORCE = -11
const MOVE_SPEED_START = 2
const SPAWN_RATE_START = 100 // Frames
const PLAYER_X = 100
const GROUND_HEIGHT = 50

interface Cloud {
  id: number
  x: number
  y: number
  width: number
  height: number
  word: GameWord
  broken: boolean
}

interface Particle {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

export default function GrammarJumperGame() {
  const router = useRouter()
  const { user, token } = useAuth()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  // Game State
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [targetCategory, setTargetCategory] = useState<WordCategory>("NOUN")
  const [combo, setCombo] = useState(0)
  const [isMuted, setIsMuted] = useState(false)

  // Refs for game loop to avoid closure staleness
  const gameStateRef = useRef<"start" | "playing" | "gameover">("start")
  const scoreRef = useRef(0)
  const comboRef = useRef(0)
  const playerRef = useRef({ y: 0, vy: 0, grounded: false, radius: 20 })
  const cloudsRef = useRef<Cloud[]>([])
  const particlesRef = useRef<Particle[]>([])
  const frameCountRef = useRef(0)
  const speedRef = useRef(MOVE_SPEED_START)
  const targetCategoryRef = useRef<WordCategory>("NOUN")
  const spawnRateRef = useRef(SPAWN_RATE_START)
  const requestRef = useRef<number | undefined>(undefined)

  // Load high score
  useEffect(() => {
    if (user?.games?.["grammar-jumper"]) {
      setHighScore(user.games["grammar-jumper"].bestScore)
    }
  }, [user])

  // Images
  const cloudImageRef = useRef<HTMLImageElement | null>(null)
  const characterImageRef = useRef<HTMLImageElement | null>(null)

  useEffect(() => {
    const cloud = new Image()
    cloud.src = "/cloud.png"
    cloud.onload = () => { cloudImageRef.current = cloud }

    const char = new Image()
    char.src = "/character.png"
    char.onload = () => { characterImageRef.current = char }
  }, [])

  // Sound effects (using simple Audio API or placeholders)
  const playSound = useCallback((type: "jump" | "correct" | "wrong" | "gameover") => {
    if (isMuted) return
    // In a real app, we would play actual audio files here
    // For now, we'll just log or use minimal web audio if needed
  }, [isMuted])

  const startGame = () => {
    setGameState("playing")
    gameStateRef.current = "playing"
    setScore(0)
    scoreRef.current = 0
    setCombo(0)
    comboRef.current = 0
    
    // Reset Physics
    playerRef.current = { y: 300, vy: 0, grounded: false, radius: 20 }
    cloudsRef.current = []
    particlesRef.current = []
    frameCountRef.current = 0
    speedRef.current = MOVE_SPEED_START
    spawnRateRef.current = SPAWN_RATE_START
    
    // Pick initial target
    pickNewTarget()
    
    // Start Loop
    if (requestRef.current) cancelAnimationFrame(requestRef.current)
    requestRef.current = requestAnimationFrame(gameLoop)
  }

  const pickNewTarget = () => {
    const categories: WordCategory[] = ["NOUN", "VERB", "ADJECTIVE"]
    const newTarget = categories[Math.floor(Math.random() * categories.length)]
    setTargetCategory(newTarget)
    targetCategoryRef.current = newTarget
  }

  const spawnCloud = (canvasWidth: number, canvasHeight: number) => {
    const word = gameWords[Math.floor(Math.random() * gameWords.length)]
    // Ensure we occasionally get the target category
    const isTarget = Math.random() < 0.4
    let selectedWord = word
    
    if (isTarget) {
      const targetWords = gameWords.filter(w => w.category === targetCategoryRef.current)
      selectedWord = targetWords[Math.floor(Math.random() * targetWords.length)]
    }

    // Random height but reachable
    // Canvas height is typically ~600
    // Ground is at bottom.
    // We want clouds at various heights: low, mid, high
    const minY = 150
    const maxY = canvasHeight - 150
    const y = Math.random() * (maxY - minY) + minY

    cloudsRef.current.push({
      id: Date.now() + Math.random(),
      x: canvasWidth + 50,
      y: y,
      width: 150,
      height: 80, // Adjusted for image aspect ratio
      word: selectedWord,
      broken: false
    })
  }

  const createParticles = (x: number, y: number, color: string, count: number = 10) => {
    for (let i = 0; i < count; i++) {
      particlesRef.current.push({
        id: Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 1.0,
        color
      })
    }
  }

  const jump = () => {
    if (gameStateRef.current !== "playing") return
    
    // Allow double jump or just simple jump? 
    // Let's allow jump if grounded OR if we want to make it easier, multi-jump
    // For this game, "Flappy Bird" style or "Doodle Jump" style?
    // Prompt says "Tap screen to jump". Usually implies air jumps are allowed or double jumps.
    // Let's allow double jump.
    
    playerRef.current.vy = JUMP_FORCE
    playerRef.current.grounded = false
    playSound("jump")
  }

  const gameOver = async () => {
    gameStateRef.current = "gameover"
    setGameState("gameover")
    playSound("gameover")
    
    if (user) {
      await saveGameResult({
        userId: user.id,
        gameType: "grammar-jumper",
        score: scoreRef.current,
        date: new Date().toISOString(),
        details: { maxCombo: 0 } // Could track max combo
      }, token || undefined)
    }
  }

  const gameLoop = (time: number) => {
    if (gameStateRef.current !== "playing") return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // --- UPDATE ---
    frameCountRef.current++
    
    // Increase speed over time
    if (frameCountRef.current % 1200 === 0) {
      speedRef.current += 0.5
      spawnRateRef.current = Math.max(60, spawnRateRef.current - 5)
    }

    // Spawn Clouds
    if (frameCountRef.current % spawnRateRef.current === 0) {
      spawnCloud(width, height)
    }

    // Player Physics
    const player = playerRef.current
    player.vy += GRAVITY
    player.y += player.vy

    // Floor Collision (Game Over if falls too far?)
    // Prompt says "Fall = Game Over".
    if (player.y > height + 50) {
      gameOver()
      return
    }

    // Ceiling Collision (Optional)
    if (player.y < -50) {
      player.vy = 0
      player.y = -50
    }

    // Cloud Logic
    for (let i = cloudsRef.current.length - 1; i >= 0; i--) {
      const cloud = cloudsRef.current[i]
      cloud.x -= speedRef.current

      // Remove off-screen clouds
      if (cloud.x + cloud.width < -100) {
        cloudsRef.current.splice(i, 1)
        continue
      }

      // Collision Detection
      // Simple AABB + Player is a circle/point at bottom
      // Check if player is falling onto the cloud
      if (!cloud.broken && player.vy > 0) {
        const playerBottom = player.y + player.radius
        const playerRight = PLAYER_X + player.radius
        const playerLeft = PLAYER_X - player.radius
        
        // Check if feet are within cloud vertical range (top to top+15)
        // and horizontally within cloud
        if (
          playerBottom >= cloud.y &&
          playerBottom <= cloud.y + 30 && // Increased tolerance
          playerRight > cloud.x &&
          playerLeft < cloud.x + cloud.width
        ) {
          // Landed!
          // Check Category
          if (cloud.word.category === targetCategoryRef.current) {
            // Correct!
            player.vy = JUMP_FORCE // Auto bounce
            scoreRef.current += 10 + (comboRef.current * 2)
            setScore(scoreRef.current)
            comboRef.current++
            setCombo(comboRef.current)
            createParticles(PLAYER_X, playerBottom, "#4ade80", 10) // Green particles
            playSound("correct")
            
            // Occasionally change target
            if (comboRef.current % 3 === 0) {
              pickNewTarget()
            }
          } else {
            // Wrong!
            cloud.broken = true
            createParticles(cloud.x + cloud.width/2, cloud.y, "#ef4444", 20) // Red particles
            playSound("wrong")
            comboRef.current = 0
            setCombo(0)
            // Player continues falling through
          }
        }
      }
    }

    // Particle Logic
    for (let i = particlesRef.current.length - 1; i >= 0; i--) {
      const p = particlesRef.current[i]
      p.x += p.vx
      p.y += p.vy
      p.life -= 0.02
      if (p.life <= 0) {
        particlesRef.current.splice(i, 1)
      }
    }

    // --- DRAW ---
    ctx.clearRect(0, 0, width, height)

    // Background (Sky)
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, "#60a5fa") // Blue-400
    gradient.addColorStop(1, "#bfdbfe") // Blue-200
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Draw Clouds
    cloudsRef.current.forEach(cloud => {
      if (cloud.broken) return // Don't draw broken clouds (or draw fragments)

      if (cloudImageRef.current) {
        ctx.drawImage(cloudImageRef.current, cloud.x, cloud.y, cloud.width, cloud.height)
      } else {
        ctx.fillStyle = "white"
        roundRect(ctx, cloud.x, cloud.y, cloud.width, cloud.height, 20)
        ctx.fill()
      }
      
      // Text
      ctx.fillStyle = "#1e293b" // Slate-800
      ctx.font = "bold 16px sans-serif"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(cloud.word.word, cloud.x + cloud.width/2, cloud.y + cloud.height/2)
    })

    // Draw Player
    if (characterImageRef.current) {
      // Draw character image centered on player position
      // Assuming player.radius is approx half width/height
      const size = player.radius * 2.5 // Make it slightly larger than the hitbox
      ctx.drawImage(
        characterImageRef.current, 
        PLAYER_X - size/2, 
        player.y - size/2, 
        size, 
        size
      )
    } else {
      ctx.fillStyle = "#f59e0b" // Amber-500
      ctx.beginPath()
      ctx.arc(PLAYER_X, player.y, player.radius, 0, Math.PI * 2)
      ctx.fill()
      // Eyes
      ctx.fillStyle = "white"
      ctx.beginPath()
      ctx.arc(PLAYER_X + 6, player.y - 4, 6, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = "black"
      ctx.beginPath()
      ctx.arc(PLAYER_X + 8, player.y - 4, 2, 0, Math.PI * 2)
      ctx.fill()
    }

    // Draw Particles
    particlesRef.current.forEach(p => {
      ctx.globalAlpha = p.life
      ctx.fillStyle = p.color
      ctx.beginPath()
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2)
      ctx.fill()
      ctx.globalAlpha = 1.0
    })

    requestRef.current = requestAnimationFrame(gameLoop)
  }

  // Helper for rounded rect
  const roundRect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) => {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  // Input handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        e.preventDefault() // Prevent scrolling
        jump()
      }
    }
    
    const handleTouchStart = (e: TouchEvent) => {
      // e.preventDefault() // Might block button clicks if not careful
      // We'll handle touch via the main div onClick instead
    }

    window.addEventListener("keydown", handleKeyDown)
    // window.addEventListener("touchstart", handleTouchStart, { passive: false })
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      // window.removeEventListener("touchstart", handleTouchStart)
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-slate-50 p-4 flex flex-col items-center">
      <div className="w-full max-w-4xl flex items-center justify-between mb-4">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <div className="flex items-center gap-4">
           <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <Card className="relative w-full max-w-4xl aspect-video overflow-hidden shadow-xl bg-slate-900">
        {/* Game Canvas */}
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          className="w-full h-full object-contain cursor-pointer"
          onClick={jump}
        />

        {/* HUD */}
        {gameState === "playing" && (
          <div className="absolute top-4 left-4 right-4 flex justify-between items-start pointer-events-none">
            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg">
              <div className="text-sm text-slate-500 font-bold">SCORE</div>
              <div className="text-2xl font-black text-slate-800">{score}</div>
            </div>

            <div className="flex flex-col items-center gap-2">
              <div className="bg-indigo-600 text-white px-6 py-3 rounded-full shadow-lg transform scale-110 transition-transform">
                <div className="text-xs font-bold opacity-80 uppercase tracking-wider">Target</div>
                <div className="text-xl font-black">{targetCategory}</div>
              </div>
              {combo > 1 && (
                <div className="text-yellow-400 font-black text-2xl animate-bounce drop-shadow-md">
                  {combo}x COMBO!
                </div>
              )}
            </div>

            <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-xl shadow-lg text-right">
              <div className="text-sm text-slate-500 font-bold">HIGH SCORE</div>
              <div className="text-xl font-black text-slate-800">{highScore}</div>
            </div>
          </div>
        )}

        {/* Start Screen */}
        {gameState === "start" && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center text-white p-8 text-center">
            <h1 className="text-5xl font-black mb-2 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 drop-shadow-sm">
              GRAMMAR JUMPER
            </h1>
            <p className="text-xl mb-8 text-slate-100 max-w-md">
              Jump on clouds that match the target category!
              <br />
              <span className="text-sm opacity-80 mt-2 block">
                (Tap or Spacebar to Jump)
              </span>
            </p>
            
            <Button 
              size="lg" 
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-12 py-8 rounded-2xl shadow-lg transform transition hover:scale-105"
            >
              <Play className="w-8 h-8 mr-3" />
              START GAME
            </Button>
          </div>
        )}

        {/* Game Over Screen */}
        {gameState === "gameover" && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md flex flex-col items-center justify-center text-white p-8 text-center animate-in fade-in duration-300">
            <div className="text-6xl mb-4">💀</div>
            <h2 className="text-4xl font-black mb-2">GAME OVER</h2>
            <div className="text-2xl mb-8">
              Score: <span className="font-bold text-yellow-400">{score}</span>
            </div>
            
            <div className="flex gap-4">
              <Button 
                size="lg" 
                onClick={startGame}
                className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-lg px-8 py-6 rounded-xl"
              >
                <RotateCcw className="w-6 h-6 mr-2" />
                Try Again
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => router.back()}
                className="bg-white/10 hover:bg-white/20 text-white border-white/20 font-bold text-lg px-8 py-6 rounded-xl"
              >
                Exit
              </Button>
            </div>
          </div>
        )}
      </Card>
      
      {/* Instructions / Footer */}
      <div className="mt-8 max-w-2xl text-center text-slate-500 text-sm">
        <p>Tip: Watch the target at the top! Only land on words that match the category.</p>
        <div className="flex justify-center gap-8 mt-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-green-400"></span>
            <span>Correct = Bounce + Points</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-400"></span>
            <span>Wrong = Fall</span>
          </div>
        </div>
      </div>
    </div>
  )
}

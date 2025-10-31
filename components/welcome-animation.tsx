"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function WelcomeAnimation() {
  const [show, setShow] = useState(false)

  // Check if welcome has been shown before
  useEffect(() => {
    const hasShownWelcome = localStorage.getItem("hasShownWelcome") === "true"

    if (!hasShownWelcome) {
      setShow(true)
      // Mark as shown
      localStorage.setItem("hasShownWelcome", "true")
    }
  }, [])

  // Auto-hide after 5 seconds
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setShow(false)
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [show])

  const handleClose = () => {
    setShow(false)
  }

  if (!show) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute top-20 left-4 right-4 bg-indigo-100 dark:bg-indigo-900/30 p-4 rounded-lg shadow-md z-50"
        >
          <Button variant="ghost" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-5 w-5 text-indigo-500" />
            <h3 className="font-medium">Welcome to LinguaLearn!</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Your learning journey begins now. Explore the menu to access lessons, games, and practice exercises.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

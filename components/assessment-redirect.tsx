"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { hasCompletedOrSkippedAssessment } from "@/lib/database"

interface AssessmentRedirectProps {
  children: React.ReactNode
  allowedPaths?: string[]
}

export function AssessmentRedirect({ children, allowedPaths = ["/assessment", "/auth"] }: AssessmentRedirectProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [hasCompleted, setHasCompleted] = useState(false)
  const [currentPath, setCurrentPath] = useState("")

  useEffect(() => {
    setCurrentPath(window.location.pathname)
  }, [])

  useEffect(() => {
    const checkAssessment = async () => {
      if (user) {
        try {
          const completed = await hasCompletedOrSkippedAssessment(user.id)
          setHasCompleted(completed)
        } catch (error) {
          console.error("Error checking assessment completion:", error)
          // If there's an error, we'll assume not completed to be safe
          setHasCompleted(false)
          router.push("/assessment")
        } finally {
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    checkAssessment()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    )
  }

  // If assessment is completed or on allowed path, render children
  if (hasCompleted || allowedPaths.includes(currentPath) || !user) {
    return <>{children}</>
  }

  // This should not be visible as we redirect, but just in case
  return null
}

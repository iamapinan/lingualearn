"use client"

import type React from "react"

interface AssessmentRedirectProps {
  children: React.ReactNode
  allowedPaths?: string[]
}

export function AssessmentRedirect({ children }: AssessmentRedirectProps) {
  // Disabled assessment check - always render children
  return <>{children}</>
}

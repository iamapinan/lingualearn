"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  href?: string
  label?: string
}

export function BackButton({ href = "/games", label = "Back to Games" }: BackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    router.push(href)
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} className="mb-4 flex items-center gap-1">
      <ChevronLeft className="h-4 w-4" />
      {label}
    </Button>
  )
}

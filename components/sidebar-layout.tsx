"use client"

import { useAuth } from "@/components/auth-provider"
import { cn } from "@/lib/utils"

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const hasSidebar = !isLoading && !!user

  return (
    <main
      className={cn(
        "flex-1 transition-all duration-300",
        hasSidebar && "md:ml-[70px] sidebar-expanded:md:ml-[240px]"
      )}
    >
      {children}
    </main>
  )
}


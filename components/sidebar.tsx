"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useAuth } from "@/components/auth-provider"
import { WelcomeAnimation } from "@/components/welcome-animation"
import { useSidebarState } from "@/hooks/use-sidebar-state"
import {
  BookOpen,
  GraduationCap,
  Home,
  Menu,
  MessageSquare,
  Award,
  History,
  Gamepad2,
  BookText,
  Trophy,
  Flame,
  ChevronRight,
  ChevronLeft,
  BookMarked,
  LogOut,
  Shield,
  BarChart3,
} from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { user, logout, isLoading } = useAuth()
  const { expanded, toggleSidebar } = useSidebarState()

  // Close mobile sidebar when route changes
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  // Close sidebar on desktop when route changes
  useEffect(() => {
    if (isDesktop) {
      setOpen(false)
    }
  }, [pathname, isDesktop])

  // ซ่อน sidebar หากยังไม่ได้เข้าสู่ระบบ (ต้องอยู่หลัง hooks)
  if (isLoading || !user) {
    return null
  }

  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  const handleLogout = () => {
    logout()
    window.location.href = "/auth"
  }

  const navItems = [
    {
      title: "Home",
      href: "/",
      icon: Home,
    },
    {
      title: "Lessons",
      href: "/lesson/1",
      icon: BookOpen,
    },
    {
      title: "Practice",
      href: "/practice",
      icon: MessageSquare,
    },
    {
      title: "Vocabulary",
      href: "/vocabulary",
      icon: BookText,
    },
    {
      title: "Verbs",
      href: "/verbs",
      icon: BookMarked,
    },
    {
      title: "Games",
      href: "/games",
      icon: Gamepad2,
    },
    {
      title: "Challenges",
      href: "/challenges",
      icon: Flame,
    },
    {
      title: "Achievements",
      href: "/achievements",
      icon: Award,
    },
    {
      title: "Badges",
      href: "/badges",
      icon: Trophy,
    },
    {
      title: "Leaderboard",
      href: "/leaderboard",
      icon: BarChart3,
    },
    {
      title: "History",
      href: "/history",
      icon: History,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: GraduationCap,
    },
  ]

  // เพิ่มเมนู Admin สำหรับ admin เท่านั้น
  const adminItems = user?.role === "admin" ? [
    {
      title: "Admin Panel",
      href: "/admin",
      icon: Shield,
    },
  ] : []

  const allNavItems = [...navItems, ...adminItems]

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40 md:hidden"
            aria-label="Open Menu"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <MobileSidebar navItems={allNavItems} pathname={pathname} onLogout={handleLogout} />
        </SheetContent>
      </Sheet>

      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className={cn(
          "fixed inset-y-0 left-0 z-30 hidden flex-col border-r bg-background md:flex",
          expanded ? "w-[240px]" : "w-[70px]",
          className,
        )}
        {...props}
      >
        <div className={cn("p-6 flex items-center", expanded ? "justify-between" : "justify-center")}>
          <Link href="/" className={cn("flex items-center gap-2 font-semibold", !expanded && "justify-center")}>
            <Image src="/logo.svg" alt="LinguaLearn Logo" width={24} height={24} className="flex-shrink-0" />
            {expanded && <span>LinguaLearn</span>}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hidden md:flex"
            aria-label={expanded ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {expanded ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          </Button>
        </div>
        <ScrollArea className="flex-1 overflow-auto py-2">
          <nav className="grid gap-1 px-2 group">
            {allNavItems.map((item, i) => (
              <motion.div key={item.href} custom={i} initial="hidden" animate="visible" variants={sidebarVariants}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                    pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
                    !expanded && "justify-center",
                  )}
                  title={!expanded ? item.title : undefined}
                >
                  <item.icon className="h-4 w-4" />
                  {expanded && item.title}
                </Link>
              </motion.div>
            ))}
            
            <motion.div custom={allNavItems.length} initial="hidden" animate="visible" variants={sidebarVariants}>
              <button
                onClick={handleLogout}
                className={cn(
                  "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors text-red-500",
                  !expanded && "justify-center",
                )}
                title={!expanded ? "Logout" : undefined}
              >
                <LogOut className="h-4 w-4" />
                {expanded && "ออกจากระบบ"}
              </button>
            </motion.div>
          </nav>
        </ScrollArea>
        {expanded && <WelcomeAnimation />}

        {/* Mobile toggle button at the bottom */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleSidebar}
          className="md:hidden mx-auto mb-4 mt-2"
          aria-label={expanded ? "Collapse Sidebar" : "Expand Sidebar"}
        >
          {expanded ? <ChevronLeft className="h-4 w-4 mr-2" /> : <ChevronRight className="h-4 w-4" />}
          {expanded && <span>Collapse</span>}
        </Button>
      </motion.aside>

      {/* Floating toggle button for mobile when sidebar is collapsed */}
      {!expanded && (
        <Button
          variant="outline"
          size="icon"
          onClick={toggleSidebar}
          className="fixed bottom-4 left-4 z-40 md:hidden rounded-full shadow-md"
          aria-label="Expand Sidebar"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </>
  )
}

function MobileSidebar({ navItems, pathname, onLogout }: { navItems: any[]; pathname: string; onLogout: () => void }) {
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="p-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.svg" alt="LinguaLearn Logo" width={24} height={24} className="flex-shrink-0" />
          <span>LinguaLearn</span>
        </Link>
      </div>
      <ScrollArea className="flex-1 overflow-auto py-2">
        <nav className="grid gap-1 px-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                pathname === item.href ? "bg-accent text-accent-foreground" : "transparent",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
          
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-red-50 hover:text-red-600 transition-colors text-red-500"
          >
            <LogOut className="h-4 w-4" />
            ออกจากระบบ
          </button>
        </nav>
      </ScrollArea>
    </div>
  )
}

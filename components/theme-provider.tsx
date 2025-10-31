"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false)

  // Add a class to the body when theme changes to trigger animation
  const handleThemeChange = () => {
    document.body.classList.add("theme-transition")
    setTimeout(() => {
      document.body.classList.remove("theme-transition")
    }, 500)
  }

  React.useEffect(() => {
    setMounted(true)

    // Listen for theme changes
    window.addEventListener("themeChange", handleThemeChange)

    return () => {
      window.removeEventListener("themeChange", handleThemeChange)
    }
  }, [])

  return (
    <NextThemesProvider
      {...props}
      onValueChange={() => {
        // Dispatch custom event when theme changes
        window.dispatchEvent(new Event("themeChange"))
      }}
    >
      {mounted ? children : null}
    </NextThemesProvider>
  )
}

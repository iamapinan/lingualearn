"use client"

import { useState, useEffect } from "react"

export function useSidebarState() {
  const [expanded, setExpanded] = useState(false)

  // Initialize from localStorage on component mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarExpanded")
      // Default to collapsed (false) if no preference is saved
      setExpanded(savedState ? JSON.parse(savedState) : false)

      // Add or remove the sidebar-expanded class based on the state
      if (savedState && JSON.parse(savedState)) {
        document.documentElement.classList.add("sidebar-expanded")
      } else {
        document.documentElement.classList.remove("sidebar-expanded")
      }
    }
  }, [])

  // Update localStorage and class when state changes
  const toggleSidebar = () => {
    const newState = !expanded
    setExpanded(newState)

    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarExpanded", JSON.stringify(newState))

      if (newState) {
        document.documentElement.classList.add("sidebar-expanded")
      } else {
        document.documentElement.classList.remove("sidebar-expanded")
      }
    }
  }

  return { expanded, toggleSidebar }
}

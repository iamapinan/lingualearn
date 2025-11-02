"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  name: string
  email: string
  role?: "user" | "admin"
  avatar?: string
  totalXp: number
  lessonsCompleted: number
  level: number
  totalPoints: number
  streak?: number
  joinedDate: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  isLoading: boolean
  updateUser: (user: User) => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
  updateUser: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Function to load user from localStorage
  const loadUserFromStorage = () => {
    const storedUser = localStorage.getItem("lingualearn_user")
    const storedToken = localStorage.getItem("lingualearn_token")

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setToken(storedToken)
        return parsedUser
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("lingualearn_user")
        localStorage.removeItem("lingualearn_token")
      }
    }
    
    setIsLoading(false)
    return null
  }

  // Initial load
  useEffect(() => {
    loadUserFromStorage()
    setIsLoading(false)
  }, [])

  // Listen for updates
  useEffect(() => {
    // Listen for storage changes (from other tabs/windows)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "lingualearn_user") {
        loadUserFromStorage()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    // Also listen for custom event for same-tab updates
    const handleUserUpdate = () => {
      const storedUser = localStorage.getItem("lingualearn_user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser((prevUser) => {
            // Only update if data actually changed
            if (!prevUser || 
                prevUser.totalXp !== parsedUser.totalXp || 
                prevUser.level !== parsedUser.level || 
                prevUser.totalPoints !== parsedUser.totalPoints ||
                prevUser.streak !== parsedUser.streak) {
              return parsedUser
            }
            return prevUser
          })
        } catch (error) {
          console.error("Error parsing user on update:", error)
        }
      }
    }

    window.addEventListener("userUpdated", handleUserUpdate as EventListener)

    // Poll localStorage every 2 seconds for updates (for same-tab updates)
    const pollInterval = setInterval(() => {
      const storedUser = localStorage.getItem("lingualearn_user")
      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUser((prevUser) => {
            // Only update if data actually changed
            if (!prevUser || 
                prevUser.totalXp !== parsedUser.totalXp || 
                prevUser.level !== parsedUser.level || 
                prevUser.totalPoints !== parsedUser.totalPoints ||
                prevUser.streak !== parsedUser.streak) {
              return parsedUser
            }
            return prevUser
          })
        } catch (error) {
          // Ignore parse errors
        }
      }
    }, 2000)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
      window.removeEventListener("userUpdated", handleUserUpdate as EventListener)
      clearInterval(pollInterval)
    }
  }, []) // No dependencies to avoid infinite loop

  const login = (user: User, token: string) => {
    setUser(user)
    setToken(token)
    localStorage.setItem("lingualearn_user", JSON.stringify(user))
    localStorage.setItem("lingualearn_token", token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("lingualearn_user")
    localStorage.removeItem("lingualearn_token")
  }

  const updateUser = (updatedUser: User) => {
    // ตรวจสอบว่าข้อมูลเปลี่ยนจริงๆ ก่อนอัปเดตเพื่อหลีกเลี่ยง infinite loop
    setUser((prevUser) => {
      if (!prevUser) {
        localStorage.setItem("lingualearn_user", JSON.stringify(updatedUser))
        return updatedUser
      }
      
      // เช็คว่ามีการเปลี่ยนแปลงจริงๆ หรือไม่
      const hasChanges = 
        prevUser.streak !== updatedUser.streak ||
        prevUser.totalXp !== updatedUser.totalXp ||
        prevUser.level !== updatedUser.level ||
        prevUser.totalPoints !== updatedUser.totalPoints ||
        prevUser.lessonsCompleted !== updatedUser.lessonsCompleted ||
        prevUser.name !== updatedUser.name
      
      if (hasChanges) {
        localStorage.setItem("lingualearn_user", JSON.stringify(updatedUser))
        return updatedUser
      }
      
      return prevUser
    })
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

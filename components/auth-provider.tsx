"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface User {
  id: number
  name: string
  email: string
  role?: "user" | "admin"
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

  useEffect(() => {
    const storedUser = localStorage.getItem("lingualearn_user")
    const storedToken = localStorage.getItem("lingualearn_token")

    if (storedUser && storedToken) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setToken(storedToken)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("lingualearn_user")
        localStorage.removeItem("lingualearn_token")
      }
    }
    
    setIsLoading(false)
  }, [])

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
    setUser(updatedUser)
    localStorage.setItem("lingualearn_user", JSON.stringify(updatedUser))
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

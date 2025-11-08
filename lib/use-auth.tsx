"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"

interface AuthContextType {
  isLoggedIn: boolean
  userEmail: string | null
  login: (email: string, password: string) => boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  // Check if user is logged in on mount
  useEffect(() => {
    const storedEmail = localStorage.getItem("userEmail")
    if (storedEmail) {
      setIsLoggedIn(true)
      setUserEmail(storedEmail)
    }
  }, [])

  const login = (email: string, password: string) => {
    // Mock authentication - in real app this would call an API
    if (email && password) {
      localStorage.setItem("userEmail", email)
      setIsLoggedIn(true)
      setUserEmail(email)
      return true
    }
    return false
  }

  const logout = () => {
    localStorage.removeItem("userEmail")
    setIsLoggedIn(false)
    setUserEmail(null)
  }

  return <AuthContext.Provider value={{ isLoggedIn, userEmail, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

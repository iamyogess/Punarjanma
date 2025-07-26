"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { API_CONFIG } from "@/lib/config"

interface User {
  _id: string
  email: string
  name: string
  role: string // Added role
  premiumCourses: string[]
  enrolledCourses: string[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User | null> // Changed return type
  logout: () => void
  refreshUser: () => Promise<void>
  isPremiumUser: (courseId: string) => boolean
  isEnrolled: (courseId: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/v1/me`, {
        credentials: "include",
      })
      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
      } else {
        setUser(null) // Clear user if not authenticated
      }
    } catch (error) {
      console.error("Auth check failed:", error)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/auth/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        return data.user // Return the user object
      }
      return null
    } catch (error) {
      console.error("Login failed:", error)
      return null
    }
  }

  const logout = async () => {
    try {
      await fetch(`${API_CONFIG.BASE_URL}/auth/v1/logout`, {
        method: "POST",
        credentials: "include",
      })
    } catch (error) {
      console.error("Logout failed:", error)
    } finally {
      setUser(null)
    }
  }

  const refreshUser = async () => {
    await checkAuth()
  }

  const isPremiumUser = (courseId: string): boolean => {
    return user?.premiumCourses?.includes(courseId) || false
  }

  const isEnrolled = (courseId: string): boolean => {
    return user?.enrolledCourses?.includes(courseId) || false
  }

  useEffect(() => {
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        refreshUser,
        isPremiumUser,
        isEnrolled,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

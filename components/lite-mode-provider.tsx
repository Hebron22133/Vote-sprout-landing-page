"use client"

import type React from "react"

import { createContext, useContext, useState, useEffect } from "react"

interface LiteModeContextType {
  isLiteMode: boolean
  toggleLiteMode: () => void
}

const LiteModeContext = createContext<LiteModeContextType | undefined>(undefined)

export function LiteModeProvider({ children }: { children: React.ReactNode }) {
  const [isLiteMode, setIsLiteMode] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("votesprout-lite-mode")
    if (saved) {
      setIsLiteMode(JSON.parse(saved))
    }
  }, [])

  const toggleLiteMode = () => {
    const newValue = !isLiteMode
    setIsLiteMode(newValue)
    localStorage.setItem("votesprout-lite-mode", JSON.stringify(newValue))
  }

  return <LiteModeContext.Provider value={{ isLiteMode, toggleLiteMode }}>{children}</LiteModeContext.Provider>
}

export function useLiteMode() {
  const context = useContext(LiteModeContext)
  if (context === undefined) {
    throw new Error("useLiteMode must be used within a LiteModeProvider")
  }
  return context
}

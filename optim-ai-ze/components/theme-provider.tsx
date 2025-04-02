'use client'

import * as React from 'react'
import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from 'next-themes'
import { createContext, useContext, useEffect, useState } from "react"
import { type ThemeProviderProps as NextThemesProviderProps } from "next-themes/dist/types"

type Theme = "light" | "dark" | "system" | string
type ThemeColor = "blue" | "green" | "purple" | "orange" | "rose" | string

type ThemeContextType = {
  theme: Theme
  setTheme: (theme: Theme) => void
  themeColor: ThemeColor
  setThemeColor: (color: ThemeColor) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [themeColor, setThemeColor] = useState<ThemeColor>("blue")

  // Load theme color from localStorage on mount
  useEffect(() => {
    const savedColor = localStorage.getItem("themeColor") as ThemeColor
    if (savedColor) {
      setThemeColor(savedColor)
      document.documentElement.setAttribute("data-theme-color", savedColor)
    } else {
      document.documentElement.setAttribute("data-theme-color", "blue")
    }
  }, [])

  // Save theme color to localStorage when it changes
  useEffect(() => {
    if (themeColor) {
      localStorage.setItem("themeColor", themeColor)
      document.documentElement.setAttribute("data-theme-color", themeColor)
    }
  }, [themeColor])

  return (
    <NextThemesProvider {...props}>
      <ThemeColorProvider themeColor={themeColor} setThemeColor={setThemeColor}>
        {children}
      </ThemeColorProvider>
    </NextThemesProvider>
  )
}

function ThemeColorProvider({
  children,
  themeColor,
  setThemeColor,
}: {
  children: React.ReactNode
  themeColor: ThemeColor
  setThemeColor: (color: ThemeColor) => void
}) {
  const { theme, setTheme } = useTheme()

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themeColor, setThemeColor }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useThemeContext = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>("system")
  
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme
    if (savedTheme) {
      setThemeState(savedTheme)
    }
  }, [])
  
  const setTheme = (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme)
    setThemeState(newTheme)
    
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
    } else if (newTheme === "light") {
      document.documentElement.classList.remove("dark")
    } else if (newTheme === "system") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark")
      } else {
        document.documentElement.classList.remove("dark")
      }
    }
  }
  
  // Listen for system theme changes
  useEffect(() => {
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
      const handleChange = () => {
        if (mediaQuery.matches) {
          document.documentElement.classList.add("dark")
        } else {
          document.documentElement.classList.remove("dark")
        }
      }
      
      mediaQuery.addEventListener("change", handleChange)
      handleChange() // Initial check
      
      return () => mediaQuery.removeEventListener("change", handleChange)
    }
  }, [theme])
  
  return { theme, setTheme }
}

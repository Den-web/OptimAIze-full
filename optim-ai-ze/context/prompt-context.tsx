"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { prompts as defaultPrompts } from "@/lib/prompts"

export interface UserPrompt {
  id: string
  title: string
  description: string
  content: string
  category: 'development' | 'analysis' | 'optimization' | 'documentation' | 'general'
  ruleIds?: string[]
  createdAt: Date
  isDefault?: boolean
}

interface PromptContextType {
  prompts: UserPrompt[]
  createPrompt: (prompt: Omit<UserPrompt, "id" | "createdAt">) => void
  updatePrompt: (id: string, prompt: Partial<UserPrompt>) => void
  deletePrompt: (id: string) => void
  getPrompt: (id: string) => UserPrompt | undefined
  exportPrompts: () => void
  exportPrompt: (id: string) => void
}

const PromptContext = createContext<PromptContextType | undefined>(undefined)

export function PromptProvider({ children }: { children: React.ReactNode }) {
  const [prompts, setPrompts] = useState<UserPrompt[]>(() => {
    // Convert default prompts to UserPrompt format
    const convertedDefaultPrompts: UserPrompt[] = defaultPrompts.map(dp => ({
      id: dp.id,
      title: dp.name,
      description: dp.description,
      content: dp.content,
      category: dp.category,
      createdAt: new Date(),
      isDefault: true
    }))

    // Get user prompts from localStorage
    const savedPrompts = typeof window !== 'undefined' 
      ? JSON.parse(localStorage.getItem("prompts") || "[]")
      : []

    // Parse dates for saved prompts
    const parsedSavedPrompts = savedPrompts.map((p: any) => ({
      ...p,
      createdAt: new Date(p.createdAt)
    }))

    // Combine default and user prompts
    return [...convertedDefaultPrompts, ...parsedSavedPrompts]
  })

  useEffect(() => {
    // Only save user prompts to localStorage
    const userPrompts = prompts.filter(p => !p.isDefault)
    localStorage.setItem("prompts", JSON.stringify(userPrompts))
  }, [prompts])

  const createPrompt = (prompt: Omit<UserPrompt, "id" | "createdAt">) => {
    const newPrompt: UserPrompt = {
      ...prompt,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      isDefault: false
    }
    setPrompts(prev => [...prev, newPrompt])
  }

  const updatePrompt = (id: string, prompt: Partial<UserPrompt>) => {
    setPrompts(prev => prev.map(p => 
      p.id === id && !p.isDefault ? { ...p, ...prompt } : p
    ))
  }

  const deletePrompt = (id: string) => {
    setPrompts(prev => prev.filter(p => p.id !== id || p.isDefault))
  }

  const getPrompt = (id: string) => {
    return prompts.find(p => p.id === id)
  }

  const exportPrompts = () => {
    // Only export user prompts (not defaults)
    const userPrompts = prompts.filter(p => !p.isDefault)
    
    if (userPrompts.length === 0) {
      return
    }
    
    const exportData = {
      exportDate: new Date().toISOString(),
      prompts: userPrompts
    }
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompts-export-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const exportPrompt = (id: string) => {
    const prompt = prompts.find(p => p.id === id)
    
    if (!prompt) {
      return
    }
    
    const exportData = {
      exportDate: new Date().toISOString(),
      prompt: prompt
    }
    
    // Create downloadable file
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-${prompt.title.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <PromptContext.Provider value={{ 
      prompts, 
      createPrompt, 
      updatePrompt, 
      deletePrompt, 
      getPrompt, 
      exportPrompts,
      exportPrompt 
    }}>
      {children}
    </PromptContext.Provider>
  )
}

export function usePrompts() {
  const context = useContext(PromptContext)
  if (context === undefined) {
    throw new Error("usePrompts must be used within a PromptProvider")
  }
  return context
}


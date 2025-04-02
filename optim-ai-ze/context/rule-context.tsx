"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { rules as defaultRules } from "@/lib/rules"

export interface Rule {
  id: string
  name: string
  description: string
  content: string
  createdAt: Date
  isDefault?: boolean
}

interface RuleContextType {
  rules: Rule[]
  addRule: (rule: Omit<Rule, "id" | "createdAt">) => string
  updateRule: (id: string, rule: Partial<Omit<Rule, "id" | "createdAt">>) => void
  deleteRule: (id: string) => void
  getRule: (id: string) => Rule | undefined
}

const RuleContext = createContext<RuleContextType | undefined>(undefined)

export function RuleProvider({ children }: { children: ReactNode }) {
  const [rules, setRules] = useState<Rule[]>(() => {
    // Convert default rules to Rule format
    const convertedDefaultRules: Rule[] = defaultRules.map(dr => ({
      ...dr,
      createdAt: new Date(),
      isDefault: true
    }))

    // Get user rules from localStorage
    const savedRules = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem("rules") || "[]")
      : []

    // Parse dates for saved rules
    const parsedSavedRules = savedRules.map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt)
    }))

    // Combine default and user rules
    return [...convertedDefaultRules, ...parsedSavedRules]
  })

  // Save rules to localStorage whenever they change
  useEffect(() => {
    // Only save user rules to localStorage
    const userRules = rules.filter(r => !r.isDefault)
    localStorage.setItem("rules", JSON.stringify(userRules))
  }, [rules])

  const addRule = (ruleData: Omit<Rule, "id" | "createdAt">) => {
    const id = crypto.randomUUID()
    const newRule: Rule = {
      ...ruleData,
      id,
      createdAt: new Date(),
      isDefault: false
    }
    setRules((prev) => [...prev, newRule])
    return id
  }

  const updateRule = (id: string, ruleData: Partial<Omit<Rule, "id" | "createdAt">>) => {
    setRules((prev) => prev.map((rule) => (rule.id === id && !rule.isDefault ? { ...rule, ...ruleData } : rule)))
  }

  const deleteRule = (id: string) => {
    setRules((prev) => prev.filter((rule) => rule.id !== id || rule.isDefault))
  }

  const getRule = (id: string) => {
    return rules.find((rule) => rule.id === id)
  }

  return (
    <RuleContext.Provider value={{ rules, addRule, updateRule, deleteRule, getRule }}>
      {children}
    </RuleContext.Provider>
  )
}

export function useRules() {
  const context = useContext(RuleContext)
  if (context === undefined) {
    throw new Error("useRules must be used within a RuleProvider")
  }
  return context
}


"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { defaultRoles } from "@/lib/roles"

export interface Role {
  id: string
  name: string
  description: string
  content: string
  category: "technical" | "business" | "creative" | "academic" | "other"
  expertise: string[]
  createdAt: Date
  isDefault?: boolean
}

interface RoleContextType {
  roles: Role[]
  addRole: (role: Omit<Role, "id" | "createdAt">) => string
  updateRole: (id: string, role: Partial<Omit<Role, "id" | "createdAt">>) => void
  deleteRole: (id: string) => void
  getRole: (id: string) => Role | undefined
}

const RoleContext = createContext<RoleContextType | undefined>(undefined)

export function RoleProvider({ children }: { children: ReactNode }) {
  const [roles, setRoles] = useState<Role[]>(() => {
    // Convert default roles to Role format
    const convertedDefaultRoles: Role[] = defaultRoles.map(dr => ({
      ...dr,
      id: `default-${dr.name.toLowerCase().replace(/\s+/g, '-')}`,
      createdAt: new Date(),
    }))

    // Get user roles from localStorage
    const savedRoles = typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem("roles") || "[]")
      : []

    // Parse dates for saved roles
    const parsedSavedRoles = savedRoles.map((r: any) => ({
      ...r,
      createdAt: new Date(r.createdAt)
    }))

    // Combine default and user roles
    return [...convertedDefaultRoles, ...parsedSavedRoles]
  })

  // Save roles to localStorage whenever they change
  useEffect(() => {
    // Only save user roles to localStorage
    const userRoles = roles.filter(r => !r.isDefault)
    localStorage.setItem("roles", JSON.stringify(userRoles))
  }, [roles])

  const addRole = (roleData: Omit<Role, "id" | "createdAt">) => {
    const id = crypto.randomUUID()
    const newRole: Role = {
      ...roleData,
      id,
      createdAt: new Date(),
      isDefault: false
    }
    setRoles((prev) => [...prev, newRole])
    return id
  }

  const updateRole = (id: string, roleData: Partial<Omit<Role, "id" | "createdAt">>) => {
    setRoles((prev) => prev.map((role) => (role.id === id && !role.isDefault ? { ...role, ...roleData } : role)))
  }

  const deleteRole = (id: string) => {
    setRoles((prev) => prev.filter((role) => role.id !== id || role.isDefault))
  }

  const getRole = (id: string) => {
    return roles.find((role) => role.id === id)
  }

  return (
    <RoleContext.Provider value={{ roles, addRole, updateRole, deleteRole, getRole }}>
      {children}
    </RoleContext.Provider>
  )
}

export function useRoles() {
  const context = useContext(RoleContext)
  if (context === undefined) {
    throw new Error("useRoles must be used within a RoleProvider")
  }
  return context
} 
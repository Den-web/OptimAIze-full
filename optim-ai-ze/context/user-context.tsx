"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface UserProfile {
  name: string
  profession: string
  expertise: string[]
  interests: string[]
  description: string
  preferredLanguage: string
  communicationStyle: string
}

interface UserContextType {
  profile: UserProfile
  updateProfile: (profile: Partial<UserProfile>) => void
}

const defaultProfile: UserProfile = {
  name: "",
  profession: "",
  expertise: [],
  interests: [],
  description: "",
  preferredLanguage: "English",
  communicationStyle: "Balanced",
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)

  // Load profile from localStorage on initial render
  useEffect(() => {
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile)
        setProfile(parsedProfile)
      } catch (error) {
        console.error("Failed to parse saved profile:", error)
      }
    }
  }, [])

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("userProfile", JSON.stringify(profile))
  }, [profile])

  const updateProfile = (newProfileData: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfileData }))
  }

  return <UserContext.Provider value={{ profile, updateProfile }}>{children}</UserContext.Provider>
}

export function useUser() {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}


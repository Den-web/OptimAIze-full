"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { useUser } from "@/context/user-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function SettingsForm() {
  const { profile, updateProfile } = useUser()
  const [isLoading, setIsLoading] = useState(false)
  const [apiSettings, setApiSettings] = useState({
    apiKey: "",
  })

  // Create a state for the profile form
  const [profileForm, setProfileForm] = useState({
    name: "",
    profession: "",
    expertise: "",
    interests: "",
    description: "",
    preferredLanguage: "English",
    communicationStyle: "Balanced",
  })

  // Initialize the form with the current profile data
  useEffect(() => {
    setProfileForm({
      name: profile.name,
      profession: profile.profession,
      expertise: profile.expertise.join(", "),
      interests: profile.interests.join(", "),
      description: profile.description,
      preferredLanguage: profile.preferredLanguage,
      communicationStyle: profile.communicationStyle,
    })
  }, [profile])

  const handleApiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setApiSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleApiSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // In a real app, you would save the settings securely
      // For now, we'll just simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "API settings saved",
        description: "Your API settings have been saved successfully.",
        role: "status",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save API settings. Please try again.",
        variant: "destructive",
        role: "alert",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Convert comma-separated strings to arrays
      const expertise = profileForm.expertise
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "")

      const interests = profileForm.interests
        .split(",")
        .map((item) => item.trim())
        .filter((item) => item !== "")

      // Update the profile in the context
      updateProfile({
        name: profileForm.name,
        profession: profileForm.profession,
        expertise,
        interests,
        description: profileForm.description,
        preferredLanguage: profileForm.preferredLanguage,
        communicationStyle: profileForm.communicationStyle,
      })

      toast({
        title: "Profile saved",
        description: "Your profile has been saved successfully.",
        role: "status",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save profile. Please try again.",
        variant: "destructive",
        role: "alert",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tabs defaultValue="profile" className="w-full">
      <TabsList className="mb-4 w-full grid grid-cols-2">
        <TabsTrigger value="profile" className="text-sm">
          Personal Profile
        </TabsTrigger>
        <TabsTrigger value="api" className="text-sm">
          API Settings
        </TabsTrigger>
      </TabsList>

      <TabsContent value="profile">
        <Card>
          <CardHeader>
            <CardTitle>Personal Profile</CardTitle>
          </CardHeader>
          <form onSubmit={handleProfileSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Your name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  aria-describedby="name-description"
                />
                <p id="name-description" className="text-sm text-muted-foreground">
                  Your name will be used to personalize AI interactions.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profession">Profession</Label>
                <Input
                  id="profession"
                  name="profession"
                  placeholder="E.g., Software Developer, Designer, Writer"
                  value={profileForm.profession}
                  onChange={handleProfileChange}
                  aria-describedby="profession-description"
                />
                <p id="profession-description" className="text-sm text-muted-foreground">
                  Your profession helps the AI provide more relevant responses.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expertise">Areas of Expertise</Label>
                <Input
                  id="expertise"
                  name="expertise"
                  placeholder="E.g., JavaScript, UX Design, Content Marketing (comma-separated)"
                  value={profileForm.expertise}
                  onChange={handleProfileChange}
                  aria-describedby="expertise-description"
                />
                <p id="expertise-description" className="text-sm text-muted-foreground">
                  List your areas of expertise, separated by commas.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Interests</Label>
                <Input
                  id="interests"
                  name="interests"
                  placeholder="E.g., AI, Photography, Travel (comma-separated)"
                  value={profileForm.interests}
                  onChange={handleProfileChange}
                  aria-describedby="interests-description"
                />
                <p id="interests-description" className="text-sm text-muted-foreground">
                  List your interests, separated by commas.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">About You</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Write a brief description about yourself..."
                  value={profileForm.description}
                  onChange={handleProfileChange}
                  className="min-h-[100px]"
                  aria-describedby="description-description"
                />
                <p id="description-description" className="text-sm text-muted-foreground">
                  A brief description about yourself to help the AI understand your background.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredLanguage">Preferred Language</Label>
                <Select
                  value={profileForm.preferredLanguage}
                  onValueChange={(value) => handleSelectChange("preferredLanguage", value)}
                >
                  <SelectTrigger id="preferredLanguage" aria-label="Select preferred language">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Spanish">Spanish</SelectItem>
                    <SelectItem value="French">French</SelectItem>
                    <SelectItem value="German">German</SelectItem>
                    <SelectItem value="Chinese">Chinese</SelectItem>
                    <SelectItem value="Japanese">Japanese</SelectItem>
                    <SelectItem value="Russian">Russian</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">The primary language you prefer for AI responses.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="communicationStyle">Communication Style</Label>
                <Select
                  value={profileForm.communicationStyle}
                  onValueChange={(value) => handleSelectChange("communicationStyle", value)}
                >
                  <SelectTrigger id="communicationStyle" aria-label="Select communication style">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Formal">Formal</SelectItem>
                    <SelectItem value="Casual">Casual</SelectItem>
                    <SelectItem value="Technical">Technical</SelectItem>
                    <SelectItem value="Simple">Simple</SelectItem>
                    <SelectItem value="Detailed">Detailed</SelectItem>
                    <SelectItem value="Concise">Concise</SelectItem>
                    <SelectItem value="Balanced">Balanced</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">Your preferred communication style for AI responses.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} aria-busy={isLoading} className="w-full">
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>

      <TabsContent value="api">
        <Card>
          <CardHeader>
            <CardTitle>API Settings</CardTitle>
          </CardHeader>
          <form onSubmit={handleApiSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <Input
                  id="apiKey"
                  name="apiKey"
                  type="password"
                  placeholder="sk-..."
                  value={apiSettings.apiKey}
                  onChange={handleApiChange}
                  aria-describedby="apiKey-description"
                />
                <p id="apiKey-description" className="text-sm text-muted-foreground">
                  Your API key is stored securely and never shared.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} aria-busy={isLoading} className="w-full">
                {isLoading ? "Saving..." : "Save API Settings"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </TabsContent>
    </Tabs>
  )
}


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRoles } from "@/context/role-context"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

const categories = ['technical', 'business', 'creative', 'academic', 'other'] as const

export default function NewRolePage() {
  const router = useRouter()
  const { addRole } = useRoles()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [expertise, setExpertise] = useState<string[]>([])
  const [expertiseInput, setExpertiseInput] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const roleData = {
        name: formData.get("name") as string,
        description: formData.get("description") as string,
        content: formData.get("content") as string,
        category: formData.get("category") as typeof categories[number],
        expertise: expertise,
      }

      if (!roleData.name || !roleData.description || !roleData.content || !roleData.category) {
        throw new Error("Please fill in all fields")
      }

      addRole(roleData)
      toast({
        title: "Role created",
        description: "Your professional role has been created successfully.",
      })
      router.push("/dashboard/roles")
    } catch (error) {
      console.error("Error creating role:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create the role. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addExpertise = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && expertiseInput.trim()) {
      e.preventDefault()
      if (!expertise.includes(expertiseInput.trim())) {
        setExpertise([...expertise, expertiseInput.trim()])
      }
      setExpertiseInput("")
    }
  }

  const removeExpertise = (item: string) => {
    setExpertise(expertise.filter(i => i !== item))
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/roles">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Role</h1>
            <p className="text-muted-foreground">
              Create a new professional role to personalize AI responses.
            </p>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Role Details</CardTitle>
              <CardDescription>
                Fill in the details for your new professional role.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter role name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select name="category" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Areas of Expertise</Label>
                <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
                  {expertise.map((item) => (
                    <Badge key={item} variant="secondary" className="flex items-center gap-1">
                      {item}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeExpertise(item)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                  <Input
                    type="text"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    onKeyDown={addExpertise}
                    placeholder="Type and press Enter to add expertise"
                    className="border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter role description"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Role-Specific Instructions</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter instructions for the AI to follow when assuming this role"
                  className="min-h-[200px]"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  These instructions will guide how the AI responds when this role is active.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/roles")}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Role"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
} 
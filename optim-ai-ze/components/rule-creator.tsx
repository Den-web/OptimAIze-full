"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useRules } from "@/context/rule-context"

export function RuleCreator() {
  const router = useRouter()
  const { addRule } = useRules()
  const [isLoading, setIsLoading] = useState(false)
  const [rule, setRule] = useState({
    name: "",
    description: "",
    content: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRule((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Add the rule to our context
      addRule(rule)

      toast({
        title: "Rule created",
        description: "Your rule has been created successfully.",
        role: "status",
      })

      // Reset form
      setRule({
        name: "",
        description: "",
        content: "",
      })

      // Navigate to rules list
      router.push("/dashboard/rules")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create rule. Please try again.",
        variant: "destructive",
        role: "alert",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Rule</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="E.g., Be Concise"
              value={rule.name}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby="name-description"
            />
            <p id="name-description" className="text-xs text-muted-foreground">
              A short, descriptive name for your rule.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="A brief description of what this rule does"
              value={rule.description}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby="description-description"
            />
            <p id="description-description" className="text-xs text-muted-foreground">
              A brief explanation of what this rule is designed to do.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Rule Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your rule here..."
              value={rule.content}
              onChange={handleChange}
              className="min-h-[150px]"
              required
              aria-required="true"
              aria-describedby="content-description"
            />
            <p id="content-description" className="text-xs text-muted-foreground">
              The actual rule text that will be used in prompts. Be specific and detailed.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard/rules")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? "Creating..." : "Create Rule"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}


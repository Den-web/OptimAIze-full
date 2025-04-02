"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { useRules } from "@/context/rule-context"

export default function EditRulePage() {
  const params = useParams()
  const router = useRouter()
  const { getRule, updateRule } = useRules()
  const [isLoading, setIsLoading] = useState(false)
  const [rule, setRule] = useState({
    id: "",
    name: "",
    description: "",
    content: "",
  })

  useEffect(() => {
    if (params.id) {
      const existingRule = getRule(params.id as string)
      if (existingRule) {
        setRule({
          id: existingRule.id,
          name: existingRule.name,
          description: existingRule.description,
          content: existingRule.content,
        })
      } else {
        router.push("/dashboard/rules")
      }
    }
  }, [params.id, getRule, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setRule((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      updateRule(rule.id, {
        name: rule.name,
        description: rule.description,
        content: rule.content,
      })

      toast({
        title: "Rule updated",
        description: "Your rule has been updated successfully.",
        role: "status",
      })

      router.push("/dashboard/rules")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update rule. Please try again.",
        variant: "destructive",
        role: "alert",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!rule.id) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <div className="text-center" role="status" aria-live="polite">
          <p>Loading rule...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Edit Rule</h1>
        <p className="text-muted-foreground">Update your AI rule.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Edit Rule</CardTitle>
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
              {isLoading ? "Updating..." : "Update Rule"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}


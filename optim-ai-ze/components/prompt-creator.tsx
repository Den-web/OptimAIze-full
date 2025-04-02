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
import { usePrompts } from "@/context/prompt-context"
import { useRules } from "@/context/rule-context"
import { BookOpen, Plus } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

export function PromptCreator() {
  const router = useRouter()
  const { addPrompt } = usePrompts()
  const { rules } = useRules()
  const [isLoading, setIsLoading] = useState(false)
  const [prompt, setPrompt] = useState({
    title: "",
    description: "",
    content: "",
  })
  const [selectedRules, setSelectedRules] = useState<string[]>([])
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setPrompt((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Add the prompt to our context with selected rules
      addPrompt({
        ...prompt,
        ruleIds: selectedRules,
      })

      toast({
        title: "Prompt created",
        description: "Your prompt has been created successfully.",
        role: "status",
      })

      // Reset form
      setPrompt({
        title: "",
        description: "",
        content: "",
      })
      setSelectedRules([])

      // Navigate to prompts list
      router.push("/dashboard/prompts")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create prompt. Please try again.",
        variant: "destructive",
        role: "alert",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addRuleToPrompt = (ruleId: string) => {
    if (!selectedRules.includes(ruleId)) {
      setSelectedRules([...selectedRules, ruleId])
    }
    setIsRuleDialogOpen(false)
  }

  const removeRuleFromPrompt = (ruleId: string) => {
    setSelectedRules(selectedRules.filter((id) => id !== ruleId))
  }

  const insertRuleIntoContent = (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId)
    if (rule) {
      const newContent = prompt.content + (prompt.content ? "\n\n" : "") + rule.content
      setPrompt((prev) => ({ ...prev, content: newContent }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create a New Prompt</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="E.g., Code Review Assistant"
              value={prompt.title}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby="title-description"
            />
            <p id="title-description" className="text-xs text-muted-foreground">
              A short, descriptive title for your prompt.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              name="description"
              placeholder="A brief description of what this prompt does"
              value={prompt.description}
              onChange={handleChange}
              required
              aria-required="true"
              aria-describedby="description-description"
            />
            <p id="description-description" className="text-xs text-muted-foreground">
              A brief explanation of what this prompt is designed to do.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label>Applied Rules</Label>
              <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" disabled={rules.length === 0}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Rule
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Rule to Prompt</DialogTitle>
                    <DialogDescription>Select a rule to add to your prompt.</DialogDescription>
                  </DialogHeader>
                  <Command>
                    <CommandInput placeholder="Search rules..." />
                    <CommandList>
                      <CommandEmpty>No rules found.</CommandEmpty>
                      <CommandGroup>
                        {rules.map((rule) => (
                          <CommandItem key={rule.id} onSelect={() => addRuleToPrompt(rule.id)}>
                            <BookOpen className="mr-2 h-4 w-4" />
                            <span>{rule.name}</span>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-wrap gap-2 min-h-[40px] p-2 border rounded-md">
              {selectedRules.length === 0 ? (
                <p className="text-sm text-muted-foreground">No rules applied yet.</p>
              ) : (
                selectedRules.map((ruleId) => {
                  const rule = rules.find((r) => r.id === ruleId)
                  return rule ? (
                    <Badge key={rule.id} variant="secondary" className="flex items-center gap-1">
                      {rule.name}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => removeRuleFromPrompt(rule.id)}
                        aria-label={`Remove ${rule.name} rule`}
                      >
                        <span className="sr-only">Remove</span>×
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-4 w-4 p-0 ml-1"
                        onClick={() => insertRuleIntoContent(rule.id)}
                        aria-label={`Insert ${rule.name} rule content`}
                        title="Insert rule content into prompt"
                      >
                        <span className="sr-only">Insert</span>+
                      </Button>
                    </Badge>
                  ) : null
                })
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Prompt Content</Label>
            <Textarea
              id="content"
              name="content"
              placeholder="Write your prompt here..."
              value={prompt.content}
              onChange={handleChange}
              className="min-h-[200px]"
              required
              aria-required="true"
              aria-describedby="content-description"
            />
            <p id="content-description" className="text-xs text-muted-foreground">
              The actual prompt text that will be sent to the AI. Be specific and detailed.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/dashboard/prompts")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} aria-busy={isLoading}>
            {isLoading ? "Creating..." : "Create Prompt"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}


"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { usePrompts } from "@/context/prompt-context"
import { useRules } from "@/context/rule-context"
import { toast } from "@/components/ui/use-toast"
import { ArrowLeft, Plus, X, BookOpen } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandList } from "@/components/ui/command"

const categories = ['development', 'analysis', 'optimization', 'documentation', 'general'] as const

export default function NewPromptPage() {
  const router = useRouter()
  const { createPrompt } = usePrompts()
  const { rules } = useRules()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedRules, setSelectedRules] = useState<string[]>([])
  const [isRuleDialogOpen, setIsRuleDialogOpen] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const promptData = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        content: formData.get("content") as string,
        category: formData.get("category") as typeof categories[number],
        ruleIds: selectedRules,
      }

      if (!promptData.title || !promptData.description || !promptData.content || !promptData.category) {
        throw new Error("Please fill in all fields")
      }

      createPrompt(promptData)
      toast({
        title: "Prompt created",
        description: "Your prompt has been created successfully.",
      })
      router.push("/dashboard/prompts")
    } catch (error) {
      console.error("Error creating prompt:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create the prompt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const addRule = (ruleId: string) => {
    if (!selectedRules.includes(ruleId)) {
      setSelectedRules([...selectedRules, ruleId])
    }
    setIsRuleDialogOpen(false)
  }

  const removeRule = (ruleId: string) => {
    setSelectedRules(selectedRules.filter(id => id !== ruleId))
  }

  const insertRuleContent = (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId)
    if (rule) {
      const formElement = document.querySelector('form') as HTMLFormElement
      const contentTextarea = formElement?.querySelector('#content') as HTMLTextAreaElement
      if (contentTextarea) {
        const currentContent = contentTextarea.value
        const newContent = currentContent + (currentContent ? '\n\n' : '') + rule.content
        contentTextarea.value = newContent
        // Trigger a change event to update form state
        const event = new Event('change', { bubbles: true })
        contentTextarea.dispatchEvent(event)
      }
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/prompts">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Create New Prompt</h1>
            <p className="text-muted-foreground">
              Create a new prompt for your AI assistant.
            </p>
          </div>
        </div>

        <Card>
          <form onSubmit={handleSubmit}>
            <CardHeader>
              <CardTitle>Prompt Details</CardTitle>
              <CardDescription>
                Fill in the details for your new prompt.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Enter prompt title"
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
                <div className="flex justify-between items-center">
                  <Label>Applied Rules</Label>
                  <Dialog open={isRuleDialogOpen} onOpenChange={setIsRuleDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Rule
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Rule to Prompt</DialogTitle>
                        <DialogDescription>Select a rule to add to your prompt.</DialogDescription>
                      </DialogHeader>
                      <Command className="rounded-lg border shadow-md">
                        <CommandInput placeholder="Search rules..." />
                        <CommandList>
                          <CommandEmpty>No rules found.</CommandEmpty>
                          <CommandGroup>
                            {rules.map((rule) => (
                              <button
                                key={rule.id}
                                onClick={() => addRule(rule.id)}
                                className="flex items-center w-full px-4 py-2 text-left hover:bg-accent rounded-sm"
                              >
                                <BookOpen className="mr-2 h-4 w-4" />
                                <div className="flex flex-col">
                                  <span className="font-medium">{rule.name}</span>
                                  <span className="text-sm text-muted-foreground">{rule.description}</span>
                                </div>
                              </button>
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
                            onClick={() => removeRule(rule.id)}
                            aria-label={`Remove ${rule.name} rule`}
                          >
                            <span className="sr-only">Remove</span>×
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1"
                            onClick={() => insertRuleContent(rule.id)}
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
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Enter prompt description"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  name="content"
                  placeholder="Enter prompt content"
                  className="min-h-[200px]"
                  required
                />
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard/prompts")}
                type="button"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Prompt"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
} 
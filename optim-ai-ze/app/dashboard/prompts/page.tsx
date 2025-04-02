"use client"

import * as React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, MessageSquare, Settings, Download } from "lucide-react"
import { usePrompts } from "@/context/prompt-context"
import { useRules } from "@/context/rule-context"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { DeleteDialog } from "@/components/ui/delete-dialog"

export default function PromptsPage() {
  const router = useRouter()
  const { prompts, deletePrompt, exportPrompt, exportPrompts } = usePrompts()
  const { rules } = useRules()
  const [promptToDelete, setPromptToDelete] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    try {
      await deletePrompt(id)
      toast({
        title: "Prompt deleted",
        description: "Your prompt has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting prompt:", error)
      toast({
        title: "Error",
        description: "Failed to delete the prompt. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prompts</h1>
            <p className="text-muted-foreground">
              Manage your prompts and their settings.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={exportPrompts} className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export All
            </Button>
            <Button asChild>
              <Link href="/dashboard/prompts/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                New Prompt
              </Link>
            </Button>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <Card key={prompt.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate">{prompt.title}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => exportPrompt(prompt.id)}
                      aria-label={`Download ${prompt.title}`}
                    >
                      <Download className="h-3.5 w-3.5" aria-hidden="true" />
                    </Button>
                    <Badge variant="outline">{prompt.category}</Badge>
                  </div>
                </CardTitle>
                <CardDescription className="line-clamp-2">
                  {prompt.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageSquare className="mr-1 h-4 w-4" />
                  <span>{prompt.ruleIds?.length || 0} rules</span>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="w-full sm:w-auto"
                >
                  <Link href={`/dashboard?promptId=${prompt.id}`}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Use in Chat
                  </Link>
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/dashboard/prompts/edit/${prompt.id}`)}
                  >
                    <Settings className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <DeleteDialog
                    title="Are you sure?"
                    description="This action cannot be undone. This will permanently delete your prompt."
                    onDelete={() => handleDelete(prompt.id)}
                    buttonClassName="w-full sm:w-auto"
                  />
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}


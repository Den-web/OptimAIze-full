"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Trash2, Settings, PlusCircle } from "lucide-react"
import { useRules } from "@/context/rule-context"
import { toast } from "@/components/ui/use-toast"
import { Badge } from "@/components/ui/badge"
import { DeleteDialog } from "@/components/ui/delete-dialog"

export default function RulesPage() {
  const router = useRouter()
  const { rules, deleteRule } = useRules()
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'default' | 'custom'>('all')

  const filteredRules = rules.filter(rule => {
    if (selectedCategory === 'default') return rule.isDefault
    if (selectedCategory === 'custom') return !rule.isDefault
    return true
  })

  const handleDelete = async (id: string) => {
    try {
      deleteRule(id)
      toast({
        title: "Rule deleted",
        description: "Your rule has been deleted successfully.",
      })
    } catch (error) {
      console.error("Error deleting rule:", error)
      toast({
        title: "Error",
        description: "Failed to delete the rule. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  return (
    <div className="container py-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Rules</h1>
            <p className="text-muted-foreground">
              Create and manage rules for your AI prompts.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="flex gap-2">
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('all')}
                size="sm"
              >
                All
              </Button>
              <Button
                variant={selectedCategory === 'default' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('default')}
                size="sm"
              >
                Default
              </Button>
              <Button
                variant={selectedCategory === 'custom' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('custom')}
                size="sm"
              >
                Custom
              </Button>
            </div>
            <Button
              onClick={() => router.push("/dashboard/rules/create")}
              className="w-full sm:w-auto"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              New Rule
            </Button>
          </div>
        </div>

        {filteredRules.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="rounded-full bg-muted p-3">
              <BookOpen className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium">No rules found</h3>
            <p className="mt-2 text-sm text-muted-foreground max-w-sm">
              {selectedCategory === 'custom' 
                ? "You haven't created any custom rules yet. Create your first rule to get started."
                : "No rules available in this category."}
            </p>
            {selectedCategory === 'custom' && (
              <Button
                className="mt-4"
                onClick={() => router.push("/dashboard/rules/create")}
              >
                Create Rule
              </Button>
            )}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredRules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="truncate">{rule.name}</span>
                    {rule.isDefault && (
                      <Badge variant="secondary">Default</Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="line-clamp-2">
                    {rule.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-md p-3 text-sm mb-3 max-h-24 overflow-y-auto">
                    <pre className="whitespace-pre-wrap font-sans">{rule.content}</pre>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Created on {formatDate(rule.createdAt)}
                  </p>
                </CardContent>
                <CardFooter className="flex justify-between gap-2">
                  {!rule.isDefault && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/dashboard/rules/edit/${rule.id}`)}
                        className="w-full sm:w-auto"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Edit
                      </Button>
                      <DeleteDialog
                        title="Are you sure?"
                        description="This action cannot be undone. This will permanently delete your rule."
                        onDelete={() => handleDelete(rule.id)}
                        buttonClassName="w-full sm:w-auto"
                      />
                    </>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


"use client"
import { Card } from "@/components/ui/card"
import { FileText, Code, BookOpen, MessageSquare } from "lucide-react"

interface ChatSuggestionProps {
  onSuggestionClick: (suggestion: string) => void
}

export function ChatSuggestions({ onSuggestionClick }: ChatSuggestionProps) {
  const suggestions = [
    {
      icon: FileText,
      title: "Create a document",
      description: "Help me draft a document or write content",
      prompt: "Can you help me write a document about artificial intelligence?",
    },
    {
      icon: Code,
      title: "Code assistance",
      description: "Get help with coding or debugging",
      prompt: "How do I implement a responsive layout in CSS?",
    },
    {
      icon: BookOpen,
      title: "Learn something new",
      description: "Explore topics and get explanations",
      prompt: "Explain machine learning algorithms to me in simple terms.",
    },
    {
      icon: MessageSquare,
      title: "Brainstorm ideas",
      description: "Generate creative ideas for your projects",
      prompt: "Help me brainstorm ideas for a new mobile app.",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4">
      {suggestions.map((suggestion, index) => (
        <Card
          key={index}
          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
          onClick={() => onSuggestionClick(suggestion.prompt)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onSuggestionClick(suggestion.prompt)
            }
          }}
        >
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 p-2 rounded-md">
              <suggestion.icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium">{suggestion.title}</h3>
              <p className="text-sm text-muted-foreground">{suggestion.description}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}


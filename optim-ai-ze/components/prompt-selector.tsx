"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Check, Search, FileText, Download } from "lucide-react"
import { usePrompts } from "@/context/prompt-context"
import { useRules } from "@/context/rule-context"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"
import { ScrollArea } from "@/components/ui/scroll-area"

interface PromptSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPromptId?: string | null
}

export function PromptSelector({ open, onOpenChange, currentPromptId }: PromptSelectorProps) {
  const router = useRouter()
  const { prompts, exportPrompts, exportPrompt } = usePrompts()
  const { rules } = useRules()
  const [searchQuery, setSearchQuery] = useState("")
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on mobile
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  const filteredPrompts = prompts.filter(
    (prompt) =>
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prompt.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleSelectPrompt = (promptId: string) => {
    router.push(`/dashboard?promptId=${promptId}`)
    onOpenChange(false)
  }

  const clearPrompt = () => {
    router.push("/dashboard")
    onOpenChange(false)
  }

  const getRuleName = (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId)
    return rule ? rule.name : "Unknown Rule"
  }

  // Shared content between mobile and desktop
  const PromptSelectorContent = () => (
    <>
      <Command className="rounded-lg border shadow-md">
        <CommandInput placeholder="Search prompts..." value={searchQuery} onValueChange={setSearchQuery} />
        <CommandList>
          <CommandEmpty>No prompts found.</CommandEmpty>
          <CommandGroup>
            <ScrollArea className="h-[300px]">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="flex flex-col w-full px-4 py-2 text-left hover:bg-accent rounded-sm"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-4 w-4" />
                      <span className="font-medium">{prompt.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          exportPrompt(prompt.id);
                        }}
                        aria-label={`Download ${prompt.title}`}
                      >
                        <Download className="h-3.5 w-3.5" aria-hidden="true" />
                      </Button>
                      {currentPromptId === prompt.id && (
                        <Check className="h-4 w-4 text-primary" />
                      )}
                    </div>
                  </div>
                  <div 
                    className="cursor-pointer" 
                    onClick={() => handleSelectPrompt(prompt.id)}
                  >
                    <p className="text-sm text-muted-foreground ml-6">{prompt.description}</p>
                    {prompt.ruleIds && prompt.ruleIds.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2 ml-6">
                        {prompt.ruleIds.map((ruleId) => (
                          <Badge key={ruleId} variant="secondary" className="text-xs">
                            {getRuleName(ruleId)}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CommandGroup>
        </CommandList>
      </Command>

      <div className="flex items-center justify-between mt-4">
        <div className="flex gap-2">
          <Button variant="outline" onClick={clearPrompt}>
            Clear Prompt
          </Button>
          <Button variant="outline" onClick={exportPrompts} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export All
          </Button>
        </div>
        <Button variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
      </div>
    </>
  )

  // Use Drawer for mobile and Dialog for desktop
  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="text-left">
            <DrawerTitle>Choose a Prompt</DrawerTitle>
            <DrawerDescription>Select a prompt to use in your current chat session.</DrawerDescription>
          </DrawerHeader>
          <PromptSelectorContent />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Choose a Prompt</DialogTitle>
          <DialogDescription>Select a prompt to use in your current chat session.</DialogDescription>
        </DialogHeader>
        <PromptSelectorContent />
      </DialogContent>
    </Dialog>
  )
}


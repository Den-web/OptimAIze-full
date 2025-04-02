"use client"

import { cn } from "@/lib/utils"

export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)} aria-label="AI is typing">
      <div className="animate-bounce h-1.5 w-1.5 bg-current rounded-full" style={{ animationDelay: "0ms" }} />
      <div className="animate-bounce h-1.5 w-1.5 bg-current rounded-full" style={{ animationDelay: "150ms" }} />
      <div className="animate-bounce h-1.5 w-1.5 bg-current rounded-full" style={{ animationDelay: "300ms" }} />
    </div>
  )
}


"use client"

import type React from "react"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlusCircle, MessageSquare, Settings, BookOpen, Users, Plus, Trash2, X } from "lucide-react"
import { useChats } from "@/context/chat-context"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { chats, createChat, setCurrentChat, deleteChat } = useChats()
  const [chatToDelete, setChatToDelete] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  
  // Create a new chat and navigate to chat page
  const handleNewChat = () => {
    const chatId = createChat("New Chat")
    router.push(`/dashboard?chatId=${chatId}`)
  }

  // Handle opening the delete confirmation dialog
  const handleDeleteClick = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation() // Prevent triggering chat selection
    setChatToDelete(chatId)
    setIsDeleteDialogOpen(true)
  }

  // Handle confirming deletion
  const handleConfirmDelete = () => {
    if (chatToDelete) {
      deleteChat(chatToDelete)
      setChatToDelete(null)
      setIsDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <nav className={cn("pb-12 w-64 border-r", className)} aria-label="Main Navigation">
        <div className="space-y-4 py-4">
          <div className="px-4 py-2">
            <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">OptimAIze</h2>
            <div className="space-y-1">
              <Button
                asChild
                variant={pathname === "/dashboard" ? "secondary" : "ghost"}
                className="w-full justify-start"
                aria-current={pathname === "/dashboard" ? "page" : undefined}
              >
                <Link href="/dashboard">
                  <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
                  Chat
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname.startsWith("/dashboard/prompts") ? "secondary" : "ghost"}
                className="w-full justify-start"
                aria-current={pathname.startsWith("/dashboard/prompts") ? "page" : undefined}
              >
                <Link href="/dashboard/prompts">
                  <PlusCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                  Prompts
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname.startsWith("/dashboard/rules") ? "secondary" : "ghost"}
                className="w-full justify-start"
                aria-current={pathname.startsWith("/dashboard/rules") ? "page" : undefined}
              >
                <Link href="/dashboard/rules">
                  <BookOpen className="mr-2 h-4 w-4" aria-hidden="true" />
                  Rules
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname.startsWith("/dashboard/roles") ? "secondary" : "ghost"}
                className="w-full justify-start"
                aria-current={pathname.startsWith("/dashboard/roles") ? "page" : undefined}
              >
                <Link href="/dashboard/roles">
                  <Users className="mr-2 h-4 w-4" aria-hidden="true" />
                  Roles
                </Link>
              </Button>
              <Button
                asChild
                variant={pathname === "/dashboard/settings" ? "secondary" : "ghost"}
                className="w-full justify-start"
                aria-current={pathname === "/dashboard/settings" ? "page" : undefined}
              >
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" aria-hidden="true" />
                  Settings
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="px-4">
            <div className="flex items-center justify-between mb-1">
              <h2 className="px-2 text-lg font-semibold tracking-tight">Recent Chats</h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={handleNewChat}
                className="h-7 w-7" 
                aria-label="Create new chat"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[300px] pr-2">
              <div className="space-y-1">
                {chats.length === 0 ? (
                  <div className="px-2 py-3 text-sm text-muted-foreground">
                    No chats yet. Create a new chat to get started.
                  </div>
                ) : (
                  chats.map((chat) => (
                    <div key={chat.id} className="flex items-center group">
                      <Button
                        variant="ghost"
                        className="w-full justify-start truncate rounded-r-none"
                        onClick={() => {
                          setCurrentChat(chat.id)
                          router.push(`/dashboard?chatId=${chat.id}`)
                        }}
                      >
                        <MessageSquare className="mr-2 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span className="truncate max-w-[140px] block">{chat.title}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-l-none opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleDeleteClick(e, chat.id)}
                        aria-label={`Delete chat ${chat.title}`}
                      >
                        <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </nav>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this chat? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}


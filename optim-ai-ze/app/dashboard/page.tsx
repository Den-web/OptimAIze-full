"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { ChatInterface } from "@/components/chat-interface"
import { useChats } from "@/context/chat-context"

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const chatId = searchParams.get("chatId")
  const { setCurrentChat, currentChatId, getChat, createChat } = useChats()
  
  useEffect(() => {
    if (chatId) {
      // If a chatId is provided, set it as current
      const chat = getChat(chatId)
      if (chat) {
        setCurrentChat(chatId)
      } else {
        // If chat not found, create a new one
        const newChatId = createChat("New Chat")
        setCurrentChat(newChatId)
      }
    } else if (!currentChatId) {
      // If no chatId in URL and no current chat, create a new one
      const newChatId = createChat("New Chat")
      setCurrentChat(newChatId)
    }
  }, [chatId, currentChatId, createChat, getChat, setCurrentChat])

  return (
    <div className="container mx-auto">
      <ChatInterface />
    </div>
  )
}


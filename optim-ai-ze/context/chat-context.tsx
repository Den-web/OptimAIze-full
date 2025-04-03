"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface Chat {
  id: string
  title: string
  createdAt: Date
  updatedAt: Date
  messages: ChatMessage[]
}

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  createdAt: Date
}

interface ChatContextType {
  chats: Chat[]
  currentChatId: string | null
  createChat: (title: string) => string
  updateChat: (id: string, chat: Partial<Chat>) => void
  deleteChat: (id: string) => void
  getChat: (id: string) => Chat | undefined
  setCurrentChat: (id: string | null) => void
  addMessageToChat: (chatId: string, message: Omit<ChatMessage, "id" | "createdAt">) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

// Generate a unique ID (replacement for crypto.randomUUID which isn't available in all environments)
function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function ChatProvider({ children }: { children: ReactNode }) {
  const [chats, setChats] = useState<Chat[]>(() => {
    // Get chats from localStorage
    if (typeof window !== 'undefined') {
      const savedChats = localStorage.getItem("chats")
      if (savedChats) {
        try {
          const parsedChats = JSON.parse(savedChats)
          return parsedChats.map((chat: any) => ({
            ...chat,
            createdAt: new Date(chat.createdAt),
            updatedAt: new Date(chat.updatedAt),
            messages: chat.messages.map((msg: any) => ({
              ...msg,
              createdAt: new Date(msg.createdAt)
            }))
          }))
        } catch (error) {
          console.error("Failed to parse saved chats:", error)
          return []
        }
      }
    }
    return []
  })

  const [currentChatId, setCurrentChatId] = useState<string | null>(null)

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("chats", JSON.stringify(chats))
  }, [chats])

  const createChat = (title: string) => {
    const id = generateId();
    const newChat: Chat = {
      id,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: []
    }
    setChats(prev => [newChat, ...prev])
    setCurrentChatId(id)
    return id
  }

  const updateChat = (id: string, chatUpdates: Partial<Chat>) => {
    setChats(prev => prev.map(chat => 
      chat.id === id
        ? { ...chat, ...chatUpdates, updatedAt: new Date() }
        : chat
    ))
  }

  const deleteChat = (id: string) => {
    setChats(prev => prev.filter(chat => chat.id !== id))
    if (currentChatId === id) {
      setCurrentChatId(null)
    }
  }

  const getChat = (id: string) => {
    return chats.find(chat => chat.id === id)
  }

  const setCurrentChat = (id: string | null) => {
    setCurrentChatId(id)
  }

  const addMessageToChat = (chatId: string, message: Omit<ChatMessage, "id" | "createdAt">) => {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      createdAt: new Date()
    }
    
    setChats(prev => prev.map(chat => 
      chat.id === chatId
        ? { 
            ...chat, 
            messages: [...chat.messages, newMessage],
            updatedAt: new Date()
          }
        : chat
    ))
  }

  return (
    <ChatContext.Provider
      value={{
        chats,
        currentChatId,
        createChat,
        updateChat,
        deleteChat,
        getChat,
        setCurrentChat,
        addMessageToChat
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChats() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChats must be used within a ChatProvider")
  }
  return context
} 
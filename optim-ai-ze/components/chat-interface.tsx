"use client"

import type React from "react"
import type { Message } from "ai"
import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useChat } from "ai/react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Send,
  AlertCircle,
  X,
  Settings,
  BookOpen,
  FileText,
  User,
  ChevronDown,
  ChevronUp,
  Copy,
  Paperclip,
  Smile,
  MoreHorizontal,
  RefreshCw,
  Trash2,
  User2,
  Bot,
  Loader2,
  Heart,
  ThumbsUp,
  ThumbsDown,
  Laugh,
  Lightbulb,
  Mic,
  MicOff,
  Search,
  Download,
  Keyboard,
  Laptop,
  Plus,
} from "lucide-react"
import { usePrompts } from "@/context/prompt-context"
import { useRules } from "@/context/rule-context"
import { useUser } from "@/context/user-context"
import { VisuallyHidden } from "@/components/visually-hidden"
import { Badge } from "@/components/ui/badge"
import { PromptSelector } from "@/components/prompt-selector"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"
import { MessageContent } from "@/components/message-content"
import { ChatSuggestions } from "@/components/chat-suggestions"
import { TypingIndicator } from "@/components/typing-indicator"
import { useRoles } from "@/context/role-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useChats } from "@/context/chat-context"

export function ChatInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const promptId = searchParams.get("promptId")
  const { getPrompt, exportPrompts } = usePrompts()
  const { rules } = useRules()
  const { profile } = useUser()
  const { roles, getRole } = useRoles()
  const [activePrompt, setActivePrompt] = useState<{
    id: string
    title: string
    content: string
    ruleIds?: string[]
  } | null>(null)
  const [activeRole, setActiveRole] = useState<{
    id: string
    name: string
    content: string
    expertise: string[]
  } | null>(null)
  const [isPromptSelectorOpen, setIsPromptSelectorOpen] = useState(false)
  const [isUsingProfile, setIsUsingProfile] = useState(true)
  const [isMobileControlsOpen, setIsMobileControlsOpen] = useState(false)
  const [isAttachmentPopoverOpen, setIsAttachmentPopoverOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [isScrolledToBottom, setIsScrolledToBottom] = useState(true)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [isRulesExpanded, setIsRulesExpanded] = useState(false)
  const [isRoleExpanded, setIsRoleExpanded] = useState(false)
  const [isPromptCollapsed, setIsPromptCollapsed] = useState(true)
  const [isProfileCollapsed, setIsProfileCollapsed] = useState(true)
  const [isMainPromptCollapsed, setIsMainPromptCollapsed] = useState(true)
  const [messageReactions, setMessageReactions] = useState<Record<string, string[]>>({})
  const [isRecording, setIsRecording] = useState(false)
  const [recordingError, setRecordingError] = useState<string | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<number[]>([])
  const [currentSearchResult, setCurrentSearchResult] = useState(-1)
  const [isKeyboardShortcutsOpen, setIsKeyboardShortcutsOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system')
  const { currentChatId, addMessageToChat, getChat, updateChat, createChat } = useChats()

  const { messages, input, handleInputChange, handleSubmit, isLoading, reload, stop, setMessages } = useChat({
    id: currentChatId || undefined,
    api: "/api/chat",
    body: {
      promptContent: activePrompt?.content,
      roleContent: activeRole ? getRole(activeRole.name)?.content : undefined,
      userProfile: isUsingProfile ? profile : undefined,
    },
    onResponse: (response) => {
      if (!response.ok) {
        console.error('Chat response error:', response.statusText)
        toast({
          title: "Error",
          description: "Failed to get response from AI. Please try again.",
          variant: "destructive"
        })
      }
    },
    onFinish: (message) => {
      if (currentChatId) {
        addMessageToChat(currentChatId, {
          role: "assistant",
          content: message.content as string,
        })
      }

      if (isScrolledToBottom) {
        scrollToBottom()
      } else {
        setShowScrollToBottom(true)
      }
    },
    onError: (error) => {
      console.error('Chat error:', error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      })
    }
  })

  const currentChat = currentChatId ? getChat(currentChatId) : null
  
  useEffect(() => {
    if (currentChatId && currentChat?.title === "New Chat" && messages.length > 0) {
      const firstUserMessage = messages.find(m => m.role === "user")
      if (firstUserMessage) {
        const newTitle = firstUserMessage.content.toString().substring(0, 30) + (firstUserMessage.content.toString().length > 30 ? "..." : "")
        updateChat(currentChatId, { title: newTitle })
      }
    }
  }, [currentChatId, currentChat, messages, updateChat])

  useEffect(() => {
    const handleScroll = () => {
      if (!chatContainerRef.current) return
      
      const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
      const isAtBottom = scrollHeight - scrollTop - clientHeight < 50
      setIsScrolledToBottom(isAtBottom)
      setShowScrollToBottom(!isAtBottom && messages.length > 0)
    }

    const container = chatContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [messages.length])

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      setShowScrollToBottom(false)
    }, 100)
  }

  useEffect(() => {
    if (promptId) {
      const prompt = getPrompt(promptId)
      if (prompt) {
        setActivePrompt({
          id: prompt.id,
          title: prompt.title,
          content: prompt.content,
          ruleIds: prompt.ruleIds,
        })
      }
    } else {
      setActivePrompt(null)
    }
  }, [promptId, getPrompt])

  const clearActivePrompt = () => {
    router.push("/dashboard")
  }

  const editPrompt = () => {
    if (activePrompt) {
      router.push(`/dashboard/prompts/edit/${activePrompt.id}`)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!input.trim()) return

    if (currentChatId) {
      addMessageToChat(currentChatId, {
        role: "user",
        content: input
      })
    }

    handleSubmit(e)
  }

  const toggleProfileUsage = () => {
    setIsUsingProfile(!isUsingProfile)
  }

  const getRuleName = (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId)
    return rule ? rule.name : "Unknown Rule"
  }

  const getRuleContent = (ruleId: string) => {
    const rule = rules.find((r) => r.id === ruleId)
    return rule ? rule.content : ""
  }

  const hasProfileData =
    profile.name ||
    profile.profession ||
    profile.expertise.length > 0 ||
    profile.interests.length > 0 ||
    profile.description

  const copyMessageToClipboard = (content: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "Copied to clipboard",
      description: "Message content has been copied to your clipboard.",
      duration: 2000,
    })
  }

  const clearChat = () => {
    setMessages([])
    toast({
      title: "Chat cleared",
      description: "Your chat history has been cleared.",
      duration: 2000,
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleFormSubmit(e as unknown as React.FormEvent)
    }
  }

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date)
  }

  const isMobile = typeof window !== "undefined" ? window.innerWidth < 768 : false

  const handleSuggestionClick = (suggestion: string) => {
    if (inputRef.current) {
      inputRef.current.value = suggestion
      handleInputChange({ target: inputRef.current } as React.ChangeEvent<HTMLTextAreaElement>)
      inputRef.current.focus()
    }
  }

  const handleRoleSelect = (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (role) {
      setActiveRole({
        id: role.id,
        name: role.name,
        content: role.content,
        expertise: role.expertise
      })
    }
  }

  const clearActiveRole = () => {
    setActiveRole(null)
  }

  // Function to add a reaction to a message
  const addReactionToMessage = (messageId: string, reaction: string) => {
    setMessageReactions(prev => {
      const currentReactions = prev[messageId] || [];
      // Toggle reaction (remove if already exists)
      const newReactions = currentReactions.includes(reaction)
        ? currentReactions.filter(r => r !== reaction)
        : [...currentReactions, reaction];
      
      return {
        ...prev,
        [messageId]: newReactions
      };
    });
  };

  // Group messages by sender
  const groupedMessages = messages.reduce((acc, message, index) => {
    const messageId = `${message.id || index}`;
    const prevMessage = index > 0 ? messages[index - 1] : null;
    const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;
    
    // Check if this is the start of a new group
    const isNewGroup = !prevMessage || prevMessage.role !== message.role || 
                       (new Date(message.createdAt || Date.now()).getTime() - 
                        new Date(prevMessage.createdAt || Date.now()).getTime() > 60000); // 1 minute gap
    
    // Check if this is the end of a group
    const isEndOfGroup = !nextMessage || nextMessage.role !== message.role || 
                        (new Date(nextMessage.createdAt || Date.now()).getTime() - 
                         new Date(message.createdAt || Date.now()).getTime() > 60000);
    
    if (isNewGroup) {
      acc.push({
        role: message.role,
        messages: [{ ...message, id: messageId, isEndOfGroup }]
      });
    } else {
      // Add to the last group
      const lastGroup = acc[acc.length - 1];
      lastGroup.messages.push({ ...message, id: messageId, isEndOfGroup });
    }
    
    return acc;
  }, [] as Array<{ role: string, messages: Array<Message & { id: string, isEndOfGroup: boolean }> }>);

  // Voice input functionality
  const startRecording = async () => {
    setRecordingError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      const audioChunks: Blob[] = [];
      
      mediaRecorder.addEventListener("dataavailable", (event) => {
        audioChunks.push(event.data);
      });
      
      mediaRecorder.addEventListener("stop", async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        
        // Convert to base64 for API transmission
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Audio = reader.result?.toString().split(',')[1];
          
          if (base64Audio) {
            try {
              // Show transcribing status
              handleInputChange({ target: { value: "Transcribing audio..." } } as any);
              
              // Call Whisper API for transcription
              const response = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audio: base64Audio }),
              });
              
              if (!response.ok) throw new Error('Transcription failed');
              
              const data = await response.json();
              handleInputChange({ target: { value: data.text } } as any);
            } catch (error) {
              console.error('Transcription error:', error);
              setRecordingError('Failed to transcribe audio');
              handleInputChange({ target: { value: "" } } as any);
              toast({
                title: "Transcription Failed",
                description: "Could not transcribe your audio. Please try again or type your message.",
                variant: "destructive"
              });
            }
          }
        };
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      });
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      setRecordingError('Microphone access denied or not available');
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Search functionality
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    } else {
      setSearchQuery("");
      setSearchResults([]);
      setCurrentSearchResult(-1);
    }
  };

  const performSearch = () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    const lowerQuery = searchQuery.toLowerCase();
    const results: number[] = [];
    
    groupedMessages.forEach((group, groupIndex) => {
      group.messages.forEach((message) => {
        if (typeof message.content === 'string' && 
            message.content.toLowerCase().includes(lowerQuery)) {
          results.push(groupIndex);
        }
      });
    });
    
    setSearchResults(results);
    setCurrentSearchResult(results.length > 0 ? 0 : -1);
    
    if (results.length > 0) {
      const messageEl = document.getElementById(`message-group-${results[0]}`);
      messageEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      toast({
        title: "No Results",
        description: `No messages found containing "${searchQuery}"`,
      });
    }
  };

  const navigateSearch = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    
    let nextResult = currentSearchResult;
    if (direction === 'next') {
      nextResult = (currentSearchResult + 1) % searchResults.length;
    } else {
      nextResult = (currentSearchResult - 1 + searchResults.length) % searchResults.length;
    }
    
    setCurrentSearchResult(nextResult);
    const messageEl = document.getElementById(`message-group-${searchResults[nextResult]}`);
    messageEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  // Export chat functionality
  const exportChat = () => {
    const exportData = {
      title: activePrompt?.title || "Chat Export",
      timestamp: new Date().toISOString(),
      messages: messages.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.createdAt
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Chat Exported",
      description: "Your conversation has been downloaded as a JSON file."
    });
  };

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const handleKeyboardShortcuts = (e: KeyboardEvent) => {
      // Don't trigger shortcuts if user is typing in an input field
      if (e.target instanceof HTMLInputElement || 
          e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      // Keyboard shortcuts
      if (e.key === '/' || (e.ctrlKey && e.key === 'f')) {
        e.preventDefault();
        toggleSearch();
      } else if (e.key === 'Escape') {
        if (isSearchOpen) {
          setIsSearchOpen(false);
        } else if (isKeyboardShortcutsOpen) {
          setIsKeyboardShortcutsOpen(false);
        }
      } else if (e.key === 'n' && messages.length > 0) {
        e.preventDefault();
        clearChat();
      } else if (e.key === 'r' && messages.length > 0) {
        e.preventDefault();
        reload();
      } else if (e.key === 'e' && messages.length > 0) {
        e.preventDefault();
        exportChat();
      } else if (e.key === '?' || (e.ctrlKey && e.key === 'h')) {
        e.preventDefault();
        setIsKeyboardShortcutsOpen(true);
      } else if (e.key === 'i') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyboardShortcuts);
    return () => window.removeEventListener('keydown', handleKeyboardShortcuts);
  }, [isSearchOpen, isKeyboardShortcutsOpen, messages.length]);

  // Add a function to toggle theme mode
  const toggleTheme = () => {
    // Simple theme toggle between system → light → dark → system
    if (theme === 'system') {
      setTheme('light')
      document.documentElement.classList.remove('dark')
    } else if (theme === 'light') {
      setTheme('dark')
      document.documentElement.classList.add('dark')
    } else {
      setTheme('system')
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      document.documentElement.classList.toggle('dark', prefersDark)
    }
  }

  return (
    <div className="w-full max-w-screen-lg mx-auto flex flex-col gap-2 h-[calc(100vh-4rem)] p-2 sm:p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-tight">OptimAIZe</h1>
          {activePrompt && (
            <Badge variant="outline" className="text-xs">
              {activePrompt.title}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="outline"
            size="sm"
            onClick={() => {
              const chatId = createChat("New Chat");
              router.push(`/dashboard?chatId=${chatId}`);
            }}
            className="flex items-center gap-1 mr-1"
            aria-label="New chat"
          >
            <Plus className="h-3.5 w-3.5" />
            New Chat
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-8 w-8">
            <Laptop className="h-4 w-4" />
            <VisuallyHidden>Toggle theme</VisuallyHidden>
          </Button>
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
                <VisuallyHidden>Settings</VisuallyHidden>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <div className="p-4 space-y-4">
                <h3 className="font-medium text-lg">Settings</h3>
                <div className="grid gap-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2">Chat Settings</h4>
                    <div className="grid gap-2">
                      {hasProfileData && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Use personal profile</span>
                          <Button
                            variant={isUsingProfile ? "default" : "outline"}
                            size="sm"
                            onClick={toggleProfileUsage}
                            disabled={!hasProfileData}
                          >
                            <User className="h-4 w-4 mr-2" />
                            {isUsingProfile ? "Enabled" : "Disabled"}
                          </Button>
                        </div>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Clear conversation</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={clearChat}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear Chat
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Prompts and Roles</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsPromptSelectorOpen(true)}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Export Prompts</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={exportPrompts}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>

      <PromptSelector
        open={isPromptSelectorOpen}
        onOpenChange={setIsPromptSelectorOpen}
        currentPromptId={activePrompt?.id}
      />

      <div className="hidden md:flex justify-between items-center">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsPromptSelectorOpen(true)}
            className="flex items-center gap-2"
            aria-label="Choose a prompt"
          >
            <FileText className="h-4 w-4" />
            {activePrompt ? "Change Prompt" : "Choose Prompt"}
          </Button>

          <Select onValueChange={handleRoleSelect} value={activeRole?.id}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.id} value={role.id}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          {activePrompt && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Using: <span className="font-medium text-foreground">{activePrompt.title}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={clearActivePrompt} aria-label="Clear active prompt">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {activeRole && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Role: <span className="font-medium text-foreground">{activeRole.name}</span>
              </span>
              <Button variant="ghost" size="sm" onClick={clearActiveRole} aria-label="Clear active role">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {activePrompt && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsMainPromptCollapsed(!isMainPromptCollapsed)}
              className="ml-1"
              aria-label="Toggle prompt visibility"
            >
              {isMainPromptCollapsed ? "Show Prompt" : "Hide Prompt"}
            </Button>
          )}

          {hasProfileData && isUsingProfile && (
            <Button variant="ghost" size="icon" className="ml-auto" aria-label="Using personal profile">
              <User className="h-4 w-4 text-primary" />
            </Button>
          )}
        </div>
      </div>

      <div className="md:hidden flex justify-between items-center">
        <Drawer open={isMobileControlsOpen} onOpenChange={setIsMobileControlsOpen}>
          <DrawerTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2" aria-label="Chat options">
              <span>Chat Options</span>
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="p-4">
            <div className="space-y-4">
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Prompt</h3>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsPromptSelectorOpen(true)
                    setIsMobileControlsOpen(false)
                  }}
                  className="w-full justify-start"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  {activePrompt ? "Change Prompt" : "Choose Prompt"}
                </Button>

                {activePrompt && (
                  <div className="flex items-center justify-between bg-muted/50 p-2 rounded-md">
                    <span className="text-sm font-medium truncate">{activePrompt.title}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        clearActivePrompt()
                        setIsMobileControlsOpen(false)
                      }}
                      aria-label="Clear active prompt"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

            {activeRole && (
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Role</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Use role</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearActiveRole}
                  >
                    <User2 className="h-4 w-4 mr-2" />
                    {activeRole.name}
                  </Button>
                </div>
              </div>
            )}

            {hasProfileData && (
              <div className="flex flex-col gap-2">
                <h3 className="font-medium">Personal Profile</h3>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Use personal profile</span>
                  <Button
                    variant={isUsingProfile ? "default" : "outline"}
                    size="sm"
                    onClick={toggleProfileUsage}
                    disabled={!hasProfileData}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {isUsingProfile ? "Enabled" : "Disabled"}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-2">
              <h3 className="font-medium">Chat Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" onClick={() => {
                  reload()
                  setIsMobileControlsOpen(false)
                }}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Regenerate
                </Button>
                <Button variant="outline" onClick={() => {
                  clearChat()
                  setIsMobileControlsOpen(false)
                }}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Chat
                </Button>
              </div>
            </div>

            <Button className="w-full" onClick={() => setIsMobileControlsOpen(false)}>
              Close
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

        {activePrompt && (
          <div className="flex items-center">
            <span className="text-sm font-medium truncate max-w-[150px]">{activePrompt.title}</span>
          </div>
        )}

        {activeRole && (
          <div className="flex items-center">
            <span className="text-sm font-medium truncate max-w-[150px]">{activeRole.name}</span>
          </div>
        )}

        {hasProfileData && isUsingProfile && (
          <Button variant="ghost" size="icon" className="ml-auto" aria-label="Using personal profile">
            <User className="h-4 w-4 text-primary" />
          </Button>
        )}
      </div>

      {activePrompt && isMainPromptCollapsed && (
        <div className="flex items-center justify-between rounded-md bg-muted/40 p-2 border border-border/50">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span className="text-xs font-medium">Using prompt: {activePrompt.title}</span>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setIsMainPromptCollapsed(false)}
            className="h-6 px-1.5 text-xs"
          >
            Show
          </Button>
        </div>
      )}

      {activePrompt && !isMainPromptCollapsed && (
        <Card className="relative border-primary/20 shadow-sm">
          <CardContent className="pt-4 pb-2 px-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                <h3 className="font-medium text-sm">Using Prompt: {activePrompt.title}</h3>
              </div>
              <div className="flex items-center gap-1">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={editPrompt} 
                  aria-label="Edit Prompt"
                  className="h-6 w-6 p-0"
                >
                  <Settings className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearActivePrompt} 
                  aria-label="Clear Prompt"
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsPromptCollapsed(!isPromptCollapsed)}
                  className="h-6 px-1.5 text-xs"
                >
                  {isPromptCollapsed ? "Show" : "Hide"}
                  <ChevronDown
                    className={cn(
                      "ml-1 h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                      !isPromptCollapsed && "rotate-180"
                    )}
                  />
                </Button>
              </div>
            </div>
            
            {!isPromptCollapsed && (
              <div className="mt-2 space-y-2">
                {activePrompt.ruleIds && activePrompt.ruleIds.length > 0 && (
                  <div className="mb-2">
                    <p className="text-sm font-medium mb-1">Applied Rules:</p>
                    <div className="flex flex-wrap gap-1 mb-2">
                      {activePrompt.ruleIds.map((ruleId) => (
                        <Badge key={ruleId} variant="outline" className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3 mr-1" aria-hidden="true" />
                          {getRuleName(ruleId)}
                        </Badge>
                      ))}
                    </div>

                    <div className="w-full border-b">
                      <button
                        type="button"
                        onClick={() => setIsRulesExpanded(!isRulesExpanded)}
                        className="flex w-full items-center justify-between py-2 text-sm font-medium transition-all hover:underline text-left"
                      >
                        View Rule Details
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200",
                            isRulesExpanded && "rotate-180"
                          )}
                        />
                      </button>
                      {isRulesExpanded && (
                        <div className="pb-2 pt-0">
                          <div className="space-y-2">
                            {activePrompt.ruleIds.map((ruleId) => (
                              <div key={ruleId} className="border rounded-md p-2">
                                <p className="font-medium text-sm">{getRuleName(ruleId)}</p>
                                <p className="text-xs whitespace-pre-wrap">{getRuleContent(ruleId)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="rounded-md bg-muted p-3 text-sm" aria-label="Prompt content">
                  <pre className="whitespace-pre-wrap font-sans">{activePrompt.content}</pre>
                </div>
              </div>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {isPromptCollapsed 
                ? "This prompt is being used as context." 
                : "This prompt will be used as context for the AI."}
            </p>
          </CardContent>
        </Card>
      )}

      {isUsingProfile && hasProfileData && (
        <Card className="bg-muted/30 border-dashed shadow-sm">
          <CardContent className="py-2 px-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" aria-hidden="true" />
                <h3 className="text-sm font-medium">Personal Profile</h3>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsProfileCollapsed(!isProfileCollapsed)}
                className="h-6 px-1.5 text-xs"
              >
                {isProfileCollapsed ? "Show" : "Hide"}
                <ChevronDown
                  className={cn(
                    "ml-1 h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                    !isProfileCollapsed && "rotate-180"
                  )}
                />
              </Button>
            </div>
            {!isProfileCollapsed && (
              <div className="mt-2 text-sm">
                {profile.name && <p><strong>Name:</strong> {profile.name}</p>}
                {profile.profession && <p><strong>Profession:</strong> {profile.profession}</p>}
                {profile.expertise?.length > 0 && <p><strong>Expertise:</strong> {profile.expertise.join(", ")}</p>}
                {profile.interests?.length > 0 && <p><strong>Interests:</strong> {profile.interests.join(", ")}</p>}
                {profile.description && <p><strong>Description:</strong> {profile.description}</p>}
              </div>
            )}
            {isProfileCollapsed && (
              <p className="text-xs text-muted-foreground">
                Using your profile to personalize responses.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <Card
        className="h-[calc(100vh-220px)] md:h-[calc(100vh-220px)] relative overflow-hidden"
      >
        <div className="flex flex-col h-full">
          <VisuallyHidden>
            <h2 id="chat-messages-heading">Chat Messages</h2>
          </VisuallyHidden>
          
          <div className="flex-1 overflow-hidden relative">
            <ScrollArea 
              className="h-full py-2 px-4" 
              aria-labelledby="chat-messages-heading"
              ref={chatContainerRef}
            >
              <div className="flex flex-col gap-3">
                {messages.length === 0 ? (
                  <div>
                    <div className="text-center py-8 space-y-2">
                      <h3 className="text-lg font-medium">Welcome to OptimAIZe</h3>
                      <p className="text-sm text-muted-foreground">
                        {activePrompt
                          ? "Start a conversation with AI using your selected prompt."
                          : "Start a conversation with AI to get help with your tasks."}
                      </p>
                    </div>
                    <ChatSuggestions onSuggestionClick={handleSuggestionClick} />
                  </div>
                ) : (
                  groupedMessages.map((group, groupIndex) => (
                    <div 
                      id={`message-group-${groupIndex}`}
                      key={groupIndex} 
                      className={`message-container ${group.role === 'user' ? 'user' : 'ai'} ${
                        searchResults.includes(groupIndex) && currentSearchResult === searchResults.indexOf(groupIndex)
                          ? 'ring-2 ring-primary ring-offset-2'
                          : searchResults.includes(groupIndex)
                          ? 'ring-1 ring-primary'
                          : ''
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-xs font-medium">{group.role === 'user' ? 'You' : 'AI'}</p>
                        <div className="text-xs text-muted-foreground">
                          {formatTime(new Date(group.messages[0].createdAt || Date.now()))}
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        {group.role === 'user' ? (
                          <User2 className="h-5 w-5 text-muted-foreground mt-1 order-last flex-shrink-0" />
                        ) : (
                          <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                        )}
                        <div className="flex flex-col">
                          {group.messages.map((message, messageIndex) => (
                            <div key={`${message.id}-${messageIndex}`} className="mb-1 last:mb-0">
                              <div className={`${group.role === 'user' ? 'user-message-bubble' : 'ai-message-bubble'}`}>
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                  <MessageContent 
                                    content={typeof message.content === 'string' ? message.content : ''} 
                                    isAssistant={group.role === 'assistant'}
                                  />
                                </div>
                              </div>
                              
                              {/* Only show these buttons on the last message of a group */}
                              {message.isEndOfGroup && (
                                <div className="flex gap-1 mt-1">
                                  {group.role === 'assistant' && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => copyMessageToClipboard(message.content as string)}
                                      className="h-6 w-6 p-0"
                                      aria-label="Copy message text"
                                    >
                                      <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                                    </Button>
                                  )}
                                  <div className="flex gap-1">
                                    {['👍', '❤️', '😂', '💡'].map((reaction) => (
                                      <Button
                                        key={reaction}
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => addReactionToMessage(message.id, reaction)}
                                        className={`h-6 w-6 p-0 ${messageReactions[message.id]?.includes(reaction) ? 'bg-muted text-primary' : ''}`}
                                        aria-label={`React with ${reaction}`}
                                      >
                                        <span className="text-xs">{reaction}</span>
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Display reactions if any */}
                              {messageReactions[message.id]?.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {messageReactions[message.id].map((reaction, i) => (
                                    <span key={i} className="text-xs bg-muted rounded-full px-1.5 py-0.5">
                                      {reaction} {messageReactions[message.id].filter(r => r === reaction).length > 1 && 
                                        messageReactions[message.id].filter(r => r === reaction).length}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))
                )}
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="message-container ai">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-xs font-medium">AI</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <Bot className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div className="ai-message-bubble p-3">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Thinking...</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {showScrollToBottom && (
              <Button
                variant="secondary"
                size="sm"
                className="absolute bottom-4 right-4 rounded-full shadow-md"
                onClick={scrollToBottom}
                aria-label="Scroll to bottom"
              >
                <ChevronDown className="h-4 w-4 mr-1" />
                New message
              </Button>
            )}
          </div>
          
          <div className="p-3 border-t">
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Textarea
                  ref={inputRef}
                  placeholder="Type your message here..."
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  className="min-h-[50px] max-h-[120px] flex-1 resize-none"
                  aria-label="Message input"
                />
                <div className="flex flex-col gap-2">
                  <Button 
                    type="submit" 
                    size="icon" 
                    disabled={isLoading || !input.trim()} 
                    aria-label="Send message"
                    className="flex-1"
                  >
                    <Send className="h-4 w-4" aria-hidden="true" />
                  </Button>
                  
                  <Popover open={isAttachmentPopoverOpen} onOpenChange={setIsAttachmentPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon" 
                        aria-label="Add attachment"
                        className="flex-1"
                      >
                        <Paperclip className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent side="top" align="end" className="w-56">
                      <div className="space-y-2">
                        <h3 className="font-medium text-sm">Add to your message</h3>
                        <div className="grid grid-cols-2 gap-2">
                          <Button variant="outline" size="sm" className="justify-start">
                            <Paperclip className="h-4 w-4 mr-2" />
                            File
                          </Button>
                          <Button variant="outline" size="sm" className="justify-start">
                            <Smile className="h-4 w-4 mr-2" />
                            Emoji
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex justify-between items-center px-1">
                <p className="text-xs text-muted-foreground">
                  Enter to send, Shift+Enter for new line
                </p>
                {isLoading && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    onClick={stop}
                    className="h-5 px-2 text-xs"
                  >
                    Stop generating
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </Card>

      {/* Keyboard shortcuts dialog */}
      <Dialog open={isKeyboardShortcutsOpen} onOpenChange={setIsKeyboardShortcutsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
            <DialogDescription>
              These shortcuts help you navigate and use the chat more efficiently.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid grid-cols-2 items-center gap-4">
              <div className="flex items-center gap-2">
                <kbd className="px-2 py-1 bg-muted rounded text-xs">/</kbd>
                <span>or</span>
                <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+F</kbd>
              </div>
              <span>Search messages</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">i</kbd>
              <span>Focus on input box</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">n</kbd>
              <span>New chat</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">r</kbd>
              <span>Reload/regenerate response</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">e</kbd>
              <span>Export conversation</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">?</kbd>
              <span>Show this help dialog</span>
            </div>
            <div className="grid grid-cols-2 items-center gap-4">
              <kbd className="px-2 py-1 bg-muted rounded text-xs">Esc</kbd>
              <span>Close dialogs</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search bar */}
      {isSearchOpen && (
        <div className="absolute top-0 left-0 right-0 z-10 bg-background border-b p-2 flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') performSearch();
              if (e.key === 'Escape') setIsSearchOpen(false);
              if (e.key === 'ArrowDown') navigateSearch('next');
              if (e.key === 'ArrowUp') navigateSearch('prev');
            }}
            placeholder="Search messages..."
            className="flex-1 bg-transparent border-none focus:outline-none text-sm"
            autoFocus
          />
          {searchResults.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              {currentSearchResult + 1}/{searchResults.length}
            </div>
          )}
          <div className="flex items-center gap-1">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => navigateSearch('prev')}
              disabled={searchResults.length === 0}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={() => navigateSearch('next')}
              disabled={searchResults.length === 0}
            >
              <ChevronDown className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setIsSearchOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}


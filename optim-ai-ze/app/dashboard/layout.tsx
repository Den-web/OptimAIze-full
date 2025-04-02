import type React from "react"
import { Sidebar } from "@/components/sidebar"
import { MobileNav } from "@/components/mobile-nav"
import { PromptProvider } from "@/context/prompt-context"
import { RuleProvider } from "@/context/rule-context"
import { UserProvider } from "@/context/user-context"
import { RoleProvider } from "@/context/role-context"
import { ChatProvider } from "@/context/chat-context"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <RuleProvider>
        <PromptProvider>
          <RoleProvider>
            <ChatProvider>
              <div className="flex min-h-screen flex-col">
                <header>
                  <MobileNav />
                </header>
                <div className="flex flex-1">
                  <Sidebar className="hidden md:flex" />
                  <main id="main-content" className="flex-1 p-6 md:p-8" tabIndex={-1}>
                    {children}
                  </main>
                </div>
              </div>
            </ChatProvider>
          </RoleProvider>
        </PromptProvider>
      </RuleProvider>
    </UserProvider>
  )
}


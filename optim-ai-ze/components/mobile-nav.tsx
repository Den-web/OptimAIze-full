"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, MessageSquare, PlusCircle, Settings, BookOpen, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { useUser } from "@/context/user-context"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { profile } = useUser()

  const hasProfileData =
    profile.name ||
    profile.profession ||
    profile.expertise.length > 0 ||
    profile.interests.length > 0 ||
    profile.description

  const navItems = [
    { href: "/dashboard", label: "Chat", icon: MessageSquare },
    { href: "/dashboard/prompts", label: "Prompts", icon: PlusCircle },
    { href: "/dashboard/rules", label: "Rules", icon: BookOpen },
    { href: "/dashboard/roles", label: "Roles", icon: Users },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="flex items-center justify-between p-4 md:hidden border-b">
      <Link href="/dashboard" className="font-semibold text-xl flex items-center gap-2">
        <span className="bg-primary text-primary-foreground rounded-md p-1">
          <MessageSquare className="h-5 w-5" />
        </span>
        OptimAIze
      </Link>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Open navigation menu">
            <Menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 flex flex-col">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <Link
                href="/dashboard"
                className="font-semibold text-xl flex items-center gap-2"
                onClick={() => setOpen(false)}
              >
                <span className="bg-primary text-primary-foreground rounded-md p-1">
                  <MessageSquare className="h-5 w-5" />
                </span>
                OptimAIze
              </Link>
              <Button variant="ghost" size="icon" onClick={() => setOpen(false)} aria-label="Close navigation menu">
                <X className="h-6 w-6" aria-hidden="true" />
              </Button>
            </div>

            {hasProfileData && (
              <div className="mt-4 p-3 bg-muted/50 rounded-lg flex items-center gap-3">
                <div className="bg-primary text-primary-foreground rounded-full p-2">
                  <User className="h-5 w-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-medium truncate">{profile.name || "User"}</p>
                  <p className="text-sm text-muted-foreground truncate">
                    {profile.profession || "Set up your profile"}
                  </p>
                </div>
              </div>
            )}
          </div>

          <nav className="flex-1 overflow-auto p-4">
            <ul className="space-y-2" role="list">
              {navItems.map((item) => {
                const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href)

                return (
                  <li key={item.href} role="listitem">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                        isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted",
                      )}
                      aria-current={isActive ? "page" : undefined}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          <div className="p-4 border-t text-center">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} OptimAIze</p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}


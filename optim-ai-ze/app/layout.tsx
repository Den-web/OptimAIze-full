import type React from "react"
import { ThemeProvider } from "@/components/theme-provider"
import { SkipLink } from "@/components/skip-link"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { RoleProvider } from "@/context/role-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OptimAIze",
  description: "AI Prompt Creation & Chat Application",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <RoleProvider>
            <SkipLink />
            {children}
          </RoleProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/components/auth-provider"
import { Sidebar } from "@/components/sidebar"
import { AssessmentRedirect } from "@/components/assessment-redirect"
import { SidebarLayout } from "@/components/sidebar-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "LinguaLearn - Language Learning App",
  description: "Learn languages with fun, bite-sized lessons",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <AuthProvider>
            <AssessmentRedirect>
              <div className="flex min-h-screen">
                <Sidebar />
                <SidebarLayout>
                  {children}
                </SidebarLayout>
              </div>
            </AssessmentRedirect>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

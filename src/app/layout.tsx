import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Toaster } from "sonner"
import { ThemeProvider } from "next-themes"

import "./globals.css"
import { Navbar } from "@/components/shared/Navbar"
import { Footer } from "@/components/shared/Footer"
import { AuthProvider } from "@/components/features/auth/AuthProvider"
import { LoginModal } from "@/components/features/auth/LoginModal"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "Jagat News - Portal Berita Terdepan",
    template: "%s | Jagat News",
  },
  description:
    "Portal berita terdepan yang menyajikan informasi akurat, terkini, dan terpercaya dari seluruh dunia.",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://jagatnews.com",
    siteName: "Jagat News",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background antialiased flex flex-col`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
            <LoginModal />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

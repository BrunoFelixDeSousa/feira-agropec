import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import type React from "react"

import { ConditionalFooter } from "@/components/conditional-footer"
import { InstallPWA } from "@/components/install-pwa"
import Navbar from "@/components/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { FavoritesProvider } from "@/lib/favorites"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Feira Agropecuária de Paragominas",
  description: "Site oficial da Feira Agropecuária de Paragominas - AGROPEC",
  // manifest: "/manifest.json"
}

export const viewport: Viewport = {
  themeColor: "#4CAF50",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.svg" />
        <link rel="icon" href="/icons/apple-touch-icon.svg" />
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <FavoritesProvider>
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1 pb-4">{children}</main>
              <ConditionalFooter />
            </div>
            <Toaster />
            <InstallPWA />
          </FavoritesProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

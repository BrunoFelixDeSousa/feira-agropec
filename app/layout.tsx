import type { Metadata, Viewport } from "next"
import { Montserrat } from "next/font/google"
import type React from "react"

import { ConditionalFooter } from "@/components/conditional-footer"
import { InstallPWA } from "@/components/install-pwa"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { FavoritesProvider } from "@/lib/favorites"
import "./globals.css"

const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "AGROPEC 2025 - Feira Agropecuária de Paragominas",
  description:
    "58ª Exposição Estadual dos Produtores do Campo. Cultivando o Futuro, Valorizando Nossas Raízes. 09 a 17 de Agosto de 2025 em Paragominas - PA.",
  manifest: "/manifest.json",
  keywords: [
    "AGROPEC",
    "Feira Agropecuária",
    "Paragominas",
    "Pará",
    "Agronegócio",
    "Pecuária",
    "Agricultura",
    "Exposição",
    "2025",
  ],
  authors: [{ name: "Sindicato dos Produtores Rurais de Paragominas" }],
  creator: "Sindicato dos Produtores Rurais de Paragominas",
  publisher: "AGROPEC 2025",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: "https://feira-agropec.vercel.app",
  },
  openGraph: {
    title: "AGROPEC 2025 - Feira Agropecuária de Paragominas",
    description: "58ª Exposição Estadual dos Produtores do Campo. Cultivando o Futuro, Valorizando Nossas Raízes.",
    url: "https://feira-agropec.vercel.app",
    siteName: "AGROPEC 2025",
    locale: "pt_BR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AGROPEC 2025 - Feira Agropecuária de Paragominas",
    description: "58ª Exposição Estadual dos Produtores do Campo. Cultivando o Futuro, Valorizando Nossas Raízes.",
  },
}

export const viewport: Viewport = {
  themeColor: "#1E4844",
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
    <html lang="pt-BR" suppressHydrationWarning className={montserrat.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="format-detection" content="telephone=no" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
        <link rel="icon" href="/logo-agropec.png" />
      </head>
      <body className={montserrat.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <FavoritesProvider>
            <div className="flex min-h-screen flex-col">
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

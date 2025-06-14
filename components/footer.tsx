"use client"

import { useMobile } from "@/hooks/use-mobile"
import { Facebook, Instagram, Twitter } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

// Tipo para as configurações do site
type SiteSettings = {
  siteName: string
  contactEmail?: string | null
  contactPhone?: string | null
  address?: string | null
  socialFacebook?: string | null
  socialInstagram?: string | null
  socialTwitter?: string | null
}

function FooterCopyright() {
  return (
    <div className="mt-0 mb-20 pt-2 px-2 border-t text-center text-sm text-muted-foreground flex justify-between items-center">
      <p>&copy; {new Date().getFullYear()} Feira Agropecuária de Paragominas</p>
      <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
        Área Administrativa
      </Link>
    </div>
  )
}

export default function Footer() {
  const isMobile = useMobile()
  const [settings, setSettings] = useState<SiteSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function loadSettings() {
      try {
        const response = await fetch('/api/settings')
        const data = await response.json()
        
        if (data.success) {
          setSettings(data.data)
        }
      } catch (error) {
        console.error("Erro ao carregar configurações:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  return (
    <>
      {isMobile ? <FooterCopyright /> : (
        <footer className="w-full border-t bg-background">
          <div className="container py-10">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">
                  {isLoading ? "Carregando..." : settings?.siteName || "Feira AGROPEC"}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  A maior feira agropecuária de Paragominas, reunindo tecnologia, inovação e tradição do agronegócio em um
                  só lugar.
                </p>
                <div className="flex space-x-4">
                  {settings?.socialFacebook && (
                    <Link href={settings.socialFacebook} className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
                      <Facebook className="h-5 w-5" />
                      <span className="sr-only">Facebook</span>
                    </Link>
                  )}
                  {settings?.socialInstagram && (
                    <Link href={settings.socialInstagram} className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
                      <Instagram className="h-5 w-5" />
                      <span className="sr-only">Instagram</span>
                    </Link>
                  )}
                  {settings?.socialTwitter && (
                    <Link href={settings.socialTwitter} className="text-muted-foreground hover:text-foreground" target="_blank" rel="noopener noreferrer">
                      <Twitter className="h-5 w-5" />
                      <span className="sr-only">Twitter</span>
                    </Link>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Links Rápidos</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/" className="text-muted-foreground hover:text-foreground">
                      Início
                    </Link>
                  </li>
                  <li>
                    <Link href="/mapa" className="text-muted-foreground hover:text-foreground">
                      Mapa Interativo
                    </Link>
                  </li>
                  <li>
                    <Link href="/programacao" className="text-muted-foreground hover:text-foreground">
                      Programação
                    </Link>
                  </li>
                  <li>
                    <Link href="/expositores" className="text-muted-foreground hover:text-foreground">
                      Expositores
                    </Link>
                  </li>
                  <li>
                    <Link href="/notificacoes" className="text-muted-foreground hover:text-foreground">
                      Notificações
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Contato</h3>
                <address className="not-italic text-sm text-muted-foreground space-y-2">
                  {isLoading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  ) : (
                    <>
                      <p>{settings?.address || "Parque de Exposições de Paragominas"}</p>
                      <p>Paragominas - PA</p>
                      <p>CEP: 68625-000</p>
                      <p>Email: {settings?.contactEmail || ""}</p>
                      <p>Tel: {settings?.contactPhone || ""}</p>
                    </>
                  )}
                </address>
              </div>
            </div>

            <FooterCopyright />
          </div>
        </footer>
      )}
    </>
    
  )
}

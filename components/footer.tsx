"use client"

import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"
import { useMobile } from "@/hooks/use-mobile"

export default function Footer() {
  const isMobile = useMobile()

  // Em dispositivos móveis, não exibimos o footer para economizar espaço
  if (isMobile) {
    return null
  }

  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Feira AGROPEC</h3>
            <p className="text-sm text-muted-foreground mb-4">
              A maior feira agropecuária de Paragominas, reunindo tecnologia, inovação e tradição do agronegócio em um
              só lugar.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-foreground">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
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
            <h3 className="text-lg font-semibold mb-4">Informações</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre" className="text-muted-foreground hover:text-foreground">
                  Sobre a Feira
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-muted-foreground hover:text-foreground">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/como-chegar" className="text-muted-foreground hover:text-foreground">
                  Como Chegar
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                  Perguntas Frequentes
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Contato</h3>
            <address className="not-italic text-sm text-muted-foreground space-y-2">
              <p>Parque de Exposições de Paragominas</p>
              <p>Paragominas - PA</p>
              <p>CEP: 68625-000</p>
              <p>Email: contato@agropec.com.br</p>
              <p>Tel: (91) 9999-9999</p>
            </address>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} Feira Agropecuária de Paragominas. Todos os direitos reservados.</p>
          <Link href="/admin" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
            Área Administrativa
          </Link>
        </div>
      </div>
    </footer>
  )
}

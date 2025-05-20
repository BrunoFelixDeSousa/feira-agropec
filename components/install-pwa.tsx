"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

export function InstallPWA() {
  const [isInstallable, setIsInstallable] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIOS, setIsIOS] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    // Detectar se é iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    setIsIOS(isIOSDevice)

    // Evento para detectar se o app pode ser instalado
    window.addEventListener("beforeinstallprompt", (e) => {
      // Prevenir o comportamento padrão
      e.preventDefault()
      // Armazenar o evento para uso posterior
      setDeferredPrompt(e)
      // Atualizar UI para mostrar que o app pode ser instalado
      setIsInstallable(true)
    })

    // Limpar evento
    return () => {
      window.removeEventListener("beforeinstallprompt", () => {})
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    // Mostrar o prompt de instalação
    deferredPrompt.prompt()

    // Aguardar a resposta do usuário
    const { outcome } = await deferredPrompt.userChoice

    // Limpar o prompt armazenado
    setDeferredPrompt(null)
    setIsInstallable(false)
  }

  if (!isInstallable && !isIOS) return null

  if (isIOS) {
    return (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Download className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-green-600 rounded-full"></span>
            <span className="sr-only">Instalar App</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[90vw] rounded-lg">
          <DialogHeader>
            <DialogTitle>Instalar o App da Feira</DialogTitle>
            <DialogDescription>Para instalar no seu iPhone ou iPad:</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <p>
              1. Toque no ícone <span className="px-1 py-0.5 rounded bg-muted">Compartilhar</span>
            </p>
            <p>
              2. Role e toque em <span className="px-1 py-0.5 rounded bg-muted">Adicionar à Tela de Início</span>
            </p>
            <p>
              3. Toque em <span className="px-1 py-0.5 rounded bg-muted">Adicionar</span>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Button variant="ghost" size="icon" onClick={handleInstallClick} className="relative">
      <Download className="h-5 w-5" />
      <span className="absolute top-0 right-0 h-2 w-2 bg-green-600 rounded-full"></span>
      <span className="sr-only">Instalar App</span>
    </Button>
  )
}

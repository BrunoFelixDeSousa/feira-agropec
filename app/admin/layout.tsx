"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { LogoutButton } from "@/components/admin/logout-button"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getSession } from "@/lib/auth-actions"
import { paths } from "@/lib/paths"

type SessionType = {
  userId: string
  email: string
  name: string
  role: string
} | null

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<SessionType>(null)

  useEffect(() => {
    async function checkAuth() {
      // Não redirecionar se já estiver na página de login
      if (pathname === paths.admin.login) {
        setIsLoading(false)
        return
      }

      try {
        // Verificar autenticação usando server action
        const userSession = await getSession()
        setSession(userSession)

        if (!userSession) {
          router.push(paths.admin.login)
        }
      } catch (error) {
        console.error("Erro ao verificar sessão:", error)
        router.push(paths.admin.login)
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router, pathname])

  // Se estiver na página de login, renderizar diretamente o conteúdo
  if (pathname === paths.admin.login) {
    return children
  }

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex min-h-screen min-w-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Verificando autenticação...</h2>
          <p className="text-muted-foreground">Você será redirecionado em instantes.</p>
        </div>
      </div>
    )
  }

  // Se não estiver autenticado e não estiver na página de login, mostrar tela de carregamento
  if (!session && pathname !== paths.admin.login) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Verificando autenticação...</h2>
          <p className="text-muted-foreground">Você será redirecionado em instantes.</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          {/* Botão de menu para mobile */}
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-3">
            <Link href={paths.admin.root} className="flex items-center gap-2">
              <Image src="/logo-agropec.png?height=32&width=32" alt="Logo" width={32} height={32} className="h-8 w-8" />
              <span className="font-semibold hidden sm:inline-block">Admin Feira Agropecuária</span>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {session && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:inline-block">{session.name}</span>
                <LogoutButton />
                <Button asChild variant="outline" size="sm" className="h-8">
                  <Link href={paths.site.home}>Visualizar Site</Link>
                </Button>
              </div>
            )}
          </div>
        </header>
        <div className="flex-1 flex">
          <AdminSidebar />
          <main className="flex w-full flex-col overflow-hidden">
            <ScrollArea className="h-[calc(100vh-3.5rem)]">
              <div className="flex-1 space-y-4 p-5 pt-3">{children}</div>
            </ScrollArea>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

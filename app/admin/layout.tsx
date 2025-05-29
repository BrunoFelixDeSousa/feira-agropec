"use client"

import type React from "react"

import { LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { Button } from "@/components/ui/button"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { getSession, isAuthenticated, logout } from "@/lib/auth"
import { paths } from "@/lib/paths"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)
  const [session, setSession] = useState<ReturnType<typeof getSession> | null>(null)

  useEffect(() => {
    // Não redirecionar se já estiver na página de login
    if (pathname === paths.admin.login) {
      setIsLoading(false)
      return
    }

    // Verificar autenticação
    const userSession = getSession()
    setSession(userSession)

    if (!isAuthenticated()) {
      router.push(paths.admin.login)
    }

    setIsLoading(false)
  }, [router, pathname])

  // Se estiver na página de login, renderizar diretamente o conteúdo
  if (pathname === paths.admin.login) {
    return children
  }

  // Mostrar tela de carregamento enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
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
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Verificando autenticação...</h2>
          <p className="text-muted-foreground">Você será redirecionado em instantes.</p>
        </div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:px-6">
          {/* Botão de menu para mobile */}
          <SidebarTrigger className="md:hidden" />
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/placeholder.svg?height=32&width=32" alt="Logo" width={32} height={32} className="h-8 w-8" />
              <span className="font-semibold hidden sm:inline-block">Admin Feira Agropecuária</span>
            </Link>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {session && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground hidden sm:inline-block">{session.user.name}</span>
                <Button variant="ghost" size="sm" onClick={logout} className="h-8 gap-1 px-2">
                  <LogOut size={16} />
                  <span className="hidden sm:inline-block">Sair</span>
                </Button>
                <Button asChild variant="outline" size="sm" className="h-8">
                  <Link href="/">Visualizar Site</Link>
                </Button>
              </div>
            )}
          </div>
        </header>
        <div className="flex-1 flex">
          <AdminSidebar />
          <main className="flex w-full flex-col overflow-hidden">
            {/* <ScrollArea className="h-[calc(100vh-3.5rem)]"> */}
              <div className="flex-1 space-y-4 p-5 pt-6">{children}</div>
            {/* </ScrollArea> */}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}

"use client"

import { Bell, CalendarDays, Home, ImageIcon, LayoutDashboard, Settings, User, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { paths } from "@/lib/paths"

export function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    // Caso especial para o Dashboard (raiz do admin)
    if (path === paths.admin.root) {
      return pathname === path
    }
    // Para outros itens, verificar se o caminho começa com o path do item
    return pathname === path || pathname.startsWith(`${path}/`)
  }  // Função para aplicar estilos adicionais aos itens do menu ativos
  const getMenuButtonClass = (path: string) => {
    if (isActive(path)) {
      return "transition-colors duration-200 hover:bg-green-500/20 hover:text-green-600 hover:font-bold bg-green-500/10 text-green-600 font-medium"
    }
    return "transition-colors duration-200 hover:bg-green-500/20 hover:text-green-600 hover:font-bold"
  }
  
  // Função para aplicar estilos aos ícones dos itens ativos
  const getIconClass = (path: string) => {
    if (isActive(path)) {
      return "group-hover:scale-110 group-hover:text-green-600 transition-transform duration-200 text-green-600"
    }
    return "group-hover:scale-110 group-hover:text-green-600 transition-transform duration-200"
  }

  return (
    <Sidebar className="mt-4">
      <SidebarHeader>
        <SidebarTrigger />
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(paths.admin.root)} className={`group ${getMenuButtonClass(paths.admin.root)}`}>
              <Link href={paths.admin.root}>
                <LayoutDashboard className={`h-4 w-4 ${getIconClass(paths.admin.root)}`} />
                <span>Dashboard</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(paths.admin.expositores)} className={`group ${getMenuButtonClass(paths.admin.expositores)}`}>
              <Link href={paths.admin.expositores}>
                <Users className={`h-4 w-4 ${getIconClass(paths.admin.expositores)}`} />
                <span>Expositores</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(paths.admin.eventos)} className={`group ${getMenuButtonClass(paths.admin.eventos)}`}>
              <Link href={paths.admin.eventos}>
                <CalendarDays className={`h-4 w-4 ${getIconClass(paths.admin.eventos)}`} />
                <span>Eventos</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(paths.admin.notificacoes)} className={`group ${getMenuButtonClass(paths.admin.notificacoes)}`}>
              <Link href={paths.admin.notificacoes}>
                <Bell className={`h-4 w-4 ${getIconClass(paths.admin.notificacoes)}`} />
                <span>Notificações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          {/* <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(paths.admin.mapa)} className={`group ${getMenuButtonClass(paths.admin.mapa)}`}>
              <Link href={paths.admin.mapa}>
                <Map className={`h-4 w-4 ${getIconClass(paths.admin.mapa)}`} />
                <span>Mapa</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem> */}
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(paths.admin.carousel)} className={`group ${getMenuButtonClass(paths.admin.carousel)}`}>
              <Link href={paths.admin.carousel}>
                <ImageIcon className={`h-4 w-4 ${getIconClass(paths.admin.carousel)}`} />
                <span>Carousel</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(paths.admin.configuracoes)} className={`group ${getMenuButtonClass(paths.admin.configuracoes)}`}>
              <Link href={paths.admin.configuracoes}>
                <Settings className={`h-4 w-4 ${getIconClass(paths.admin.configuracoes)}`} />
                <span>Configurações</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mb-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={isActive(paths.admin.perfil)} className={`group ${getMenuButtonClass(paths.admin.perfil)}`}>
              <Link href={paths.admin.perfil}>
                <User className={`h-4 w-4 ${getIconClass(paths.admin.perfil)}`} />
                <span>Meu Perfil</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="group transition-colors duration-200 hover:bg-green-500/20 hover:text-green-600 hover:font-bold">
              <Link href="/">
                <Home className="h-4 w-4 group-hover:scale-110 group-hover:text-green-600 transition-transform duration-200" />
                <span>Voltar ao Site</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

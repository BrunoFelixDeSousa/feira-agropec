"use client"
import { InstallPWA } from "@/components/install-pwa"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { paths } from "@/lib/paths"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { Bell, Calendar, Heart, Home, MapPin, Menu, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

export default function Navbar() {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Detectar se é mobile com base na largura da tela
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  // Detectar scroll para mudar o estilo da navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const routes = [
    { href: paths.site.home, label: "Início", icon: Home },
    { href: paths.site.mapa, label: "Mapa", icon: MapPin },
    { href: paths.site.programacao, label: "Agenda", icon: Calendar },
    { href: paths.site.expositores, label: "Expositores", icon: Users },
    { href: paths.site.favoritos, label: "Favoritos", icon: Heart },
    { href: paths.site.notificacoes, label: "Alertas", icon: Bell },
  ]

  return (
    <>
      {/* Cabeçalho para desktop e mobile */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full border-b transition-all duration-200",
          isScrolled ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" : "bg-background",
        )}
      >
        <div className="container mx-auto flex h-14 lg:h-16 items-center px-4">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Image
              src="/logo-agropec.png"
              alt="AGROPEC 2025"
              width={40}
              height={40}
              className="h-8 w-8 lg:h-10 lg:w-10"
            />
            <div className="flex flex-col">
              <span className="text-primary text-sm lg:text-base font-black">AGROPEC</span>
              <span className="text-secondary text-[10px] lg:text-xs font-medium -mt-1">2025</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex ml-10 space-x-1">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors relative",
                  pathname === route.href
                    ? "text-primary bg-primary/10"
                    : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                )}
              >
                <div className="flex items-center gap-2">
                  <route.icon className="h-4 w-4" />
                  {route.label}
                </div>
                {pathname === route.href && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="navbar-indicator-desktop"
                    transition={{ type: "spring", duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block">
              <ModeToggle />
            </div>
            <InstallPWA />

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[250px] sm:w-[300px] pt-10">
                  <nav className="flex flex-col gap-4">
                    {routes.map((route) => (
                      <Link
                        key={route.href}
                        href={route.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                          pathname === route.href
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:text-primary hover:bg-primary/5",
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <route.icon className="h-5 w-5" />
                        {route.label}
                      </Link>
                    ))}
                    <div className="mt-4 pt-4 border-t">
                      <ModeToggle />
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Navegação por abas na parte inferior - apenas para mobile */}
      <nav className="fixed bottom-0 left-0 z-50 w-full h-16 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 safe-area-bottom lg:hidden">
        <div className="grid h-full grid-cols-6 max-w-md mx-auto">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 text-xs font-medium relative",
                pathname === route.href ? "text-primary" : "text-muted-foreground hover:text-primary",
              )}
            >
              {pathname === route.href && (
                <motion.span
                  className="absolute inset-x-0 -top-[13px] mx-auto h-1 w-12 bg-primary rounded-full"
                  layoutId="navbar-indicator"
                  transition={{ type: "spring", duration: 0.5 }}
                />
              )}
              <route.icon className="h-5 w-5" />
              {route.label}
            </Link>
          ))}
        </div>
      </nav>

      {/* Espaçador para compensar a navegação fixa na parte inferior - apenas para mobile */}
      <div className="h-4 lg:h-0"></div>
    </>
  )
}

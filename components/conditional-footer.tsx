"use client"

import { usePathname } from "next/navigation"
import Footer from "./footer"

export function ConditionalFooter() {
  const pathname = usePathname()

  // Não renderiza o footer em páginas administrativas
  if (pathname.startsWith("/admin")) {
    return null
  }

  return <Footer />
}

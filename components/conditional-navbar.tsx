"use client"

import { usePathname } from "next/navigation"
import Navbar from "./navbar"

export function ConditionalNavbar() {
  const pathname = usePathname()

  // Não renderiza o navbar em páginas administrativas
  if (pathname.startsWith("/admin")) {
    return null
  }

  return <Navbar />
}

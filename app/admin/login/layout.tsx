import type { Metadata } from "next"
import type React from "react"

export const metadata: Metadata = {
  title: "Login Administrativo | Feira Agropecuária",
  description: "Acesso à área administrativa da Feira Agropecuária",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="min-h-screen flex flex-col">{children}</div>
}

"use client"

// Simulação de um sistema de autenticação
// Em produção, use um sistema real como NextAuth.js

import { paths } from "@/lib/paths"

type User = {
  id: string
  name: string
  email: string
  role: "admin" | "editor"
}

export type Session = {
  user: User
  expires: string
}

// Usuários de exemplo
const users = [
  {
    id: "1",
    name: "Administrador",
    email: "admin@feira.com",
    password: "admin123",
    role: "admin" as const,
  },
  {
    id: "2",
    name: "Editor",
    email: "editor@feira.com",
    password: "editor123",
    role: "editor" as const,
  },
]

export function login(email: string, password: string): boolean {
  const user = users.find((u) => u.email === email && u.password === password)

  if (user) {
    // Criar sessão
    const session = {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
    }

    // Armazenar no localStorage
    localStorage.setItem("admin-session", JSON.stringify(session))
    return true
  }

  return false
}

export function logout(): void {
  localStorage.removeItem("admin-session")
  window.location.href = paths.admin.login
}

export function getSession(): Session | null {
  if (typeof window === "undefined") {
    return null
  }

  const saved = localStorage.getItem("admin-session")
  if (!saved) {
    return null
  }

  try {
    const session = JSON.parse(saved) as Session

    // Verificar se a sessão expirou
    if (new Date(session.expires) < new Date()) {
      logout()
      return null
    }

    return session
  } catch (e) {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getSession() !== null
}

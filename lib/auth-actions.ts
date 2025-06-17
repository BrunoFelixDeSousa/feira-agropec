"use server"

import { compare } from "bcryptjs"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { getUserByEmail } from "./db"

const secretKey = process.env.JWT_SECRET || "feira-agropec-secret-key-2025"
const key = new TextEncoder().encode(secretKey)

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(key)
}

export async function decrypt(input: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    })
    return payload
  } catch (error) {
    return null
  }
}

export async function loginAction(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email e senha são obrigatórios" }
  }

  try {
    // Buscar usuário no banco
    const user = await getUserByEmail(email)
    if (!user) {
      return { error: "Email ou senha inválidos" }
    }

    // Verificar senha
    const isPasswordValid = await compare(password, user.password)
    if (!isPasswordValid) {
      return { error: "Email ou senha inválidos" }
    }

    // Criar sessão JWT
    const session = await encrypt({
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    })

    // Definir cookie httpOnly
    const cookieStore = await cookies()
    cookieStore.set("session", session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 horas
      path: "/",
    })

    return { success: true }
  } catch (error) {
    console.error("Erro no login:", error)
    return { error: "Erro interno do servidor" }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set("session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  })
  redirect("/admin/login")
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get("session")?.value
  if (!session) return null

  const payload = await decrypt(session)
  if (!payload) return null

  return {
    userId: payload.userId,
    email: payload.email,
    name: payload.name,
    role: payload.role,
  }
}

export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}

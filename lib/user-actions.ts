"use server"

import { compare, hash } from "bcryptjs"
import { cookies } from "next/headers"
import { decrypt, encrypt } from "./auth-actions"
import { getUserByEmail, getUserById, updateUser } from "./db"

interface UpdateUserProfileParams {
  userId: string
  name: string
  email: string
  currentPassword?: string
  newPassword?: string
}

export async function updateUserProfile({
  userId,
  name,
  email,
  currentPassword,
  newPassword,
}: UpdateUserProfileParams) {
  if (!userId || !name || !email) {
    return { error: "Dados incompletos" }
  }

  try {
    // Buscar o usuário atual
    const currentUser = await getUserById(userId)
    if (!currentUser) {
      return { error: "Usuário não encontrado" }
    }

    // Verificar se o email está sendo alterado
    if (email !== currentUser.email) {
      // Verificar se o novo email já está em uso por outro usuário
      const existingUser = await getUserByEmail(email)
      if (existingUser && existingUser.id !== userId) {
        return { error: "Este email já está sendo usado por outro usuário" }
      }
    }

    // Se tiver nova senha, verificar senha atual
    if (newPassword) {
      if (!currentPassword) {
        return { error: "A senha atual é necessária para definir uma nova senha" }
      }

      // Verificar se a senha atual está correta
      const isCurrentPasswordValid = await compare(currentPassword, currentUser.password)
      if (!isCurrentPasswordValid) {
        return { error: "Senha atual incorreta" }
      }

      // Hash da nova senha
      const hashedPassword = await hash(newPassword, 10)

      // Atualizar dados com a nova senha
      const updatedUser = await updateUser(userId, {
        name,
        email,
        password: hashedPassword,
      })

      if (!updatedUser) {
        return { error: "Erro ao atualizar o usuário" }
      }
    } else {
      // Atualizar apenas nome e email
      const updatedUser = await updateUser(userId, {
        name,
        email,
      })

      if (!updatedUser) {
        return { error: "Erro ao atualizar o usuário" }
      }
    }

    // Atualizar a sessão para refletir as alterações
    try {
      const cookieStore = await cookies()
      const sessionCookie = cookieStore.get("session")
      
      if (sessionCookie?.value) {
        const sessionData = await decrypt(sessionCookie.value)
        if (sessionData) {
          // Atualizar os dados da sessão
          const updatedSession = await encrypt({
            ...sessionData,
            name,
            email,
          })

          // Atualizar o cookie
          cookieStore.set("session", updatedSession, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24, // 24 horas
            path: "/",
          })
        }
      }
    } catch (cookieError) {
      console.error("Erro ao atualizar o cookie de sessão:", cookieError)
      // Continue mesmo se houver erro no cookie, o usuário precisará fazer login novamente
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar perfil:", error)
    return { error: "Erro interno do servidor" }
  }
}

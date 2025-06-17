"user server"
import { getUserByEmail } from "@/lib/db"
import prisma from "@/lib/prisma"


export async function UpdateUserPassword(email: string, newPassword: string){
  try {
    const user = await getUserByEmail(email)
    if (!user) {
      return {
        success: false, 
        error: "Usário não encontrado"
      }
    }else {
      const passwordUpdated = await prisma.user.update({
        where: {email},
        data: {password: newPassword}
      })
      const userUpdated = {
        name: passwordUpdated.name,
        email: passwordUpdated.email,
        role: passwordUpdated.role,
      }
      return {
        success: true,
        user: userUpdated
      }
    }
  }catch(error){
    console.log('Erro ao atualizar senha', error)
    return {
      success: false,
      error: "Erro ao atualizar usuário"
    }
  }
} 
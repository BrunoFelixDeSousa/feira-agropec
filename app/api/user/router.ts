import prisma from '@/lib/prisma'
import { NextRequest, NextResponse } from 'next/server'


export async function GET(idUser: string){
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: idUser
      }
    })
    return NextResponse.json({
      success: true,
      user: user
    })
  } catch (error){
    return NextResponse.json(
      { success: false, error},
      { status: 500}
    )
  }
}


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, newPassword} = body

    if (!id ){
      return NextResponse.json(
        { success: false, error: "Usuário não encontrado"},
        { status: 400 }
      )
    }

    if (newPassword !== undefined && newPassword !== null){
      const changePassword = await prisma.user.update({
        where: {id},
        data: {
          ...({password: newPassword})
        }
      })
      const userNewPassword = {
        name: changePassword.name,
        email: changePassword.email,
        role: changePassword.role
      }
      return NextResponse.json({
        success: true, data: userNewPassword
      })
    }
  }catch(error){
    console.error(error)
    return NextResponse.json(
      {success: false, error: "Erro ao atualizar usuário"}
    )
  }
}
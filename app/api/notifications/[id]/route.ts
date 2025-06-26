import { deleteNotification, getNotificationById, updateNotification } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

// GET: Buscar uma notificação específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const notification = await getNotificationById(id)
    
    if (!notification) {
      return NextResponse.json(
        { success: false, error: "Notificação não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: notification })
  } catch (error) {
    console.error("Erro ao buscar notificação:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// PUT: Atualizar uma notificação específica
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    
    // Verificar se a notificação existe
    const existingNotification = await getNotificationById(id)
    if (!existingNotification) {
      return NextResponse.json(
        { success: false, error: "Notificação não encontrada" },
        { status: 404 }
      )
    }

    // Atualizar a notificação
    const updatedNotification = await updateNotification(id, {
      title: body.title,
      message: body.message,
      type: body.type,
      timestamp: body.timestamp ? new Date(body.timestamp) : undefined,
    })
    
    return NextResponse.json({ 
      success: true, 
      data: updatedNotification,
      message: "Notificação atualizada com sucesso!"
    })
  } catch (error) {
    console.error("Erro ao atualizar notificação:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

// DELETE: Excluir uma notificação específica
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    // Verificar se a notificação existe
    const existingNotification = await getNotificationById(id)
    if (!existingNotification) {
      return NextResponse.json(
        { success: false, error: "Notificação não encontrada" },
        { status: 404 }
      )
    }

    // Excluir a notificação
    await deleteNotification(id)
    
    return NextResponse.json({ 
      success: true,
      message: "Notificação excluída com sucesso!"
    })
  } catch (error) {
    console.error("Erro ao excluir notificação:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

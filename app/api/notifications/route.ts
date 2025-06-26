import { createNotification, getAllNotifications } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

// GET: Listar todas as notificações
export async function GET() {
  try {
    const notifications = await getAllNotifications()
    return NextResponse.json({ success: true, data: notifications })
  } catch (error) {
    console.error("Erro ao buscar notificações:", error)
    return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 })
  }
}

// POST: Criar uma nova notificação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Verificar se os campos obrigatórios estão presentes
    if (!body.title || !body.message || !body.type) {
      return NextResponse.json(
        { success: false, error: "Campos obrigatórios: title, message, type" },
        { status: 400 }
      )
    }
    
    // Criar a notificação
    const notificationData = {
      title: body.title,
      message: body.message,
      type: body.type,
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
      read: false,
      targetGroup: body.targetGroup || null,
    }
    
    const notification = await createNotification(notificationData)
    
    return NextResponse.json({ 
      success: true, 
      data: notification,
      message: "Notificação criada com sucesso!"
    }, { status: 201 })
  } catch (error) {
    console.error("Erro ao criar notificação:", error)
    return NextResponse.json({ 
      success: false, 
      error: (error as Error).message 
    }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from "next/server"
import { unsubscribeUser } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    const { endpoint } = await request.json()

    if (!endpoint) {
      return NextResponse.json(
        { success: false, error: "Endpoint obrigatório" },
        { status: 400 }
      )
    }

    const result = await unsubscribeUser(endpoint)

    if (result.success) {
      return NextResponse.json({ success: true, message: "Desinscrito com sucesso" })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Erro na API de unsubscribe:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

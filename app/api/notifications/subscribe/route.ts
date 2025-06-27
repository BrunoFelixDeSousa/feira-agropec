import { NextRequest, NextResponse } from "next/server"
import { subscribeUser } from "@/lib/notifications"

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()

    if (!subscription || !subscription.endpoint) {
      return NextResponse.json(
        { success: false, error: "Subscription inválida" },
        { status: 400 }
      )
    }

    const result = await subscribeUser(subscription)

    if (result.success) {
      return NextResponse.json({ success: true, message: "Inscrito com sucesso" })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Erro na API de subscription:", error)
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    )
  }
}

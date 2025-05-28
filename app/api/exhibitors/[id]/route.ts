import { getAllExhibitors } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const exhibitors = await getAllExhibitors()
    const exhibitor = exhibitors.find((e) => e.id === id)
    if (!exhibitor) {
      return NextResponse.json({ success: false, error: "Expositor não encontrado." }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: exhibitor })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao buscar expositor." }, { status: 500 })
  }
}

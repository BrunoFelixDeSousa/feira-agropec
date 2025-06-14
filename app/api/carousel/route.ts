import prisma from "@/lib/prisma"
import { NextRequest, NextResponse } from "next/server"

// GET - Buscar todos os slides
export async function GET() {
  try {
    const slides = await prisma.carouselSlide.findMany({
      orderBy: {
        order: 'asc'
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: slides 
    })
  } catch (error) {
    console.error("Erro ao buscar slides:", error)
    return NextResponse.json(
      { success: false, error: "Falha ao buscar slides" },
      { status: 500 }
    )
  }
}

// POST - Criar novo slide
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { title, description, image, link, order, active } = body

    // Validar campos obrigatórios
    if (!title || !image) {
      return NextResponse.json(
        { success: false, error: "Título e imagem são obrigatórios" },
        { status: 400 }
      )
    }

    // Se não foi fornecida uma ordem, usar a próxima disponível
    let slideOrder = order
    if (!slideOrder) {
      const lastSlide = await prisma.carouselSlide.findFirst({
        orderBy: { order: 'desc' }
      })
      slideOrder = lastSlide ? lastSlide.order + 1 : 1
    }

    const slide = await prisma.carouselSlide.create({
      data: {
        title,
        description: description || "",
        image,
        link: link || null,
        order: slideOrder,
        active: active ?? true
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: slide 
    })
  } catch (error) {
    console.error("Erro ao criar slide:", error)
    return NextResponse.json(
      { success: false, error: "Falha ao criar slide" },
      { status: 500 }
    )
  }
}

// PUT - Atualizar slide
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, title, description, image, link, order, active } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID do slide é obrigatório" },
        { status: 400 }
      )
    }

    const slide = await prisma.carouselSlide.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description !== undefined && { description: description || "" }),
        ...(image && { image }),
        ...(link !== undefined && { link: link || null }),
        ...(order && { order }),
        ...(active !== undefined && { active })
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: slide 
    })
  } catch (error) {
    console.error("Erro ao atualizar slide:", error)
    return NextResponse.json(
      { success: false, error: "Falha ao atualizar slide" },
      { status: 500 }
    )
  }
}

// DELETE - Deletar slide
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID do slide é obrigatório" },
        { status: 400 }
      )
    }

    await prisma.carouselSlide.delete({
      where: { id }
    })

    return NextResponse.json({ 
      success: true, 
      data: { message: "Slide deletado com sucesso" } 
    })
  } catch (error) {
    console.error("Erro ao deletar slide:", error)
    return NextResponse.json(
      { success: false, error: "Falha ao deletar slide" },
      { status: 500 }
    )
  }
}

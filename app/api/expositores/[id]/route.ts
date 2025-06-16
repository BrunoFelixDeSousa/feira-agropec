import { deleteExhibitor, getExhibitorById, updateExhibitor } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const exhibitor = await getExhibitorById(id)

    if (!exhibitor) {
      return NextResponse.json(
        { success: false, error: 'Expositor não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: exhibitor })
  } catch (error) {
    console.error('Erro ao buscar expositor:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const {
      name,
      description,
      category,
      location,
      booth,
      logo,
      website,
      phone,
      email,
      featured,
      mapPosition
    } = body

    const exhibitor = await updateExhibitor(id, {
      name,
      description,
      category,
      location,
      booth,
      logo: logo || null,
      website: website || null,
      phone: phone || null,
      email: email || null,
      featured: featured || false,
      mapPosition: mapPosition || null
    })

    return NextResponse.json({ success: true, data: exhibitor })
  } catch (error) {
    console.error('Erro ao atualizar expositor:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await deleteExhibitor(id)

    return NextResponse.json({ 
      success: true, 
      message: 'Expositor deletado com sucesso' 
    })
  } catch (error) {
    console.error('Erro ao deletar expositor:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

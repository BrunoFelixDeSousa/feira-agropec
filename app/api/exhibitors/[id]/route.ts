import { deleteExhibitor, getExhibitorById, updateExhibitor } from "@/lib/db"
import { NextRequest, NextResponse } from "next/server"

export async function GET(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const exhibitor = await getExhibitorById(id)
    if (!exhibitor) {
      return NextResponse.json({ success: false, error: "Expositor não encontrado." }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: exhibitor })
  } catch (error) {
    return NextResponse.json({ success: false, error: "Erro ao buscar expositor." }, { status: 500 })
  }
}

// PUT - Atualizar expositor
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const body = await request.json();
    const {
      name,
      description,
      category,
      location,
      booth,
      website,
      phone,
      email,
      logo,
      featured,
      mapPosition
    } = body;

    // Validação básica
    if (!name || !description || !category || !location || !booth) {
      return NextResponse.json(
        { success: false, error: "Nome, descrição, categoria, localização e estande são obrigatórios" },
        { status: 400 }
      );
    }

    const exhibitor = await updateExhibitor(id, {
      name,
      description,
      category,
      location,
      booth,
      website: website || null,
      phone: phone || null,
      email: email || null,
      logo: logo || null,
      featured: featured || false,
      mapPosition: mapPosition || null,
    });

    return NextResponse.json({ success: true, data: exhibitor });
  } catch (error) {
    console.error("Erro ao atualizar expositor:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

// DELETE - Excluir expositor
export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    // Verificar se o expositor existe
    const existingExhibitor = await getExhibitorById(id);
    
    if (!existingExhibitor) {
      return NextResponse.json(
        { success: false, error: "Expositor não encontrado" },
        { status: 404 }
      );
    }

    // Excluir o expositor
    await deleteExhibitor(id);

    return NextResponse.json({ 
      success: true, 
      message: "Expositor excluído com sucesso" 
    });
  } catch (error) {
    console.error("Erro ao excluir expositor:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

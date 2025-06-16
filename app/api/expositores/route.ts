import { createExhibitor, getAllExhibitors } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const exhibitors = await getAllExhibitors("desc");
    return NextResponse.json({ success: true, data: exhibitors });
  } catch (error) {
    console.error("Erro ao buscar expositores:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao buscar expositores" },
      { status: 500 }
    );
    
  }
}

export async function POST(request: NextRequest) { 
  try {
    const body = await request.json();
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
    } = body;
    
    if (!name || !description || !category) {
      return NextResponse.json(
        { error: 'Nome, descrição e categoria são obrigatórios' },
        { status: 400 }
      );
    }

    const exhibitor = await createExhibitor({
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
    });

    return NextResponse.json({ success: true, data: exhibitor }, { status: 201 });
  } catch (error) {
    console.error('Erro ao criar expositor:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
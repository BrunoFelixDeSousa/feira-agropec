import { getSiteSettings } from "@/lib/db";
import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const settings = await getSiteSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Falha ao buscar configurações" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verificar se existe alguma configuração
    const existingSettings = await prisma.siteSettings.findFirst();
    
    let settings;
    if (existingSettings) {
      // Atualizar configurações existentes
      settings = await prisma.siteSettings.update({
        where: { id: existingSettings.id },
        data: {
          siteName: body.siteName,
          eventStartDate: body.eventStartDate,
          eventEndDate: body.eventEndDate,
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          address: body.address,
          socialFacebook: body.socialFacebook,
          socialInstagram: body.socialInstagram,
          socialTwitter: body.socialTwitter,
          logoUrl: body.logoUrl,
          primaryColor: body.primaryColor,
          secondaryColor: body.secondaryColor,
        }
      });
    } else {
      // Criar novas configurações
      settings = await prisma.siteSettings.create({
        data: {
          siteName: body.siteName || "Feira Agropecuária",
          eventStartDate: body.eventStartDate,
          eventEndDate: body.eventEndDate,
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          address: body.address,
          socialFacebook: body.socialFacebook,
          socialInstagram: body.socialInstagram,
          socialTwitter: body.socialTwitter,
          logoUrl: body.logoUrl,
          primaryColor: body.primaryColor,
          secondaryColor: body.secondaryColor,
        }
      });
    }
    
    return NextResponse.json({ success: true, data: settings });
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao salvar configurações" },
      { status: 500 }
    );
  }
}

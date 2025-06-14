import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Obter contagens
    const [exhibitorCount, eventCount, notificationCount] = await Promise.all([
      prisma.exhibitor.count(),
      prisma.event.count(),
      prisma.notification.count(),
    ]);

    // Obter eventos recentes
    const recentEvents = await prisma.event.findMany({
      where: {
        date: {
          gte: new Date().toISOString().split('T')[0] // Convertendo para string YYYY-MM-DD
        }
      },
      orderBy: {
        date: "asc"
      },
      take: 5
    });

    // Obter expositores recentes
    const recentExhibitors = await prisma.exhibitor.findMany({
      orderBy: {
        createdAt: "desc"
      },
      take: 5
    });

    // Obter notificações recentes
    const recentNotifications = await prisma.notification.findMany({
      orderBy: {
        timestamp: "desc"
      },
      take: 5
    });

    return NextResponse.json({ 
      success: true, 
      data: { 
        counts: {
          exhibitors: exhibitorCount,
          events: eventCount,
          notifications: notificationCount,
        },
        recent: {
          events: recentEvents,
          exhibitors: recentExhibitors,
          notifications: recentNotifications
        },
      } 
    });
  } catch (error) {
    console.error("Erro ao buscar estatísticas:", error);
    return NextResponse.json(
      { success: false, error: "Falha ao buscar estatísticas" },
      { status: 500 }
    );
  }
}

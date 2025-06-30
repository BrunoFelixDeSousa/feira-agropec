import { NextRequest, NextResponse } from "next/server";
import webpush from "web-push";
import prisma from "@/lib/prisma";

// Configurar VAPID keys
const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const privateKey = process.env.VAPID_PRIVATE_KEY;

if (!publicKey || !privateKey) {
  throw new Error("VAPID keys não definidas nas variáveis de ambiente!");
}

webpush.setVapidDetails("mailto:dmin@feira-agropec.com", publicKey, privateKey);

export async function POST(request: NextRequest) {
  try {
    const { notificationId, title, message, type, url } = await request.json();

    if (!title || !message) {
      return NextResponse.json({ success: false, error: "Título e mensagem são obrigatórios" }, { status: 400 });
    }

    // Buscar todas as subscriptions ativas
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { isActive: true },
    });

    if (subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Nenhuma subscription encontrada",
        sent: 0,
        total: 0,
      });
    }

    const payload = JSON.stringify({
      title,
      message,
      type: type || "INFO",
      url: url || "/notificacoes",
      id: notificationId || Date.now().toString(),
      timestamp: new Date().toISOString(),
    });

    // Enviar para todas as subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
        try {
          const subscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth,
            },
          };

          await webpush.sendNotification(subscription, payload);
          return { success: true, endpoint: sub.endpoint };
        } catch (error: any) {
          console.error(`Erro ao enviar para ${sub.endpoint}:`, error);

          // Se o endpoint não é mais válido, marcar como inativo
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription
              .update({
                where: { id: sub.id },
                data: { isActive: false },
              })
              .catch(() => {});
          }

          return { success: false, endpoint: sub.endpoint, error: error.message };
        }
      })
    );

    const successful = results.filter((r: any) => r.status === "fulfilled" && r.value.success).length;
    const failed = results.filter(
      (r: any) => r.status === "rejected" || (r.status === "fulfilled" && !r.value.success)
    ).length;

    // Se enviou uma notificação específica, atualizar o registro
    if (notificationId) {
      await prisma.notification
        .update({
          where: { id: notificationId },
          data: {
            updatedAt: new Date(),
          },
        })
        .catch(() => {});
    }

    return NextResponse.json({
      success: true,
      sent: successful,
      failed: failed,
      total: subscriptions.length,
    });
  } catch (error) {
    console.error("Erro ao enviar push notifications:", error);
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 });
  }
}

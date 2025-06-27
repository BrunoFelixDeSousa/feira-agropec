"use server"

import prisma from "./prisma"
import webpush from "web-push"

// Configurar VAPID keys para web-push
const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "BEl62iUYgUivxIkv69yViEuiBIa40HI95Q9YRILIiMqK-BYJeL9w0s0XDMK7l_LCE-FZbvW3HCBLe-S4lw4V6kM",
  privateKey: process.env.VAPID_PRIVATE_KEY || "Lj9fxLLNfFiAzErdL5u_Q7YjQRD1H4FE7EfjjKQNfxo"
}

webpush.setVapidDetails(
  "mailto:admin@feira-agropec.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

// Funções para gerenciar as notificações push
export async function subscribeUser(subscription: any) {
  try {
    // Verificar se a subscription já existe
    const existingSubscription = await prisma.pushSubscription.findUnique({
      where: { endpoint: subscription.endpoint }
    })

    if (existingSubscription) {
      // Atualizar subscription existente
      await prisma.pushSubscription.update({
        where: { endpoint: subscription.endpoint },
        data: {
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          updatedAt: new Date()
        }
      })
    } else {
      // Criar nova subscription
      await prisma.pushSubscription.create({
        data: {
          endpoint: subscription.endpoint,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth
        }
      })
    }

    console.log("Usuário inscrito para notificações:", subscription.endpoint)
    return { success: true }
  } catch (error) {
    console.error("Erro ao inscrever usuário:", error)
    return { success: false, error: "Erro ao salvar subscription" }
  }
}

export async function unsubscribeUser(endpoint: string) {
  try {
    await prisma.pushSubscription.delete({
      where: { endpoint }
    })

    console.log("Usuário cancelou inscrição para notificações:", endpoint)
    return { success: true }
  } catch (error) {
    console.error("Erro ao cancelar inscrição:", error)
    return { success: false, error: "Erro ao remover subscription" }
  }
}

export async function getAllSubscriptions() {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      where: {
        isActive: true
      }
    })
    return subscriptions
  } catch (error) {
    console.error("Erro ao buscar subscriptions:", error)
    return []
  }
}

export async function sendPushToAll(title: string, message: string, data?: any) {
  try {
    // Buscar todas as subscriptions ativas
    const subscriptions = await prisma.pushSubscription.findMany({
      where: { isActive: true }
    })

    if (subscriptions.length === 0) {
      return { success: true, message: "Nenhuma subscription encontrada", sent: 0, total: 0 }
    }

    const payload = JSON.stringify({
      title,
      message,
      url: data?.url || "/notificacoes",
      id: data?.id || Date.now().toString(),
      type: data?.type || "INFO",
      timestamp: new Date().toISOString()
    })

    // Enviar para todas as subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
        try {
          const subscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          }

          await webpush.sendNotification(subscription, payload)
          return { success: true, endpoint: sub.endpoint }
        } catch (error: any) {
          console.error(`Erro ao enviar para ${sub.endpoint}:`, error)
          
          // Se o endpoint não é mais válido, marcar como inativo
          if (error.statusCode === 410 || error.statusCode === 404) {
            await prisma.pushSubscription.update({
              where: { id: sub.id },
              data: { isActive: false }
            }).catch(() => {})
          }
          
          return { success: false, endpoint: sub.endpoint, error: error.message }
        }
      })
    )

    const successful = results.filter((r: any) => r.status === 'fulfilled' && r.value.success).length
    const failed = results.filter((r: any) => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)).length

    return {
      success: true,
      sent: successful,
      failed: failed,
      total: subscriptions.length
    }
  } catch (error) {
    console.error("Erro ao enviar push notifications:", error)
    return { success: false, error: "Erro ao enviar notificações" }
  }
}

export async function sendPushNotification(title: string, message: string, data?: any) {
  return await sendPushToAll(title, message, data)
}

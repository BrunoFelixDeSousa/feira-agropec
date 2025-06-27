// Utilitários para push notifications (client-side)

// Interface para dados de subscription do banco
export interface PushSubscriptionData {
  endpoint: string
  p256dh: string
  auth: string
}

// Função para criar objeto subscription para web-push
export function createPushSubscriptionObject(dbSubscription: PushSubscriptionData) {
  return {
    endpoint: dbSubscription.endpoint,
    keys: {
      p256dh: dbSubscription.p256dh,
      auth: dbSubscription.auth
    }
  }
}

// Função para converter VAPID key de base64 para Uint8Array
export function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - base64String.length % 4) % 4)
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/')

  const rawData = window.atob(base64)
  const outputArray = new Uint8Array(rawData.length)

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i)
  }
  return outputArray
}

// Verificar se push notifications são suportadas
export function isPushNotificationSupported(): boolean {
  return 'serviceWorker' in navigator && 'PushManager' in window
}

// Verificar permissão de notificações
export function getNotificationPermission(): NotificationPermission | null {
  if (!('Notification' in window)) {
    return null
  }
  return Notification.permission
}

// Solicitar permissão para notificações
export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) {
    return false
  }

  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

"use client"

import { NotificationItem } from "@/components/notification-item"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { subscribeUser, unsubscribeUser } from "@/lib/notifications"
import type { Notification } from "@/lib/types"
import { BellOff } from "lucide-react"
import { useEffect, useState } from "react"

export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [permission, setPermission] = useState<NotificationPermission | null>(null)

  useEffect(() => {
    // Verificar se as notificações são suportadas
    const checkNotificationSupport = () => {
      const supported = "Notification" in window
      setIsSupported(supported)

      if (supported) {
        setPermission(Notification.permission)
        setIsSubscribed(Notification.permission === "granted")
      }
    }

    checkNotificationSupport()
  }, [])

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications")
        const { success, data } = await res.json()
        if (success && Array.isArray(data)) {
          setNotifications(data)
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error)
      }
    }
    fetchNotifications()
  }, [])

  const handleSubscriptionToggle = async () => {
    if (!isSupported) return

    if (isSubscribed) {
      // Cancelar inscrição
      await unsubscribeUser()
      setIsSubscribed(false)
    } else {
      // Solicitar permissão e inscrever
      const permission = await Notification.requestPermission()

      if (permission === "granted") {
        try {
          // Registrar service worker para notificações
          const registration = await navigator.serviceWorker.register("/sw.js")
          const subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
          })

          // Enviar inscrição para o servidor
          await subscribeUser(subscription)
          setIsSubscribed(true)
          setPermission("granted")
        } catch (error) {
          console.error("Erro ao inscrever para notificações:", error)
        }
      }

      setPermission(permission)
    }
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold mb-4">Notificações</h1>

      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Configurações</CardTitle>
          <CardDescription>Gerencie suas preferências</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="notifications" className="flex flex-col space-y-1">
                <span>Notificações Push</span>
                <span className="font-normal text-xs text-muted-foreground">Receba alertas sobre alterações</span>
              </Label>
              <Switch
                id="notifications"
                checked={isSubscribed}
                onCheckedChange={handleSubscriptionToggle}
                disabled={!isSupported}
              />
            </div>

            {!isSupported && <p className="text-xs text-yellow-600">Seu navegador não suporta notificações push.</p>}

            {isSupported && permission === "denied" && (
              <p className="text-xs text-red-600">
                Notificações foram bloqueadas. Por favor, altere as permissões nas configurações do seu navegador.
              </p>
            )}

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="schedule-changes" className="flex flex-col space-y-1">
                <span>Alterações na Programação</span>
                <span className="font-normal text-xs text-muted-foreground">Alertas sobre mudanças nos horários</span>
              </Label>
              <Switch id="schedule-changes" defaultChecked={true} disabled={!isSubscribed} />
            </div>

            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="featured-events" className="flex flex-col space-y-1">
                <span>Eventos em Destaque</span>
                <span className="font-normal text-xs text-muted-foreground">Alertas sobre eventos especiais</span>
              </Label>
              <Switch id="featured-events" defaultChecked={true} disabled={!isSubscribed} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Suas Notificações</CardTitle>
          <CardDescription>Fique por dentro das novidades</CardDescription>
        </CardHeader>
        <CardContent>
          {notifications.length > 0 ? (
            <div className="grid gap-3">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BellOff className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-muted-foreground text-sm">Você não tem notificações no momento.</p>
            </div>
          )}
        </CardContent>
        {notifications.length > 0 && (
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={clearAllNotifications}>
              Limpar todas
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}

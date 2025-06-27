"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bell, BellOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import { urlBase64ToUint8Array, isPushNotificationSupported, requestNotificationPermission } from "@/lib/push-utils"

interface PushNotificationManagerProps {
  vapidPublicKey?: string
}

export function PushNotificationManager({ 
  vapidPublicKey = "BEl62iUYgUivxIkv69yViEuiBIa40HI95Q9YRILIiMqK-BYJeL9w0s0XDMK7l_LCE-FZbvW3HCBLe-S4lw4V6kM" 
}: PushNotificationManagerProps) {
  const [isSupported, setIsSupported] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [subscription, setSubscription] = useState<PushSubscription | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setIsSupported(isPushNotificationSupported())
    if (isPushNotificationSupported()) {
      checkSubscription()
    }
  }, [])

  const checkSubscription = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const sub = await registration.pushManager.getSubscription()
      
      if (sub) {
        setSubscription(sub)
        setIsSubscribed(true)
      }
    } catch (error) {
      console.error('Erro ao verificar subscription:', error)
    }
  }

  const requestPermission = async () => {
    return await requestNotificationPermission()
  }

  const subscribeUser = async () => {
    setLoading(true)
    
    try {
      const hasPermission = await requestPermission()
      if (!hasPermission) {
        setLoading(false)
        return
      }

      // Registrar service worker
      const registration = await navigator.serviceWorker.register('/sw.js')
      await navigator.serviceWorker.ready

      // Criar subscription
      const sub = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertVapidKey(vapidPublicKey)
      })

      // Enviar subscription para o servidor
      const response = await fetch('/api/notifications/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sub.toJSON())
      })

      const result = await response.json()

      if (result.success) {
        setSubscription(sub)
        setIsSubscribed(true)
        toast({
          title: "Inscrito com sucesso!",
          description: "Você receberá notificações sobre eventos importantes.",
        })
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error('Erro ao inscrever usuário:', error)
      toast({
        title: "Erro",
        description: "Não foi possível ativar as notificações. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const unsubscribeUser = async () => {
    setLoading(true)
    
    try {
      if (subscription) {
        // Cancelar subscription no navegador
        await subscription.unsubscribe()

        // Remover do servidor
        const response = await fetch('/api/notifications/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ endpoint: subscription.endpoint })
        })

        const result = await response.json()

        if (result.success) {
          setSubscription(null)
          setIsSubscribed(false)
          toast({
            title: "Desinscrito com sucesso!",
            description: "Você não receberá mais notificações push.",
          })
        } else {
          throw new Error(result.error)
        }
      }
    } catch (error) {
      console.error('Erro ao cancelar inscrição:', error)
      toast({
        title: "Erro",
        description: "Não foi possível desativar as notificações. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Função para converter VAPID key (mantida localmente por simplicidade)
  const convertVapidKey = (base64String: string) => {
    return urlBase64ToUint8Array(base64String)
  }

  if (!isSupported) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BellOff className="h-5 w-5" />
            Notificações Push
          </CardTitle>
          <CardDescription>
            Seu navegador não suporta notificações push.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notificações Push
        </CardTitle>
        <CardDescription>
          Receba notificações sobre eventos importantes, mudanças na programação e avisos urgentes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">
              Status: {isSubscribed ? 'Ativo' : 'Inativo'}
            </p>
            <p className="text-xs text-muted-foreground">
              {isSubscribed 
                ? 'Você receberá notificações push deste site' 
                : 'Ative para receber notificações importantes'
              }
            </p>
          </div>
          <Button
            onClick={isSubscribed ? unsubscribeUser : subscribeUser}
            disabled={loading}
            variant={isSubscribed ? "outline" : "default"}
          >
            {loading ? "Carregando..." : (isSubscribed ? "Desativar" : "Ativar")}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

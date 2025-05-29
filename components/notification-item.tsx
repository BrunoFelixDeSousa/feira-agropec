"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Notification } from "@/lib/types"
import { Calendar, Clock, X } from "lucide-react"

interface NotificationItemProps {
  notification: Notification
  onDismiss?: (id: string) => void
}

export function NotificationItem({ notification, onDismiss }: NotificationItemProps) {
  const formattedDate = new Date(notification.timestamp).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  })

  const formattedTime = new Date(notification.timestamp).toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Card>
      <CardContent className="p-3">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-1 mb-1">
              <h4 className="font-semibold text-sm">{notification.title}</h4>
              {notification.type === "URGENT" && <Badge className="bg-red-500 text-xs">Urgente</Badge>}
              {notification.type === "SCHEDULE_CHANGE" && <Badge className="bg-yellow-500 text-xs">Alteração</Badge>}
              {notification.type === "REMINDER" && <Badge className="text-xs">Lembrete</Badge>}
            </div>
            <p className="text-xs text-muted-foreground mb-1">{notification.message}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              {formattedDate}
              <Clock className="ml-2 mr-1 h-3 w-3" />
              {formattedTime}
            </div>
          </div>

          {onDismiss && (
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => onDismiss(notification.id)}>
              <X className="h-3 w-3" />
              <span className="sr-only">Fechar</span>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

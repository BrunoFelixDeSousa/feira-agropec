"use client";

import { NotificationItem } from "@/components/notification-item";
import { PushNotificationManager } from "@/components/push-notification-manager";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { Notification } from "@/lib/types";
import { BellOff } from "lucide-react";
import { useEffect, useState } from "react";

export default function NotificacoesPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        const { success, data } = await res.json();
        if (success && Array.isArray(data)) {
          setNotifications(data);
        }
      } catch (error) {
        console.error("Erro ao buscar notificações:", error);
      }
    }
    fetchNotifications();
  }, []);

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold mb-4">Notificações</h1>

      <div className="mb-4">
        <PushNotificationManager />
      </div>

      {/* <Card>
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
      </Card> */}
    </div>
  );
}

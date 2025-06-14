"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"

interface Activity {
  id: string
  type: 'create' | 'update' | 'delete' | 'notification'
  entity: 'exhibitor' | 'event' | 'notification' | 'settings'
  description: string
  timestamp: Date
  user: string
}

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'create': return 'bg-green-500'
    case 'update': return 'bg-blue-500'
    case 'delete': return 'bg-red-500'
    case 'notification': return 'bg-orange-500'
    default: return 'bg-gray-500'
  }
}

const getActivityBadge = (type: Activity['type']) => {
  switch (type) {
    case 'create': return <Badge variant="secondary" className="bg-green-100 text-green-800">Criado</Badge>
    case 'update': return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Atualizado</Badge>
    case 'delete': return <Badge variant="secondary" className="bg-red-100 text-red-800">Removido</Badge>
    case 'notification': return <Badge variant="secondary" className="bg-orange-100 text-orange-800">Notificação</Badge>
    default: return <Badge variant="secondary">Ação</Badge>
  }
}

const getTimeAgo = (timestamp: Date) => {
  const now = new Date()
  const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Agora mesmo'
  if (diffInMinutes < 60) return `Há ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `Há ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `Há ${diffInDays} dia${diffInDays > 1 ? 's' : ''}`
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[] | null>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchRecentActivities() {
      try {
        const response = await fetch('/api/stats', {
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch stats')
        }
        
        const data = await response.json()
        
        if (data.success && data.data.recent) {
          const { events, exhibitors, notifications } = data.data.recent
          
          // Converter dados do banco para formato de atividades
          const recentActivities: Activity[] = []
          
          // Adicionar expositores recentes (criados ou atualizados)
          exhibitors.slice(0, 2).forEach((exhibitor: any) => {
            const wasUpdated = new Date(exhibitor.updatedAt).getTime() > new Date(exhibitor.createdAt).getTime() + 1000 // 1 segundo de diferença
            recentActivities.push({
              id: `exhibitor-${exhibitor.id}`,
              type: wasUpdated ? 'update' : 'create',
              entity: 'exhibitor',
              description: wasUpdated ? `Atualizou expositor: ${exhibitor.name}` : `Adicionou novo expositor: ${exhibitor.name}`,
              timestamp: new Date(wasUpdated ? exhibitor.updatedAt : exhibitor.createdAt),
              user: 'Administrador'
            })
          })
          
          // Adicionar eventos recentes (criados ou atualizados)
          events.slice(0, 2).forEach((event: any) => {
            const wasUpdated = new Date(event.updatedAt).getTime() > new Date(event.createdAt).getTime() + 1000
            recentActivities.push({
              id: `event-${event.id}`,
              type: wasUpdated ? 'update' : 'create',
              entity: 'event',
              description: wasUpdated ? `Atualizou evento: ${event.title}` : `Adicionou evento: ${event.title}`,
              timestamp: new Date(wasUpdated ? event.updatedAt : event.createdAt),
              user: 'Administrador'
            })
          })
          
          // Adicionar notificações recentes
          notifications.slice(0, 1).forEach((notification: any) => {
            recentActivities.push({
              id: `notification-${notification.id}`,
              type: 'notification',
              entity: 'notification',
              description: `Enviou notificação: ${notification.title}`,
              timestamp: new Date(notification.timestamp),
              user: 'Administrador'
            })
          })
          
          // Ordenar por timestamp (mais recente primeiro)
          recentActivities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          
          // Se não houver atividades suficientes do banco, usar alguns dados mock como fallback
          const finalActivities = recentActivities.length > 0 ? recentActivities.slice(0, 5) : null

          setActivities(finalActivities)
        }
      } catch (error) {
        console.error('Erro ao buscar atividades:', error)
        // Fallback para dados mock em caso de erro
        setActivities(null)
      } finally {
        setLoading(false)
      }
    }
    
    fetchRecentActivities()
  }, [])

  if (loading) {
    return (
      <div className="space-y-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center animate-pulse">
            <div className="h-9 w-9 bg-muted rounded-full"></div>
            <div className="ml-4 space-y-1 flex-1">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
            <div className="h-3 bg-muted rounded w-16"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {activities &&activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/avatars/0${activity.id}.png`} alt="Avatar" />
            <AvatarFallback className={`text-white ${getActivityColor(activity.type)}`}>
              {activity.user.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium leading-none">{activity.user}</p>
              {getActivityBadge(activity.type)}
            </div>
            <p className="text-sm text-muted-foreground">{activity.description}</p>
            <p className="text-xs text-muted-foreground">
              {getTimeAgo(activity.timestamp)}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

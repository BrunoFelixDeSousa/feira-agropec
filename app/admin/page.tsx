import { RecentActivity } from "@/components/admin/recent-activity"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { paths } from "@/lib/paths"
import { Bell, CalendarDays, MapPin, Plus, Settings } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

async function getStats() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/stats`, {
      cache: 'no-store'
    })
    if (!response.ok) throw new Error('Failed to fetch stats')
    const data = await response.json()
    return data.data
  } catch (error) {
    console.error('Error fetching stats:', error)
    // Retornar dados padrão em caso de erro
    return {
      counts: { exhibitors: 0, events: 0, notifications: 0, users: 0 },
      recent: { events: [], exhibitors: [], notifications: [] },
      chartData: []
    }
  }
}

function StatsCardsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-8 w-16 bg-muted animate-pulse rounded mb-2" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

async function StatsCards() {
  const stats = await getStats()
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Expositores</CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.exhibitors}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Eventos Programados</CardTitle>
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.events}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Notificações Enviadas</CardTitle>
          <Bell className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.counts.notifications}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" className="text-muted-foreground hover:text-foreground" asChild>
            <Link href="/admin/configuracoes">
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Ações Rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <Link href={`${paths.admin.expositores}/novo`} className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Novo Expositor</p>
                <p className="text-sm text-muted-foreground">Cadastrar expositor</p>
              </div>
            </Link>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <Link href="/admin/eventos" className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <CalendarDays className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="font-medium">Novo Evento</p>
                <p className="text-sm text-muted-foreground">Criar evento</p>
              </div>
            </Link>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <Link href="/admin/notificacoes" className="flex items-center gap-3">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Bell className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <p className="font-medium">Enviar Notificação</p>
                <p className="text-sm text-muted-foreground">Nova notificação</p>
              </div>
            </Link>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
          <CardContent className="p-4">
            <Link href="/admin/mapa" className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <MapPin className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="font-medium">Editar Mapa</p>
                <p className="text-sm text-muted-foreground">Configurar layout</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>
      
      {/* Estatísticas */}
      <Suspense fallback={<StatsCardsSkeleton />}>
        <StatsCards />
      </Suspense>

      {/* Atividade Recente */}
      <Card>
        <CardHeader>
          <CardTitle>Atividade Recente</CardTitle>
          <CardDescription>Últimas ações realizadas no sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <RecentActivity />
        </CardContent>
      </Card>
    </div>
  )
}

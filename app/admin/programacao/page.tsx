"use client"

import { EventDataTable } from "@/components/admin/event-data-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { paths } from "@/lib/paths"
import { Event } from "@/lib/types"
import { Calendar, Plus } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function EventsPage() {

  const [events, setEvents] = useState<Event[]>();

  // Buscar eventos do banco de dados quando o componente montar
  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events");
        const { success, data: events } = await res.json();
        if (events && success) {
          setEvents(events);
        }
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    }

    fetchEvents();
  }, [])

  // Calcular estatísticas de eventos
  const totalEvents = events?.length || 0
  const upcomingEvents = events?.filter((event) => new Date(event.date) >= new Date()).length || 0
  const featuredEvents = events?.filter((event) => event.featured).length || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Eventos</h2>
          <p className="text-muted-foreground mt-1">Gerencie todos os eventos da feira agropecuária</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild>
            <Link href={`${paths.admin.eventos}/novo`}>
              <Plus className="mr-2 h-4 w-4" /> Novo Evento
            </Link>
          </Button>
        </div>
      </div>

      {/* Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvents}</div>
            <p className="text-xs text-muted-foreground">Eventos cadastrados no sistema</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Futuros</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingEvents}</div>
            <p className="text-xs text-muted-foreground">Eventos que ainda não ocorreram</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Destaque</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{featuredEvents}</div>
            <p className="text-xs text-muted-foreground">Eventos marcados como destaque</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="todos" className="w-full">
        <TabsList>
          <TabsTrigger value="todos">Todos os Eventos</TabsTrigger>
          <TabsTrigger value="proximos">Próximos Eventos</TabsTrigger>
          <TabsTrigger value="passados">Eventos Passados</TabsTrigger>
          <TabsTrigger value="destaque">Em Destaque</TabsTrigger>
        </TabsList>
        <TabsContent value="todos">
          <EventDataTable />
        </TabsContent>
        <TabsContent value="proximos">
          <EventDataTable filterType="upcoming" />
        </TabsContent>
        <TabsContent value="passados">
          <EventDataTable filterType="past" />
        </TabsContent>
        <TabsContent value="destaque">
          <EventDataTable filterType="featured" />
        </TabsContent>
      </Tabs>
    </div>
  )
}

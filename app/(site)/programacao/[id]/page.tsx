"use client"

import { getAllEvents, getEventById } from "@/app/api/events/actions"
import { EventDetailsDialog } from "@/components/event-details-dialog"
import { FavoriteButton } from "@/components/favorite-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Event } from "@/lib/types"
import { ArrowLeft, Bell, Calendar, Clock, MapPin, Share2, Users } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound, useRouter } from "next/navigation"
import { use, useEffect, useState } from "react"

interface EventPageProps {
  params: Promise<{ id: string }>
}

export default function EventPage({ params }: EventPageProps) {
  const resolvedParams = use(params)
  const [event, setEvent] = useState<Event | null>(null)
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const router = useRouter()

  useEffect(() => {
    async function fetchEvent() {
      try {
        // Buscar evento específico
        const eventResponse = await getEventById(resolvedParams.id)
        if (!eventResponse.success || !eventResponse.data) {
          notFound()
          return
        }

        setEvent(eventResponse.data)

        // Buscar eventos relacionados (mesmo tipo)
        const allEventsResponse = await getAllEvents()
        if (allEventsResponse.success && allEventsResponse.data && eventResponse.data) {
          const related = allEventsResponse.data
            .filter((e) => e.id !== resolvedParams.id && e.type === eventResponse.data!.type)
            .slice(0, 3)
          setRelatedEvents(related)
        }
      } catch (error) {
        console.error("Erro ao buscar evento:", error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvent()
  }, [resolvedParams.id])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!event) {
    notFound()
  }

  // Obter cor com base no tipo de evento
  const getEventColor = (type: string) => {
    const colors: Record<string, string> = {
      Cerimônia: "bg-purple-100 text-purple-800 border-purple-300",
      Leilão: "bg-amber-100 text-amber-800 border-amber-300",
      Palestra: "bg-blue-100 text-blue-800 border-blue-300",
      Workshop: "bg-green-100 text-green-800 border-green-300",
      Show: "bg-pink-100 text-pink-800 border-pink-300",
      Exposição: "bg-indigo-100 text-indigo-800 border-indigo-300",
      Concurso: "bg-orange-100 text-orange-800 border-orange-300",
      Rodeio: "bg-red-100 text-red-800 border-red-300",
      "Dia de Campo": "bg-cyan-100 text-cyan-800 border-cyan-300",
    }
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-300"
  }

  const handleShare = async () => {
    const shareData = {
      title: `AGROPEC 2025 - ${event.title}`,
      text: `Confira o evento "${event.title}" na Feira Agropecuária de Paragominas em ${event.date} às ${event.time}.`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
        alert("Link copiado para a área de transferência!")
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header com navegação */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div className="flex-1" />
        <FavoriteButton id={event.id} type="event" />
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Compartilhar</span>
        </Button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Conteúdo principal */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card principal do evento */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={getEventColor(event.type)}>
                      {event.type}
                    </Badge>
                    {event.featured && (
                      <Badge variant="secondary">
                        Em Destaque
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl lg:text-3xl">{event.title}</CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informações básicas */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data</p>
                    <p className="font-medium">{event.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Horário</p>
                    <p className="font-medium">
                      {event.time}
                      {event.endTime && ` - ${event.endTime}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg sm:col-span-2">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Local</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Descrição */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Sobre o Evento</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {event.description}
                </p>
              </div>

              {/* Tags */}
              {event.tags && event.tags.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Tags</h4>
                  <div className="flex flex-wrap gap-2">
                    {event.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Imagem do evento */}
              {event.image && (
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full" 
                onClick={() => setShowDetailsDialog(true)}
              >
                <Bell className="h-4 w-4 mr-2" />
                Definir Lembrete
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/mapa">
                  <MapPin className="h-4 w-4 mr-2" />
                  Ver no Mapa
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/programacao">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver Programação
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Eventos relacionados */}
          {relatedEvents.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Eventos Relacionados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {relatedEvents.map((relatedEvent) => (
                  <Link
                    key={relatedEvent.id}
                    href={`/programacao/${relatedEvent.id}`}
                    className="block p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="space-y-1">
                      <h4 className="font-medium text-sm line-clamp-2">
                        {relatedEvent.title}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {relatedEvent.date}
                        <Clock className="h-3 w-3" />
                        {relatedEvent.time}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {relatedEvent.type}
                      </Badge>
                    </div>
                  </Link>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Informações adicionais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Evento aberto ao público</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Duração estimada: 
                  {event.endTime ? 
                    ` ${Math.abs(parseInt(event.endTime.split(':')[0]) - parseInt(event.time.split(':')[0]))}h` : 
                    ' 1h'
                  }
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialog de detalhes */}
      {event && (
        <EventDetailsDialog
          event={event}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
        />
      )}
    </div>
  )
}

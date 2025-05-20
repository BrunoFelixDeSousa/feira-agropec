"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar, Clock, MapPin, Share2, Bell, CalendarIcon } from "lucide-react"
import type { Event } from "@/lib/types"
import { FavoriteButton } from "@/components/favorite-button"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

interface EventDetailsDialogProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventDetailsDialog({ event, open, onOpenChange }: EventDetailsDialogProps) {
  const [isReminderSet, setIsReminderSet] = useState(false)
  const { toast } = useToast()

  const handleSetReminder = () => {
    setIsReminderSet(!isReminderSet)

    toast({
      title: isReminderSet ? "Lembrete removido" : "Lembrete definido",
      description: isReminderSet
        ? `O lembrete para "${event.title}" foi removido.`
        : `Você receberá um lembrete para "${event.title}" 1 hora antes do evento.`,
      duration: 3000,
    })
  }

  const handleShare = async () => {
    const shareData = {
      title: `Feira AGROPEC - ${event.title}`,
      text: `Confira o evento "${event.title}" na Feira Agropecuária de Paragominas em ${event.date} às ${event.time}.`,
      url: window.location.href,
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        // Fallback para copiar para a área de transferência
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`)
        toast({
          title: "Link copiado",
          description: "O link do evento foi copiado para a área de transferência.",
          duration: 3000,
        })
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error)
    }
  }

  const handleAddToCalendar = () => {
    // Converter data e hora para formato adequado
    const [day, month, year] = event.date.split("/").map(Number)
    const [hour, minute] = event.time.split(":").map(Number)

    // Criar data de início e fim (assumindo duração de 1 hora)
    const startDate = new Date(year, month - 1, day, hour, minute)
    const endDate = new Date(year, month - 1, day, hour + 1, minute)

    // Formatar para URL do Google Calendar
    const startDateStr = startDate.toISOString().replace(/-|:|\.\d+/g, "")
    const endDateStr = endDate.toISOString().replace(/-|:|\.\d+/g, "")

    // Criar URL para Google Calendar
    const googleCalendarUrl = `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location)}&dates=${startDateStr}/${endDateStr}`

    // Abrir em nova aba
    window.open(googleCalendarUrl, "_blank")
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="pr-8">{event.title}</DialogTitle>
          <div className="absolute top-4 right-4">
            <FavoriteButton id={event.id} type="event" name={event.title} variant="ghost" size="sm" />
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Badge variant="outline" className={`${getEventColor(event.type)}`}>
            {event.type}
          </Badge>

          <p className="text-sm text-muted-foreground">{event.description}</p>

          <div className="grid gap-3">
            <div className="flex items-center gap-3">
              <div className="bg-muted p-2 rounded-full">
                <Calendar className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm">{event.date}</p>
                <p className="text-xs text-muted-foreground">Data</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-muted p-2 rounded-full">
                <Clock className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm">{event.time}</p>
                <p className="text-xs text-muted-foreground">Horário</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="bg-muted p-2 rounded-full">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm">{event.location}</p>
                <p className="text-xs text-muted-foreground">Local</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={handleSetReminder}>
            <Bell className="h-4 w-4" />
            {isReminderSet ? "Remover lembrete" : "Definir lembrete"}
          </Button>

          <Button variant="outline" size="sm" className="gap-2" onClick={handleAddToCalendar}>
            <CalendarIcon className="h-4 w-4" />
            Adicionar ao calendário
          </Button>

          <Button variant="outline" size="sm" className="gap-2" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
            Compartilhar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

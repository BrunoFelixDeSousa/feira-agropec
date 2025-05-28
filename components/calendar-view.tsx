"use client"

import { EventDetailsDialog } from "@/components/event-details-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { Event } from "@/lib/types"
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

interface CalendarViewProps {
  events: Event[]
}

export function CalendarView({ events }: CalendarViewProps) {
  const today = new Date().getFullYear()
  const [currentMonth, setCurrentMonth] = useState(7) // Agosto (0-indexed seria 7, mas usamos 1-indexed para facilitar)
  const [currentYear, setCurrentYear] = useState(today)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  // Função para obter o número de dias em um mês
  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate()
  }

  // Função para obter o dia da semana do primeiro dia do mês (0 = Domingo, 1 = Segunda, etc.)
  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month - 1, 1).getDay()
  }

  // Obter dias no mês atual
  const daysInMonth = getDaysInMonth(currentMonth, currentYear)
  const firstDayOfMonth = getFirstDayOfMonth(currentMonth, currentYear)

  // Nomes dos meses
  const monthNames = [
    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",
    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro",
  ]

  // Nomes dos dias da semana
  const weekdayNames = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

  // Navegar para o mês anterior
  const goToPreviousMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  // Navegar para o próximo mês
  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  // Filtrar eventos para o mês atual
  const eventsInCurrentMonth = events.filter((event) => {
    const [day, month, year] = event.date.split("/").map(Number)
    return month === currentMonth && year === currentYear
  })

  // Agrupar eventos por dia
  const eventsByDay: Record<number, Event[]> = {}
  eventsInCurrentMonth.forEach((event) => {
    const day = Number.parseInt(event.date.split("/")[0])
    if (!eventsByDay[day]) {
      eventsByDay[day] = []
    }
    eventsByDay[day].push(event)
  })

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

  // Abrir detalhes do evento
  const openEventDetails = (event: Event) => {
    setSelectedEvent(event)
    setIsDetailsOpen(true)
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="outline" size="icon" onClick={goToPreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-bold flex items-center">
              <CalendarIcon className="h-5 w-5 mr-2" />
              {monthNames[currentMonth - 1]} {currentYear}
            </h2>
            <Button variant="outline" size="icon" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Cabeçalho dos dias da semana */}
            {weekdayNames.map((day, index) => (
              <div key={index} className="text-center text-xs font-medium text-muted-foreground p-2">
                {day}
              </div>
            ))}

            {/* Dias vazios antes do primeiro dia do mês */}
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} className="p-2 border rounded-md bg-muted/20"></div>
            ))}

            {/* Dias do mês */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1
              const hasEvents = !!eventsByDay[day]
              const isToday = day === 15 && currentMonth === 8 && currentYear === 2023 // Simulando que hoje é 15/08/2023

              return (
                <div
                  key={`day-${day}`}
                  className={`p-2 border rounded-md min-h-[80px] ${
                    hasEvents ? "cursor-pointer hover:border-primary" : ""
                  } ${isToday ? "border-green-500 bg-green-50" : ""}`}
                >
                  <div className="text-right text-sm font-medium mb-1">{day}</div>
                  {hasEvents && (
                    <div className="space-y-1">
                      {eventsByDay[day].slice(0, 2).map((event) => (
                        <Badge
                          key={event.id}
                          variant="outline"
                          className={`text-xs w-full justify-start truncate ${getEventColor(event.type)}`}
                          onClick={() => openEventDetails(event)}
                        >
                          {event.time} {event.title}
                        </Badge>
                      ))}
                      {eventsByDay[day].length > 2 && (
                        <div className="text-xs text-center text-muted-foreground">
                          +{eventsByDay[day].length - 2} mais
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h3 className="text-lg font-bold mb-3">Eventos do Mês</h3>
          <ScrollArea className="h-[200px]">
            {eventsInCurrentMonth.length > 0 ? (
              <div className="space-y-2">
                {eventsInCurrentMonth.map((event) => (
                  <div
                    key={event.id}
                    className="p-2 border rounded-md cursor-pointer hover:border-primary"
                    onClick={() => openEventDetails(event)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{event.title}</div>
                        <div className="text-xs text-muted-foreground">
                          {event.date} • {event.time} • {event.location}
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-xs ${getEventColor(event.type)}`}>
                        {event.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum evento neste mês.</p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Dialog para detalhes do evento */}
      {selectedEvent && (
        <EventDetailsDialog event={selectedEvent} open={isDetailsOpen} onOpenChange={setIsDetailsOpen} />
      )}
    </div>
  )
}

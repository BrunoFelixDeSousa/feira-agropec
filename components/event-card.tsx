"use client"

import { EventDetailsDialog } from "@/components/event-details-dialog"
import { FavoriteButton } from "@/components/favorite-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Event } from "@/lib/types"
import { Clock, MapPin } from "lucide-react"
import { useState } from "react"

interface EventCardProps {
  event: Event
  showFavorite?: boolean
}

export function EventCard({ event, showFavorite = false }: EventCardProps) {
  const [showDetails, setShowDetails] = useState(false)

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
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="bg-muted p-1.5 sm:p-2 rounded-full">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                </div>
                <div>
                  <div className="text-sm sm:text-base font-bold">{event.time}</div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {event.featured && <Badge className="bg-green-600 text-[10px] sm:text-xs">Destaque</Badge>}
                {showFavorite && (
                  <FavoriteButton id={event.id} type="event" name={event.title} variant="ghost" size="sm" />
                )}
              </div>
            </div>

            <div>
              <h3 className="text-sm sm:text-base font-bold mb-1">{event.title}</h3>
              <div className="flex items-center text-[10px] sm:text-xs text-muted-foreground mb-1">
                <MapPin className="mr-1 h-3 w-3" />
                {event.location}
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 line-clamp-2">{event.description}</p>

              <div className="flex items-center justify-between">
                <Badge variant="outline" className={`text-[10px] sm:text-xs ${getEventColor(event.type)}`}>
                  {event.type}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 sm:h-7 text-[10px] sm:text-xs"
                  onClick={() => setShowDetails(true)}
                >
                  Detalhes
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <EventDetailsDialog event={event} open={showDetails} onOpenChange={setShowDetails} />
    </>
  )
}

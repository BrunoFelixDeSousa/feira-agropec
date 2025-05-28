"use client"

import { EventCard } from "@/components/event-card"
import { ExhibitorCard } from "@/components/exhibitor-card"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFavoritesContext } from "@/lib/favorites"
import { Event, Exhibitor } from "@/lib/types"
import { Heart, Search } from "lucide-react"
import { useEffect, useState } from "react"

export default function FavoritosPage() {
  const { getFavoritesByType, isLoaded } = useFavoritesContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])
  const [events, setEvents] = useState<Event[]>([])

  // Buscar expositores e eventos do banco de dados quando o componente montar
  useEffect(() => {
    if (isLoaded) {
      async function fetchExhibitors() {
        try {
          const res = await fetch("/api/exhibitors");
          const { success, data: exhibitors } = await res.json();
          if (exhibitors && success) {
            setExhibitors(exhibitors);
          }
        } catch (error) {
          console.error("Erro ao buscar expositores:", error);
        }
      }

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

      fetchExhibitors();
      fetchEvents();
    }
  }, [isLoaded]);

  // Obter IDs dos favoritos
  const exhibitorFavorites = getFavoritesByType("exhibitor");
  const eventFavorites = getFavoritesByType("event");

  // Filtrar os dados pelos IDs dos favoritos
  const favoriteExhibitors = exhibitors.filter((exhibitor) =>
    exhibitorFavorites.some((fav) => fav.id === exhibitor.id)
  );
  const favoriteEvents = events.filter((event) =>
    eventFavorites.some((fav) => fav.id === event.id)
  );

  // Aplicar filtro de busca se houver
  const filteredExhibitors = searchTerm
    ? favoriteExhibitors.filter(
        (exhibitor) =>
          exhibitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          exhibitor.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : favoriteExhibitors;

  const filteredEvents = searchTerm
    ? favoriteEvents.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.type.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : favoriteEvents;

  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold mb-4">Meus Favoritos</h1>

      <div className="relative mb-4">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar nos favoritos..."
          className="pl-8"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Tabs defaultValue="expositores">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="expositores" className="flex-1">
            Expositores
          </TabsTrigger>
          <TabsTrigger value="eventos" className="flex-1">
            Eventos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="expositores" className="mt-0">
          <ScrollArea className="h-[calc(100vh-13rem)]">
            {filteredExhibitors.length > 0 ? (
              <div className="grid gap-3">
                {filteredExhibitors.map((exhibitor) => (
                  <ExhibitorCard key={exhibitor.id} exhibitor={exhibitor} layout="list" showFavorite />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-2">Nenhum expositor favorito</h3>
                  <p className="text-muted-foreground text-sm">
                    Adicione expositores aos favoritos para acessá-los rapidamente aqui.
                  </p>
                </CardContent>
              </Card>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="eventos" className="mt-0">
          <ScrollArea className="h-[calc(100vh-13rem)]">
            {filteredEvents.length > 0 ? (
              <div className="grid gap-3">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} showFavorite />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium mb-2">Nenhum evento favorito</h3>
                  <p className="text-muted-foreground text-sm">
                    Adicione eventos aos favoritos para acessá-los rapidamente aqui.
                  </p>
                </CardContent>
              </Card>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ExhibitorCard } from "@/components/exhibitor-card"
import { EventCard } from "@/components/event-card"
import { useFavoritesContext } from "@/lib/favorites"
import { mockExhibitors, mockEvents } from "@/lib/mock-data"
import { Heart, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function FavoritosPage() {
  const { getFavoritesByType, isLoaded } = useFavoritesContext()
  const [searchTerm, setSearchTerm] = useState("")
  const [favoriteExhibitors, setFavoriteExhibitors] = useState<typeof mockExhibitors>([])
  const [favoriteEvents, setFavoriteEvents] = useState<typeof mockEvents>([])

  useEffect(() => {
    if (isLoaded) {
      // Obter IDs dos favoritos
      const exhibitorFavorites = getFavoritesByType("exhibitor")
      const eventFavorites = getFavoritesByType("event")

      // Filtrar os dados mockados pelos IDs dos favoritos
      const exhibitors = mockExhibitors.filter((exhibitor) => exhibitorFavorites.some((fav) => fav.id === exhibitor.id))
      const events = mockEvents.filter((event) => eventFavorites.some((fav) => fav.id === event.id))

      // Aplicar filtro de busca se houver
      const filteredExhibitors = searchTerm
        ? exhibitors.filter(
            (exhibitor) =>
              exhibitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              exhibitor.category.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : exhibitors

      const filteredEvents = searchTerm
        ? events.filter(
            (event) =>
              event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
              event.type.toLowerCase().includes(searchTerm.toLowerCase()),
          )
        : events

      setFavoriteExhibitors(filteredExhibitors)
      setFavoriteEvents(filteredEvents)
    }
  }, [isLoaded, getFavoritesByType, searchTerm])

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
            {favoriteExhibitors.length > 0 ? (
              <div className="grid gap-3">
                {favoriteExhibitors.map((exhibitor) => (
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
            {favoriteEvents.length > 0 ? (
              <div className="grid gap-3">
                {favoriteEvents.map((event) => (
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

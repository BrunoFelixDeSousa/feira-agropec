import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Mail, ExternalLink, Navigation, Clock, Calendar, Info } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { mockExhibitors, mockEvents } from "@/lib/mock-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FavoriteButton } from "@/components/favorite-button"
import { useEffect, useState } from "react"
import { getExhibitorId } from "@/app/api/exhibitors/actions"
import {Event, Exhibitor} from "../lib/types"


interface ExhibitorInfoProps {
  exhibitorId: string
}

export function ExhibitorInfo({ exhibitorId }: ExhibitorInfoProps) {

  const [events, setEvents] = useState<Event[]>([])
  const [exhibitor, setExhibitor] = useState<Exhibitor | undefined>()
  
  // const exhibitor = exhibitorId ? exhibitors?.filter((e) => e.id === exhibitorId) : null

  useEffect(()=>{
    const getById = async () =>{
      const response = await getExhibitorId(exhibitorId)
      if(response.success){
        if(response.data !== null && response.data !== undefined){
          setExhibitor(response.data)
        }
      }
    }
    getById()
  }, [])
  // Encontrar eventos relacionados a este expositor (simulado)
  const relatedEvents = exhibitorId
    ? mockEvents.filter((e, index) => index % 5 === Number(exhibitorId) % 5).slice(0, 2)
    : []

  if (!exhibitor) {
    return (
      <div className="text-center py-12">
        <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Selecione um estande no mapa para ver informações</p>
      </div>
    )
  }

  // Obter a cor da categoria
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Máquinas Agrícolas": "bg-blue-100 text-blue-800 border-blue-300",
      Insumos: "bg-green-100 text-green-800 border-green-300",
      "Nutrição Animal": "bg-amber-100 text-amber-800 border-amber-300",
      "Serviços Financeiros": "bg-purple-100 text-purple-800 border-purple-300",
      "Genética Animal": "bg-pink-100 text-pink-800 border-pink-300",
      Irrigação: "bg-cyan-100 text-cyan-800 border-cyan-300",
      Serviços: "bg-indigo-100 text-indigo-800 border-indigo-300",
      Energia: "bg-orange-100 text-orange-800 border-orange-300",
    }
    return colors[category] || "bg-gray-100 text-gray-800 border-gray-300"
  }

  return (
    <ScrollArea className="max-h-[70vh]">
      <div className="pb-4">
        <div className="relative h-40 bg-muted mb-4 rounded-lg overflow-hidden">
          <Image
            src={exhibitor.logo || "/placeholder.svg?height=320&width=640"}
            alt={exhibitor.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 p-4 text-white">
            <Badge className={`mb-2 ${getCategoryColor(exhibitor.category)}`}>{exhibitor.category}</Badge>
            <h2 className="text-xl font-bold">{exhibitor.name}</h2>
          </div>
          <div className="absolute top-2 right-2">
            <FavoriteButton
              id={exhibitor.id}
              type="exhibitor"
              name={exhibitor.name}
              variant="secondary"
              className="bg-white/80 backdrop-blur-sm hover:bg-white/90"
            />
          </div>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="w-full grid grid-cols-3 mb-4">
            <TabsTrigger value="info">Informações</TabsTrigger>
            <TabsTrigger value="location">Localização</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-0">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium mb-2">Sobre</h3>
                <p className="text-sm text-muted-foreground">{exhibitor.description}</p>
              </div>

              <Separator />

              <div className="space-y-3">
                <h3 className="text-sm font-medium">Contato</h3>

                {exhibitor.phone && (
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded-full">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm">{exhibitor.phone}</p>
                      <p className="text-xs text-muted-foreground">Telefone</p>
                    </div>
                  </div>
                )}

                {exhibitor.email && (
                  <div className="flex items-center gap-3">
                    <div className="bg-muted p-2 rounded-full">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm">{exhibitor.email}</p>
                      <p className="text-xs text-muted-foreground">Email</p>
                    </div>
                  </div>
                )}
              </div>

              {exhibitor.website && (
                <>
                  <Separator />
                  <div>
                    <Button asChild variant="outline" className="w-full">
                      <Link
                        href={exhibitor.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2"
                      >
                        <ExternalLink className="h-4 w-4" />
                        Visitar Website
                      </Link>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="location" className="mt-0">
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-background p-2 rounded-full">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{exhibitor.location}</p>
                    <p className="text-xs text-muted-foreground">Área</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-background p-2 rounded-full">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{exhibitor.location}</p>
                    <p className="text-xs text-muted-foreground">Estande</p>
                  </div>
                </div>
              </div>

              <div className="relative h-40 bg-muted rounded-lg overflow-hidden">
                <Image
                  src="/placeholder.svg?height=320&width=640"
                  alt="Localização do estande"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/80 backdrop-blur-sm p-2 rounded-full">
                    <MapPin className="h-6 w-6 text-red-500" />
                  </div>
                </div>
              </div>

              <Button className="w-full" variant="default">
                <Navigation className="h-4 w-4 mr-2" />
                Como Chegar
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="events" className="mt-0">
            {relatedEvents.length > 0 ? (
              <div className="space-y-3">
                {relatedEvents.map((event) => (
                  <div key={event.id} className="bg-muted p-3 rounded-lg relative">
                    <div className="absolute top-2 right-2">
                      <FavoriteButton id={event.id} type="event" name={event.title} variant="ghost" size="sm" />
                    </div>
                    <h3 className="font-medium text-sm pr-8">{event.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{event.date}</span>
                      <Clock className="h-3 w-3 ml-1" />
                      <span>{event.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">{event.description}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Nenhum evento programado</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  )
}

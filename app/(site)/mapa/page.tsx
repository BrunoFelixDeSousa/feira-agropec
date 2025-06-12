"use client"

import type React from "react"

import { ExhibitorInfo } from "@/components/exhibitor-info"
import { MapContainer } from "@/components/map-container"
import { MapLegend } from "@/components/map-legend"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Exhibitor } from "@/lib/types"
import { ChevronLeft, Info, Layers, MapPin, Navigation, Search, X, ZoomIn, ZoomOut } from "lucide-react"
import { useEffect, useState } from "react"

export default function MapaPage() {
  const [selectedExhibitor, setSelectedExhibitor] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [zoomLevel, setZoomLevel] = useState(1)
  const [showInfo, setShowInfo] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [showLegend, setShowLegend] = useState(false)
  const [searchResults, setSearchResults] = useState<Exhibitor[]>([])
  const [userLocation, setUserLocation] = useState<{ x: number; y: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [exhibitors, setExhibitors] = useState<Exhibitor[]>([])

  // Buscar expositores do banco de dados quando o componente montar
    useEffect(() => {
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

      fetchExhibitors();
    }, [])

  // Filtrar resultados de busca quando o termo de busca muda
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([])
      return
    }

    const results = exhibitors.filter(
      (exhibitor) =>
        exhibitor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibitor.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exhibitor.location.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setSearchResults(results)
  }, [searchTerm])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Já estamos filtrando no useEffect
  }

  const handleZoomIn = () => {
    if (zoomLevel < 2) setZoomLevel((prev) => Math.min(prev + 0.2, 2))
  }

  const handleZoomOut = () => {
    if (zoomLevel > 0.6) setZoomLevel((prev) => Math.max(prev - 0.2, 0.6))
  }

  const handleSelectExhibitor = (id: string | null) => {
    setSelectedExhibitor(id)
    if (id) setShowInfo(true)
  }

  const handleSelectSearchResult = (id: string) => {
    setSelectedExhibitor(id)
    setShowInfo(true)
    setShowSearch(false)
  }

  const handleGetUserLocation = () => {
    setIsLocating(true)
    // Simulando a obtenção da localização do usuário
    // Em um cenário real, usaríamos geolocalização e mapeamento para coordenadas do mapa
    setTimeout(() => {
      setUserLocation({ x: 300, y: 350 })
      setIsLocating(false)
    }, 1500)
  }

  return (
    <div className="px-0 py-4 relative">
      <div className="px-4 flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Mapa da Feira</h1>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" onClick={() => setShowSearch(true)}>
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => setShowLegend(!showLegend)}>
            <Layers className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Painel de informações do expositor */}
      {showInfo && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-end justify-center sm:items-center p-0">
          <div className="w-full max-w-lg max-h-[85vh] overflow-auto rounded-t-xl">
            <div className="bg-background p-4 rounded-t-xl">
              <div className="flex items-center justify-between mb-2">
                <Button variant="ghost" size="icon" onClick={() => setShowInfo(false)}>
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <h2 className="text-lg font-bold">Detalhes do Expositor</h2>
                <div className="w-8"></div> {/* Espaçador para centralizar o título */}
              </div>
              {selectedExhibitor ? <ExhibitorInfo exhibitorId={selectedExhibitor} /> : <p>Selecione um expositor para ver os detalhes.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Painel de busca */}
      {showSearch && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex flex-col p-0">
          <div className="bg-background p-4 border-b">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={() => setShowSearch(false)}>
                <X className="h-5 w-5" />
              </Button>
              <form onSubmit={handleSearch} className="flex-1">
                <Input
                  placeholder="Buscar estande, expositor ou categoria..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full"
                />
              </form>
            </div>
          </div>
          <ScrollArea className="flex-1 p-4">
            {searchResults.length > 0 ? (
              <div className="grid gap-2">
                {searchResults.map((exhibitor) => (
                  <Card
                    key={exhibitor.id}
                    className="cursor-pointer"
                    onClick={() => handleSelectSearchResult(exhibitor.id)}
                  >
                    <CardContent className="p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{exhibitor.name}</h3>
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <MapPin className="mr-1 h-3 w-3" />
                            {exhibitor.booth}, {exhibitor.location}
                          </div>
                        </div>
                        <Badge>{exhibitor.category}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : searchTerm.trim() !== "" ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Nenhum resultado encontrado para "{searchTerm}"</p>
              </div>
            ) : (
              <div className="text-center py-8">
                <Search className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Digite para buscar expositores, categorias ou estandes</p>
              </div>
            )}
          </ScrollArea>
        </div>
      )}

      {/* Legenda do mapa */}
      <Sheet open={showLegend} onOpenChange={setShowLegend}>
        <SheetContent side="right" className="w-[85vw] sm:w-[385px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle>Legenda do Mapa</SheetTitle>
          </SheetHeader>
          <ScrollArea className="h-[calc(100vh-5rem)]">
            <div className="p-4">
              <MapLegend />
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <Card className="rounded-none border-x-0 mx-0">
        <CardContent className="p-0">
          <Tabs defaultValue="todos" className="w-full">
            <div className="px-4 pt-4">
              <TabsList className="w-full grid h-auto">
                <TabsTrigger value="todos" className="py-1.5 text-xs">
                  Área Geral
                </TabsTrigger>

              </TabsList>
            </div>

            <div className="relative">
              <TabsContent value="todos" className="mt-0">
                <MapContainer
                  zoomLevel={zoomLevel}
                  onSelectExhibitor={handleSelectExhibitor}
                  userLocation={userLocation}
                />
              </TabsContent>

              {/* Controles do mapa */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleZoomIn}
                  className="h-10 w-10 rounded-full shadow-lg"
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleZoomOut}
                  className="h-10 w-10 rounded-full shadow-lg"
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={handleGetUserLocation}
                  className="h-10 w-10 rounded-full shadow-lg"
                  disabled={isLocating}
                >
                  <Navigation className={`h-5 w-5 ${isLocating ? "animate-pulse" : ""}`} />
                </Button>
              </div>

              {/* Indicador de categoria */}
              <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-md text-xs font-medium border">
                <div className="flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" />
                  <span>Toque nos estandes para ver detalhes</span>
                </div>
              </div>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

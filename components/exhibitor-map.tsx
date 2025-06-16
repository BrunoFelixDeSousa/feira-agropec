"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { useEffect, useState } from "react"

interface ExhibitorMapPosition {
  id: string
  name: string
  category: string
  description?: string
  location?: string
  booth?: string
  website?: string
  phone?: string
  email?: string
  logo?: string
  mapPosition: {
    id: string
    label: string
    area: string
    x: number
    y: number
  }
}

interface ExhibitorMapProps {
  showAll?: boolean
  className?: string
}

export function ExhibitorMap({ showAll = true, className }: ExhibitorMapProps) {
  const [exhibitors, setExhibitors] = useState<ExhibitorMapPosition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedExhibitor, setSelectedExhibitor] = useState<ExhibitorMapPosition | null>(null)

  useEffect(() => {
    async function loadExhibitors() {
      try {
        const response = await fetch('/api/exhibitors')
        const data = await response.json()
        
        if (data.success) {
          // Filtrar apenas expositores com posição no mapa
          const exhibitorsWithPosition = data.data.filter((exhibitor: any) => 
            exhibitor.mapPosition && exhibitor.mapPosition.x && exhibitor.mapPosition.y
          )
          
          setExhibitors(exhibitorsWithPosition)
        }
      } catch (error) {
        console.error("Erro ao carregar expositores:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadExhibitors()
  }, [])

  // Função para obter cor baseada na categoria
  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      "Máquinas Agrícolas": "bg-blue-600",
      "Insumos": "bg-green-600", 
      "Nutrição Animal": "bg-amber-600",
      "Serviços Financeiros": "bg-purple-600",
      "Genética Animal": "bg-pink-600",
      "Irrigação": "bg-cyan-600",
      "Serviços": "bg-indigo-600",
      "Energia": "bg-orange-600",
    }
    return colors[category] || "bg-gray-600"
  }

  // Função para obter inicial da área
  const getAreaInitial = (area: string) => {
    const initials: Record<string, string> = {
      "Setor A": "A",
      "Setor B": "B", 
      "Pavilhão Principal": "P",
      "Praça de Alimentação": "F",
      "Área VIP": "V",
      "Arena Central": "C",
      "Área Geral": "G"
    }
    return initials[area] || "G"
  }

  if (isLoading) {
    return (
      <Card className={className}>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-96" />
        </CardHeader>
        <CardContent>
          <Skeleton className="w-full h-64" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Mapa da Feira - Expositores</span>
          <Badge variant="outline">Interativo</Badge>
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Clique nos pontos vermelhos para ver informações detalhadas dos expositores. 
          A letra no ponto indica a área/setor.
        </p>
      </CardHeader>
      <CardContent>
        <div className="relative w-full">
          {/* Container do mapa */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden">
            {/* Imagem do mapa */}
            <Image
              src="/mapa.jpg"
              alt="Mapa da Feira Agropecuária"
              width={1000}
              height={800}
              className="w-full h-auto"
              priority
            />
            
            {/* Pontos dos expositores */}
            {exhibitors.map((exhibitor, index) => (
              <div
                key={exhibitor.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{
                  left: `${(exhibitor.mapPosition.x / 1000) * 100}%`,
                  top: `${(exhibitor.mapPosition.y / 800) * 100}%`,
                }}
                onClick={() => setSelectedExhibitor(exhibitor)}
              >
                <div className="relative group">
                  {/* Ponto principal */}
                  <div 
                    className={`w-8 h-8 ${getCategoryColor(exhibitor.category)} text-white rounded-full border-2 border-white shadow-lg flex items-center justify-center font-bold text-sm hover:scale-110 transition-transform`}
                  >
                    {getAreaInitial(exhibitor.mapPosition.area)}
                  </div>
                  
                  {/* Tooltip ao passar o mouse */}
                  <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-black/90 text-white text-xs rounded py-2 px-3 min-w-[150px] shadow-lg">
                      <div className="font-medium">{exhibitor.name}</div>
                      <div className="text-gray-300 text-[10px] mt-1">{exhibitor.category}</div>
                      <div className="text-gray-300 text-[10px]">{exhibitor.mapPosition.area}</div>
                    </div>
                  </div>

                  {/* Animação de pulso */}
                  <div className={`absolute inset-0 ${getCategoryColor(exhibitor.category)} rounded-full animate-ping opacity-25`}></div>
                </div>
              </div>
            ))}
          </div>

          {/* Legenda */}
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <h4 className="font-medium text-sm mb-3">Legenda por Categoria</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              {Object.entries({
                "Máquinas Agrícolas": "bg-blue-600",
                "Insumos": "bg-green-600", 
                "Nutrição Animal": "bg-amber-600",
                "Serviços Financeiros": "bg-purple-600",
                "Genética Animal": "bg-pink-600",
                "Irrigação": "bg-cyan-600",
                "Serviços": "bg-indigo-600",
                "Energia": "bg-orange-600",
              }).map(([category, color]) => (
                <div key={category} className="flex items-center gap-2">
                  <div className={`w-3 h-3 ${color} rounded-full`}></div>
                  <span className="text-muted-foreground">{category}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total de expositores */}
          <div className="mt-2 text-center">
            <Badge variant="secondary">
              {exhibitors.length} expositores no mapa
            </Badge>
          </div>
        </div>

        {/* Modal de detalhes do expositor */}
        {selectedExhibitor && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-background rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{selectedExhibitor.name}</h3>
                    <Badge className="mt-1">{selectedExhibitor.category}</Badge>
                  </div>
                  <button
                    onClick={() => setSelectedExhibitor(null)}
                    className="text-muted-foreground hover:text-foreground ml-4"
                  >
                    ✕
                  </button>
                </div>

                {selectedExhibitor.logo && (
                  <div className="mb-4">
                    <Image
                      src={selectedExhibitor.logo}
                      alt={`Logo ${selectedExhibitor.name}`}
                      width={200}
                      height={100}
                      className="rounded-lg object-contain"
                    />
                  </div>
                )}

                <div className="space-y-3 text-sm">
                  {selectedExhibitor.description && (
                    <div>
                      <div className="font-medium text-muted-foreground">Descrição</div>
                      <div>{selectedExhibitor.description}</div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-4">
                    {selectedExhibitor.booth && (
                      <div>
                        <div className="font-medium text-muted-foreground">Estande</div>
                        <div>{selectedExhibitor.booth}</div>
                      </div>
                    )}

                    {selectedExhibitor.location && (
                      <div>
                        <div className="font-medium text-muted-foreground">Localização</div>
                        <div>{selectedExhibitor.location}</div>
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="font-medium text-muted-foreground">Área no Mapa</div>
                    <div className="flex items-center gap-2">
                      <div 
                        className={`w-4 h-4 ${getCategoryColor(selectedExhibitor.category)} text-white rounded-full flex items-center justify-center text-xs font-bold`}
                      >
                        {getAreaInitial(selectedExhibitor.mapPosition.area)}
                      </div>
                      {selectedExhibitor.mapPosition.area}
                    </div>
                  </div>

                  {(selectedExhibitor.phone || selectedExhibitor.email || selectedExhibitor.website) && (
                    <div className="border-t pt-3 mt-4">
                      <div className="font-medium text-muted-foreground mb-2">Contato</div>
                      <div className="space-y-1">
                        {selectedExhibitor.phone && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">📞</span>
                            <a href={`tel:${selectedExhibitor.phone}`} className="hover:underline">
                              {selectedExhibitor.phone}
                            </a>
                          </div>
                        )}
                        {selectedExhibitor.email && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">✉️</span>
                            <a href={`mailto:${selectedExhibitor.email}`} className="hover:underline">
                              {selectedExhibitor.email}
                            </a>
                          </div>
                        )}
                        {selectedExhibitor.website && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">🌐</span>
                            <a 
                              href={selectedExhibitor.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              {selectedExhibitor.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

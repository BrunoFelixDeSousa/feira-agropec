"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, MapPin, X } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface MapPosition {
  x: number
  y: number
  label: string
  area: string
}

interface MapPositionSelectorProps {
  selectedPosition: MapPosition | null
  onPositionSelect: (position: MapPosition) => void
  onClear: () => void
  className?: string
}

export function MapPositionSelector({ 
  selectedPosition, 
  onPositionSelect, 
  onClear,
  className 
}: MapPositionSelectorProps) {
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null)

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    // Usar as mesmas dimensões do MapContainer (1000x800)
    const x = ((event.clientX - rect.left) / rect.width) * 1000
    const y = ((event.clientY - rect.top) / rect.height) * 800

    // Determinar a área baseada na posição clicada (ajustado para 1000x800)
    let area = "Área Geral"
    let label = `Posição (${Math.round(x)}, ${Math.round(y)})`

    // Definir áreas baseadas nas coordenadas (proporcionalmente ajustadas)
    if (x >= 150 && x <= 250 && y >= 192 && y <= 384) {
      area = "Setor A"
      label = `Setor A - Posição personalizada`
    } else if (x >= 725 && x <= 875 && y >= 128 && y <= 384) {
      area = "Setor B"
      label = `Setor B - Posição personalizada`
    } else if (x >= 350 && x <= 650 && y >= 288 && y <= 352) {
      area = "Pavilhão Principal"
      label = `Pavilhão Principal - Posição personalizada`
    } else if (x >= 750 && x <= 875 && y >= 240 && y <= 320) {
      area = "Alimentação"
      label = `Praça de Alimentação - Posição personalizada`
    } else if (x >= 400 && x <= 600 && y >= 560 && y <= 608) {
      area = "VIP"
      label = `Área VIP - Posição personalizada`
    } else if (x >= 437 && x <= 562 && y >= 448 && y <= 512) {
      area = "Arena"
      label = `Arena Central - Posição personalizada`
    }

    onPositionSelect({
      x: Math.round(x),
      y: Math.round(y),
      label,
      area
    })
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    // Usar as mesmas dimensões do MapContainer (1000x800)
    const x = ((event.clientX - rect.left) / rect.width) * 1000
    const y = ((event.clientY - rect.top) / rect.height) * 800
    
    setHoverPosition({ x: Math.round(x), y: Math.round(y) })
  }

  const handleMouseLeave = () => {
    setHoverPosition(null)
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Selecionar Posição no Mapa
          </div>
          {selectedPosition && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClear}
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Clique no mapa para selecionar a posição do expositor. 
          {selectedPosition ? " Posição selecionada!" : " Aguardando seleção..."}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Informações da posição selecionada */}
          {selectedPosition && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Check className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800">Posição Selecionada</span>
              </div>
              <div className="text-sm space-y-1">
                <div><strong>Área:</strong> {selectedPosition.area}</div>
                <div><strong>Coordenadas:</strong> ({selectedPosition.x}, {selectedPosition.y})</div>
                <div><strong>Descrição:</strong> {selectedPosition.label}</div>
              </div>
            </div>
          )}

          {/* Container do mapa */}
          <div className="relative bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
            <div 
              className="relative cursor-crosshair"
              onClick={handleMapClick}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
            >
              {/* Imagem do mapa */}
              <Image
                src="/mapa.jpg"
                alt="Mapa da Feira - Clique para selecionar posição"
                width={1000}
                height={800}
                className="w-full h-auto select-none"
                priority
                draggable={false}
              />
              
              {/* Posição selecionada */}
              {selectedPosition && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                  style={{
                    left: `${(selectedPosition.x / 1000) * 100}%`,
                    top: `${(selectedPosition.y / 800) * 100}%`,
                  }}
                >
                  <div className="relative">
                    <div className="w-6 h-6 bg-green-500 border-3 border-white rounded-full shadow-lg animate-pulse">
                      <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-5 h-5 bg-white rounded-full border border-gray-300 text-[10px] flex items-center justify-center font-bold text-green-600">
                      ✓
                    </div>
                  </div>
                </div>
              )}

              {/* Posição do hover (preview) */}
              {hoverPosition && !selectedPosition && (
                <div
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none"
                  style={{
                    left: `${(hoverPosition.x / 1000) * 100}%`,
                    top: `${(hoverPosition.y / 800) * 100}%`,
                  }}
                >
                  <div className="w-4 h-4 bg-blue-400 border-2 border-white rounded-full opacity-70">
                    <div className="absolute inset-0 bg-blue-400 rounded-full animate-ping opacity-50"></div>
                  </div>
                </div>
              )}
            </div>

            {/* Coordenadas do hover */}
            {hoverPosition && (
              <div className="absolute top-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded z-30">
                ({hoverPosition.x}, {hoverPosition.y})
              </div>
            )}
          </div>

          <p className="text-xs text-muted-foreground text-center">
            💡 Dica: Clique em qualquer ponto do mapa para definir a posição do expositor
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

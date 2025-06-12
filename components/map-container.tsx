"use client"

import type React from "react"

import { getAllExhibitor } from "@/app/api/exhibitors/actions"
import { Exhibitor } from "@prisma/client"
import { Navigation } from "lucide-react"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"

interface MapContainerProps {
  zoomLevel: number
  onSelectExhibitor: (id: string | null) => void
  filter?: string
  userLocation?: { x: number; y: number } | null
}

// Cores por categoria para os marcadores
const categoryColors: Record<string, string> = {
  "Máquinas Agrícolas": "bg-blue-600",
  Insumos: "bg-green-600",
  "Nutrição Animal": "bg-amber-600",
  "Serviços Financeiros": "bg-purple-600",
  "Genética Animal": "bg-pink-600",
  Irrigação: "bg-cyan-600",
  Serviços: "bg-indigo-600",
  Energia: "bg-orange-600",
}

type mapPosition = {
  x: number
  y: number
}

export function MapContainer({ zoomLevel, onSelectExhibitor, filter, userLocation }: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [mapDimensions, setMapDimensions] = useState({ width: 1000, height: 800 })
  const [showTooltip, setShowTooltip] = useState<{ id: string; x: number; y: number } | null>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [exhibitorData, setExhibitorData]= useState<Exhibitor[]>([])
  // Filtrar expositores com base no filtro selecionado
  useEffect(()=>{
    const getApi = async()=>{
      const response = await getAllExhibitor()
      if(response.success){
        if (response.data !== undefined){
          setExhibitorData(response.data)
        }
      }
    }
    getApi()
  },[])

  const filteredExhibitors = filter
    ? exhibitorData.filter((exhibitor) => exhibitor.location === filter)
    : exhibitorData

  // Centralizar o mapa quando o componente é montado ou o filtro muda
  useEffect(() => {
    if (containerRef.current && mapLoaded) {
      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight

      // Centralizar o mapa
      setPosition({
        x: (containerWidth - mapDimensions.width * zoomLevel) / 2,
        y: (containerHeight - mapDimensions.height * zoomLevel) / 2,
      })
    }
  }, [filter, mapLoaded, mapDimensions, zoomLevel])

  // Ajustar posição quando o zoom muda
  useEffect(() => {
    if (containerRef.current && mapLoaded) {
      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight

      // Manter o centro do mapa ao fazer zoom
      const centerX = containerWidth / 2
      const centerY = containerHeight / 2

      const currentCenterX = position.x + (mapDimensions.width * zoomLevel) / 2
      const currentCenterY = position.y + (mapDimensions.height * zoomLevel) / 2

      const newX = position.x - (currentCenterX - centerX) * 0.2
      const newY = position.y - (currentCenterY - centerY) * 0.2

      setPosition({ x: newX, y: newY })
    }
  }, [zoomLevel])

  // Centralizar no usuário quando a localização é definida
  useEffect(() => {
    if (userLocation && containerRef.current && mapLoaded) {
      const containerWidth = containerRef.current.clientWidth
      const containerHeight = containerRef.current.clientHeight

      // Centralizar no usuário
      setPosition({
        x: containerWidth / 2 - userLocation.x * zoomLevel,
        y: containerHeight / 2 - userLocation.y * zoomLevel,
      })
    }
  }, [userLocation, zoomLevel, mapLoaded])

  // Handlers para mouse
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return

    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y,
    })
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Handlers para touch (mobile)
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true)
    setStartPos({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    })
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return

    setPosition({
      x: e.touches[0].clientX - startPos.x,
      y: e.touches[0].clientY - startPos.y,
    })
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
  }

  const handleExhibitorClick = (id: string) => {
    setShowTooltip(null)
    onSelectExhibitor(id)
  }

  const handleExhibitorHover = (id: string, x: number, y: number) => {
    const exhibitor = exhibitorData.find((e) => e.id === id)
    if (exhibitor) {
      setShowTooltip({ id, x, y })
    }
  }

  const handleMapLoad = () => {
    setMapLoaded(true)
  }

  useEffect(() => {
    const handleMouseLeave = () => {
      setIsDragging(false)
    }

    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("touchend", handleTouchEnd)

    return () => {
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("touchend", handleTouchEnd)
    }
  }, [])

  // Obter a cor do marcador com base na categoria
  const getMarkerColor = (category: string) => {
    return categoryColors[category] || "bg-gray-600"
  }

  return (
    <div className="relative w-full h-[calc(100vh-13rem)] overflow-hidden bg-muted/20" ref={containerRef}>
      <div
        className="absolute cursor-grab active:cursor-grabbing"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${zoomLevel})`,
          transformOrigin: "center",
          transition: isDragging ? "none" : "transform 0.2s ease-out",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={mapRef}
      >
        <div className="relative" style={{ width: mapDimensions.width, height: mapDimensions.height }}>
          <Image
            src="/mapa.jpg?height=800&width=1000"
            alt="Mapa da Feira"
            width={mapDimensions.width}
            height={mapDimensions.height}
            className="object-contain"
            onLoad={handleMapLoad}
            priority
          />

          {/* Grade de referência */}
          <div className="absolute inset-0 grid grid-cols-10 grid-rows-8 pointer-events-none">
            {Array.from({ length: 10 }).map((_, colIndex) => (
              <div key={`col-${colIndex}`} className="border-r border-gray-300/20 relative">
                <span className="absolute top-0 left-0 text-xs text-gray-500 bg-white/80 px-1 rounded">
                  {String.fromCharCode(65 + colIndex)}
                </span>
              </div>
            ))}
            {Array.from({ length: 8 }).map((_, rowIndex) => (
              <div key={`row-${rowIndex}`} className="border-b border-gray-300/20 col-span-10 relative">
                <span className="absolute top-0 left-0 text-xs text-gray-500 bg-white/80 px-1 rounded">
                  {rowIndex + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Marcadores dos estandes */}
          {filteredExhibitors.map((exhibitor) => {
            const pos = exhibitor.mapPosition as mapPosition | null;
            return (
              <div
                key={exhibitor.id}
                className={`absolute ${getMarkerColor(exhibitor.category)} text-white rounded-full w-10 h-10 flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-lg`}
                style={{
                  left: pos ? `${pos.x}px` : undefined,
                  top: pos ? `${pos.y}px` : undefined,
                  transform: "translate(-50%, -50%)",
                }}
                onClick={() => handleExhibitorClick(exhibitor.id)}
                onMouseEnter={() => {
                  if (pos && typeof pos.x === "number" && typeof pos.y === "number") {
                    handleExhibitorHover(exhibitor.id, pos.x, pos.y);
                  }
                }}
                onMouseLeave={() => setShowTooltip(null)}
              >
                <span className="font-medium">{exhibitor.name}</span>
              </div>
            );
          })}

          {/* Tooltip ao passar o mouse */}
          {showTooltip && (
            <div
              className="absolute bg-white p-2 rounded shadow-lg z-10 w-48 pointer-events-none"
              style={{
                left: `${showTooltip.x}px`,
                top: `${showTooltip.y - 70}px`,
                transform: "translate(-50%, -100%)",
              }}
            >
              <div className="text-sm font-bold truncate">
                {exhibitorData.find((e) => e.id === showTooltip.id)?.name}
              </div>
              <div className="text-xs text-muted-foreground">
                {exhibitorData.find((e) => e.id === showTooltip.id)?.category}
              </div>
            </div>
          )}

          {/* Localização do usuário */}
          {userLocation && (
            <div
              className="absolute bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center animate-pulse"
              style={{
                left: `${userLocation.x}px`,
                top: `${userLocation.y}px`,
                transform: "translate(-50%, -50%)",
                boxShadow: "0 0 0 8px rgba(37, 99, 235, 0.2)",
              }}
            >
              <Navigation className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

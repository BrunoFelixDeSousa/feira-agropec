"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { toast } from "@/components/ui/use-toast"
import { mockExhibitors } from "@/lib/mock-data"
import { useState } from "react"

export function MapEditor() {
  const [zoom, setZoom] = useState([100])
  const [mapImage, setMapImage] = useState("/map-placeholder.jpg")

  const handleSave = () => {
    toast({
      title: "Mapa salvo",
      description: "As alterações no mapa foram salvas com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <div className="grid gap-2 flex-1">
            <Label htmlFor="map-image">Imagem do Mapa</Label>
            <Input id="map-image" type="file" />
          </div>
          <div className="grid gap-2 w-[200px]">
            <Label>Zoom ({zoom}%)</Label>
            <Slider value={zoom} min={50} max={200} step={5} onValueChange={setZoom} />
          </div>
        </div>

        <div className="border rounded-md p-4 min-h-[500px] relative">
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
            Visualização do mapa com expositores posicionados
          </div>

          {/* Aqui seria implementado o editor visual do mapa */}
          <div className="grid grid-cols-4 gap-2 absolute bottom-4 left-4 right-4 bg-background/80 p-2 rounded-md backdrop-blur">
            {mockExhibitors.slice(0, 8).map((exhibitor) => (
              <div key={exhibitor.id} className="border rounded-md p-2 text-xs cursor-move hover:bg-accent" draggable>
                {exhibitor.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Cancelar</Button>
        <Button onClick={handleSave}>Salvar Mapa</Button>
      </div>
    </div>
  )
}

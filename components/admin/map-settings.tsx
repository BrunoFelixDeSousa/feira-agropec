"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/hooks/use-toast"
import { useState } from "react"

export function MapSettings() {
  const [settings, setSettings] = useState({
    defaultZoom: 100,
    enableZoom: true,
    enableDrag: true,
    showLabels: true,
    labelSize: "medium",
    highlightFavorites: true,
  })

  const handleSave = () => {
    toast({
      title: "Configurações salvas",
      description: "As configurações do mapa foram salvas com sucesso.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="default-zoom">Zoom Padrão (%)</Label>
          <Input
            id="default-zoom"
            type="number"
            value={settings.defaultZoom}
            onChange={(e) => setSettings({ ...settings, defaultZoom: Number.parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="label-size">Tamanho dos Rótulos</Label>
          <Select value={settings.labelSize} onValueChange={(value) => setSettings({ ...settings, labelSize: value })}>
            <SelectTrigger id="label-size">
              <SelectValue placeholder="Selecione o tamanho" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="small">Pequeno</SelectItem>
              <SelectItem value="medium">Médio</SelectItem>
              <SelectItem value="large">Grande</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="enable-zoom" className="cursor-pointer">
            Habilitar Zoom
          </Label>
          <Switch
            id="enable-zoom"
            checked={settings.enableZoom}
            onCheckedChange={(checked) => setSettings({ ...settings, enableZoom: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="enable-drag" className="cursor-pointer">
            Habilitar Arrasto
          </Label>
          <Switch
            id="enable-drag"
            checked={settings.enableDrag}
            onCheckedChange={(checked) => setSettings({ ...settings, enableDrag: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="show-labels" className="cursor-pointer">
            Mostrar Rótulos
          </Label>
          <Switch
            id="show-labels"
            checked={settings.showLabels}
            onCheckedChange={(checked) => setSettings({ ...settings, showLabels: checked })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="highlight-favorites" className="cursor-pointer">
            Destacar Favoritos
          </Label>
          <Switch
            id="highlight-favorites"
            checked={settings.highlightFavorites}
            onCheckedChange={(checked) => setSettings({ ...settings, highlightFavorites: checked })}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline">Restaurar Padrões</Button>
        <Button onClick={handleSave}>Salvar Configurações</Button>
      </div>
    </div>
  )
}

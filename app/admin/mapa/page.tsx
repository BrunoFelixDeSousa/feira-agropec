import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapEditor } from "@/components/admin/map-editor"
import { MapSettings } from "@/components/admin/map-settings"

export default function MapPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Gerenciamento do Mapa</h2>
      </div>

      <Tabs defaultValue="editor" className="space-y-4">
        <TabsList>
          <TabsTrigger value="editor">Editor do Mapa</TabsTrigger>
          <TabsTrigger value="settings">Configurações</TabsTrigger>
        </TabsList>
        <TabsContent value="editor" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Editor do Mapa</CardTitle>
              <CardDescription>Arraste e solte os expositores para posicioná-los no mapa</CardDescription>
            </CardHeader>
            <CardContent>
              <MapEditor />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Mapa</CardTitle>
              <CardDescription>Configure as opções do mapa da feira</CardDescription>
            </CardHeader>
            <CardContent>
              <MapSettings />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

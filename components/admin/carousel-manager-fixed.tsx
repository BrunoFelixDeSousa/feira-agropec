"use client"

import { Edit, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"

// Tipo para os slides
interface CarouselSlide {
  id: string
  title: string
  description: string
  image: string
  link?: string
  order: number
  active: boolean
  createdAt?: Date
  updatedAt?: Date
}

export function CarouselManager() {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)
  
  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    link: "",
    active: true,
  })

  // Carregar slides do banco
  useEffect(() => {
    loadSlides()
  }, [])

  // Reset form when editing slide changes
  useEffect(() => {
    if (editingSlide) {
      setFormData({
        title: editingSlide.title,
        description: editingSlide.description,
        image: editingSlide.image,
        link: editingSlide.link || "",
        active: editingSlide.active,
      })
    } else {
      setFormData({
        title: "",
        description: "",
        image: "",
        link: "",
        active: true,
      })
    }
  }, [editingSlide])

  const loadSlides = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/carousel')
      const data = await response.json()
      
      if (data.success) {
        setSlides(data.data)
      } else {
        toast({
          title: "Erro",
          description: "Falha ao carregar slides",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao conectar com o servidor",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Upload de imagem
  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true)
      
      const formDataUpload = new FormData()
      formDataUpload.append('file', file)
      
      const response = await fetch('/api/upload/carousel', {
        method: 'POST',
        body: formDataUpload,
      })
      
      const data = await response.json()
      
      if (data.success) {
        setFormData(prev => ({ ...prev, image: data.data.url }))
        toast({
          title: "Sucesso",
          description: "Imagem enviada com sucesso",
        })
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao enviar imagem",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao enviar imagem",
        variant: "destructive",
      })
    } finally {
      setUploadingImage(false)
    }
  }

  // Submeter formulário
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.title.trim() || !formData.description.trim() || !formData.image) {
      toast({
        title: "Erro",
        description: "Título, descrição e imagem são obrigatórios",
        variant: "destructive",
      })
      return
    }

    try {
      const method = editingSlide ? 'PUT' : 'POST'
      const body = editingSlide 
        ? { ...formData, id: editingSlide.id }
        : formData

      const response = await fetch('/api/carousel', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: editingSlide ? "Slide atualizado com sucesso" : "Slide criado com sucesso",
        })
        
        setIsDialogOpen(false)
        setEditingSlide(null)
        loadSlides() // Recarregar lista
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao salvar slide",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar slide",
        variant: "destructive",
      })
    }
  }

  // Deletar slide
  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este slide?')) return

    try {
      const response = await fetch(`/api/carousel?id=${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: "Slide deletado com sucesso",
        })
        loadSlides()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao deletar slide",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao deletar slide",
        variant: "destructive",
      })
    }
  }

  // Toggle ativo/inativo
  const handleToggleActive = async (slide: CarouselSlide) => {
    try {
      const response = await fetch('/api/carousel', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: slide.id,
          active: !slide.active,
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: "Sucesso",
          description: `Slide ${!slide.active ? 'ativado' : 'desativado'} com sucesso`,
        })
        loadSlides()
      } else {
        toast({
          title: "Erro",
          description: data.error || "Erro ao alterar status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao alterar status",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-end">
          <Button disabled>
            <Plus className="mr-2 h-4 w-4" />
            Carregando...
          </Button>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-32 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSlide(null)}>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingSlide ? "Editar Slide" : "Adicionar Slide"}</DialogTitle>
              <DialogDescription>
                {editingSlide ? "Edite as informações do slide." : "Adicione um novo slide ao carousel."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Título</Label>
                <Input
                  id="title"
                  placeholder="Digite o título do slide"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Digite a descrição do slide"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image">Imagem</Label>
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                  disabled={uploadingImage}
                />
                {uploadingImage && (
                  <div className="text-sm text-muted-foreground">
                    Enviando imagem...
                  </div>
                )}
                {formData.image && (
                  <div className="relative h-32 w-full rounded-lg overflow-hidden border">
                    <Image
                      src={formData.image}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Selecione uma imagem do seu computador (máx. 5MB)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="link">Link (opcional)</Label>
                <Input
                  id="link"
                  placeholder="https://exemplo.com"
                  value={formData.link}
                  onChange={(e) => setFormData(prev => ({ ...prev, link: e.target.value }))}
                />
                <p className="text-sm text-muted-foreground">
                  URL para onde o slide deve redirecionar quando clicado
                </p>
              </div>

              <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <Label className="text-base">Ativo</Label>
                  <p className="text-sm text-muted-foreground">
                    O slide será exibido no carousel quando ativo
                  </p>
                </div>
                <Switch
                  checked={formData.active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
                />
              </div>

              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">
                  {editingSlide ? "Atualizar" : "Criar"} Slide
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {slides.map((slide) => (
          <Card key={slide.id}>
            <CardHeader>
              <CardTitle className="text-lg">{slide.title}</CardTitle>
              <CardDescription>{slide.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-32 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={slide.image || "/placeholder.svg"}
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={slide.active}
                    onCheckedChange={() => handleToggleActive(slide)}
                  />
                  <span className="text-sm text-muted-foreground">
                    {slide.active ? "Ativo" : "Inativo"}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditingSlide(slide)
                      setIsDialogOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(slide.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {slides.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum slide encontrado. Adicione o primeiro slide!</p>
        </div>
      )}
    </div>
  )
}

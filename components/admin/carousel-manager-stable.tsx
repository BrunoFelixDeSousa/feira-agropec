"use client"

import { Edit, Plus, Trash2, Upload } from "lucide-react"
import Image from "next/image"
import React, { useEffect, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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

// Tipo para o formulário
interface FormData {
  title: string
  description: string
  image: string
  link: string
  active: boolean
}

export function CarouselManager() {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    image: "",
    link: "",
    active: true,
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar slides
  const loadSlides = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/carousel')
      const data = await response.json()
      
      if (data.success) {
        setSlides(data.data || [])
      } else {
        toast({
          title: "Erro",
          description: "Erro ao carregar slides",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erro ao carregar slides:", error)
      toast({
        title: "Erro",
        description: "Erro ao carregar slides",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Carregar slides na inicialização
  useEffect(() => {
    loadSlides()
  }, [])

  // Resetar formulário quando slide em edição mudar
  useEffect(() => {
    if (editingSlide) {
      setFormData({
        title: editingSlide.title,
        description: editingSlide.description || "",
        image: editingSlide.image,
        link: editingSlide.link || "",
        active: editingSlide.active,
      })
      setImagePreview(editingSlide.image)
    } else {
      setFormData({
        title: "",
        description: "",
        image: "",
        link: "",
        active: true,
      })
      setImagePreview("")
    }
  }, [editingSlide])

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
        const imageUrl = data.data.url
        setFormData(prev => ({ ...prev, image: imageUrl }))
        setImagePreview(imageUrl)
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
      console.error("Erro no upload:", error)
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
    if (!formData.title.trim()) {
      toast({
        title: "Erro",
        description: "Título é obrigatório",
        variant: "destructive",
      })
      return
    }
    
    if (!formData.image.trim()) {
      toast({
        title: "Erro",
        description: "Imagem é obrigatória",
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
      console.error("Erro ao salvar:", error)
      toast({
        title: "Erro",
        description: "Erro ao salvar slide",
        variant: "destructive",
      })
    }
  }

  // Deletar slide
  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar este slide?")) {
      return
    }

    try {
      const response = await fetch('/api/carousel', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
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
      console.error("Erro ao deletar:", error)
      toast({
        title: "Erro",
        description: "Erro ao deletar slide",
        variant: "destructive",
      })
    }
  }

  // Alternar status ativo/inativo
  // const handleToggleActive = async (slide: CarouselSlide) => {
  //   try {
  //     const response = await fetch('/api/carousel', {
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ 
  //         id: slide.id,
  //         active: !slide.active 
  //       }),
  //     })

  //     const data = await response.json()

  //     if (data.success) {
  //       toast({
  //         title: "Sucesso",
  //         description: `Slide ${!slide.active ? 'ativado' : 'desativado'} com sucesso`,
  //       })
  //       loadSlides()
  //     } else {
  //       toast({
  //         title: "Erro",
  //         description: data.error || "Erro ao alterar status do slide",
  //         variant: "destructive",
  //       })
  //     }
  //   } catch (error) {
  //     console.error("Erro ao alterar status:", error)
  //     toast({
  //       title: "Erro",
  //       description: "Erro ao alterar status do slide",
  //       variant: "destructive",
  //     })
  //   }
  // }

  // Abrir diálogo para novo slide
  const handleNew = () => {
    setEditingSlide(null)
    setIsDialogOpen(true)
  }

  // Abrir diálogo para editar slide
  const handleEdit = (slide: CarouselSlide) => {
    setEditingSlide(slide)
    setIsDialogOpen(true)
  }

  // Fechar diálogo
  const handleCloseDialog = () => {
    setIsDialogOpen(false)
    setEditingSlide(null)
  }

  // Atualizar campo do formulário
  const updateFormField = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando slides...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Slides do Carousel</h3>
        <Button onClick={handleNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Novo Slide
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {slides.map((slide) => (
          <Card key={slide.id} className={`${!slide.active ? 'opacity-60' : ''}`}>
            <CardHeader>
              <div className="relative h-40 rounded-md overflow-hidden">
                <Image 
                  src={slide.image} 
                  alt={slide.title}
                  fill
                  className="object-cover"
                />
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-sm line-clamp-2">{slide.title}</CardTitle>
              <CardDescription className="line-clamp-3 mt-2">
                {slide.description}
              </CardDescription>
              {slide.link && (
                <p className="text-xs text-muted-foreground mt-2">
                  Link: {slide.link}
                </p>
              )}
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {/* <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleToggleActive(slide)}
                >
                  {slide.active ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )}
                </Button> */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(slide)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(slide.id)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {slides.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">Nenhum slide encontrado.</p>
            <Button onClick={handleNew} className="mt-4">
              Criar primeiro slide
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingSlide ? "Editar Slide" : "Novo Slide"}
            </DialogTitle>
            <DialogDescription>
              {editingSlide ? "Atualize as informações do slide." : "Adicione um novo slide ao carousel."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => updateFormField('title', e.target.value)}
                placeholder="Digite o título do slide"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => updateFormField('description', e.target.value)}
                placeholder="Digite a descrição do slide"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Imagem</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      handleImageUpload(file)
                    }
                  }}
                  accept="image/*"
                  className="hidden"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingImage}
                  className="flex items-center gap-2"
                >
                  <Upload className="h-4 w-4" />
                  {uploadingImage ? "Enviando..." : "Escolher Imagem"}
                </Button>
                {imagePreview && (
                  <div className="relative h-16 w-16 rounded-md overflow-hidden">
                    <Image 
                      src={imagePreview} 
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link">Link (opcional)</Label>
              <Input
                id="link"
                type="url"
                value={formData.link}
                onChange={(e) => updateFormField('link', e.target.value)}
                placeholder="https://exemplo.com"
              />
            </div>

            {/* <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => updateFormField('active', checked)}
              />
              <Label htmlFor="active">Slide ativo</Label>
            </div> */}

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleCloseDialog}>
                Cancelar
              </Button>
              <Button type="submit" disabled={uploadingImage}>
                {editingSlide ? "Atualizar" : "Criar"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

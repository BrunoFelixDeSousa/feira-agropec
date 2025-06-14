"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, Plus, Trash2 } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

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
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
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

// Schema de validação
const formSchema = z.object({
  title: z.string().min(2, {
    message: "O título deve ter pelo menos 2 caracteres",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres",
  }),
  image: z.string().min(1, {
    message: "A imagem é obrigatória",
  }),
  link: z.string().optional(),
  active: z.boolean(),
})

type FormValues = z.infer<typeof formSchema>

export function CarouselManager() {
  const [slides, setSlides] = useState<CarouselSlide[]>([])
  const [editingSlide, setEditingSlide] = useState<CarouselSlide | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [uploadingImage, setUploadingImage] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
      link: "",
      active: true,
    },
  })

  // Carregar slides do banco
  useEffect(() => {
    loadSlides()
  }, [])

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

  // Resetar formulário quando slide em edição mudar
  useEffect(() => {
    if (editingSlide) {
      form.reset({
        title: editingSlide.title,
        description: editingSlide.description,
        image: editingSlide.image,
        link: editingSlide.link || "",
        active: editingSlide.active,
      })
    } else {
      form.reset({
        title: "",
        description: "",
        image: "",
        link: "",
        active: true,
      })
    }
  }, [editingSlide, form])

  // Upload de imagem
  const handleImageUpload = async (file: File) => {
    try {
      setUploadingImage(true)
      
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/upload/carousel', {
        method: 'POST',
        body: formData,
      })
      
      const data = await response.json()
      
      if (data.success) {
        form.setValue('image', data.data.url)
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
  const onSubmit = async (values: FormValues) => {
    try {
      const method = editingSlide ? 'PUT' : 'POST'
      const body = editingSlide 
        ? { ...values, id: editingSlide.id }
        : values

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
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o título do slide" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Digite a descrição do slide" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Imagem</FormLabel>
                      <FormControl>
                        <div className="space-y-4">
                          <Input
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
                          {field.value && (
                            <div className="relative h-32 w-full rounded-lg overflow-hidden border">
                              <Image
                                src={field.value}
                                alt="Preview"
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription>
                        Selecione uma imagem do seu computador (máx. 5MB)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Link (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com" {...field} />
                      </FormControl>
                      <FormDescription>
                        URL para onde o slide deve redirecionar quando clicado
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Ativo</FormLabel>
                        <FormDescription>
                          O slide será exibido no carousel quando ativo
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">
                    {editingSlide ? "Atualizar" : "Criar"} Slide
                  </Button>
                </DialogFooter>
              </form>
            </Form>
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

"use client"

import React from "react"

import { useState } from "react"
import Image from "next/image"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Trash2, Plus, ArrowUp, ArrowDown, Edit } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/hooks/use-toast"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Dados de exemplo para o carousel
const initialSlides = [
  {
    id: "1",
    title: "Bem-vindo à Feira Agropecuária 2023",
    description: "Venha conhecer as novidades do agronegócio",
    imageUrl: "/placeholder.svg?height=500&width=1000",
    buttonText: "Saiba mais",
    buttonUrl: "/sobre",
    active: true,
  },
  {
    id: "2",
    title: "Exposição de Animais",
    description: "Conheça as melhores raças do país",
    imageUrl: "/placeholder.svg?height=500&width=1000",
    buttonText: "Ver animais",
    buttonUrl: "/expositores",
    active: true,
  },
  {
    id: "3",
    title: "Shows e Eventos",
    description: "Confira a programação completa",
    imageUrl: "/placeholder.svg?height=500&width=1000",
    buttonText: "Programação",
    buttonUrl: "/programacao",
    active: false,
  },
]

const formSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres",
  }),
  imageUrl: z.string().url({
    message: "Insira uma URL válida para a imagem",
  }),
  buttonText: z.string().min(2, {
    message: "O texto do botão deve ter pelo menos 2 caracteres",
  }),
  buttonUrl: z.string().min(1, {
    message: "A URL do botão é obrigatória",
  }),
  active: z.boolean().default(true),
})

type FormValues = z.infer<typeof formSchema>

export function CarouselManager() {
  const [slides, setSlides] = useState(initialSlides)
  const [editingSlide, setEditingSlide] = useState<(typeof initialSlides)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: editingSlide?.title || "",
      description: editingSlide?.description || "",
      imageUrl: editingSlide?.imageUrl || "",
      buttonText: editingSlide?.buttonText || "",
      buttonUrl: editingSlide?.buttonUrl || "",
      active: editingSlide?.active || true,
    },
  })

  // Resetar o formulário quando o slide em edição mudar
  React.useEffect(() => {
    if (editingSlide) {
      form.reset({
        title: editingSlide.title,
        description: editingSlide.description,
        imageUrl: editingSlide.imageUrl,
        buttonText: editingSlide.buttonText,
        buttonUrl: editingSlide.buttonUrl,
        active: editingSlide.active,
      })
    } else {
      form.reset({
        title: "",
        description: "",
        imageUrl: "",
        buttonText: "",
        buttonUrl: "",
        active: true,
      })
    }
  }, [editingSlide, form])

  function onSubmit(values: FormValues) {
    if (editingSlide) {
      // Atualizar slide existente
      setSlides(slides.map((slide) => (slide.id === editingSlide.id ? { ...slide, ...values } : slide)))
      toast({
        title: "Slide atualizado",
        description: "O slide foi atualizado com sucesso.",
      })
    } else {
      // Adicionar novo slide
      const newSlide = {
        id: Date.now().toString(),
        ...values,
      }
      setSlides([...slides, newSlide])
      toast({
        title: "Slide adicionado",
        description: "O novo slide foi adicionado com sucesso.",
      })
    }

    setIsDialogOpen(false)
    setEditingSlide(null)
  }

  function handleEdit(slide: (typeof initialSlides)[0]) {
    setEditingSlide(slide)
    setIsDialogOpen(true)
  }

  function handleDelete(id: string) {
    setSlides(slides.filter((slide) => slide.id !== id))
    toast({
      title: "Slide removido",
      description: "O slide foi removido com sucesso.",
    })
  }

  function handleMoveUp(index: number) {
    if (index === 0) return
    const newSlides = [...slides]
    const temp = newSlides[index]
    newSlides[index] = newSlides[index - 1]
    newSlides[index - 1] = temp
    setSlides(newSlides)
  }

  function handleMoveDown(index: number) {
    if (index === slides.length - 1) return
    const newSlides = [...slides]
    const temp = newSlides[index]
    newSlides[index] = newSlides[index + 1]
    newSlides[index + 1] = temp
    setSlides(newSlides)
  }

  function handleToggleActive(id: string) {
    setSlides(slides.map((slide) => (slide.id === id ? { ...slide, active: !slide.active } : slide)))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Slides do Carousel</h3>
          <p className="text-sm text-muted-foreground">Gerencie os slides que aparecem no carousel da página inicial</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingSlide(null)}>
              <Plus className="mr-2 h-4 w-4" /> Adicionar Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingSlide ? "Editar Slide" : "Adicionar Novo Slide"}</DialogTitle>
              <DialogDescription>
                Preencha os campos abaixo para {editingSlide ? "editar o" : "adicionar um novo"} slide ao carousel.
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
                        <Input placeholder="Título do slide" {...field} />
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
                        <Textarea placeholder="Descrição do slide" className="resize-none" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <Input placeholder="https://exemplo.com/imagem.jpg" {...field} />
                      </FormControl>
                      <FormDescription>URL da imagem que será exibida no slide</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="buttonText"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Texto do Botão</FormLabel>
                        <FormControl>
                          <Input placeholder="Saiba mais" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="buttonUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL do Botão</FormLabel>
                        <FormControl>
                          <Input placeholder="/pagina" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel>Ativo</FormLabel>
                        <FormDescription>Ativar ou desativar a exibição deste slide</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button type="submit">{editingSlide ? "Salvar Alterações" : "Adicionar Slide"}</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {slides.map((slide, index) => (
          <Card key={slide.id} className={!slide.active ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{slide.title}</CardTitle>
                  <CardDescription>{slide.description}</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" onClick={() => handleMoveUp(index)} disabled={index === 0}>
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleMoveDown(index)}
                    disabled={index === slides.length - 1}
                  >
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative w-full md:w-1/3 h-40 rounded-md overflow-hidden">
                  <Image src={slide.imageUrl || "/placeholder.svg"} alt={slide.title} fill className="object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-sm font-medium">Botão</h4>
                      <p className="text-sm">{slide.buttonText}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">URL</h4>
                      <p className="text-sm truncate">{slide.buttonUrl}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium">Status</h4>
                      <div className="flex items-center mt-1">
                        <Switch checked={slide.active} onCheckedChange={() => handleToggleActive(slide.id)} />
                        <span className="ml-2 text-sm">{slide.active ? "Ativo" : "Inativo"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(slide)}>
                <Edit className="mr-2 h-4 w-4" /> Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(slide.id)}>
                <Trash2 className="mr-2 h-4 w-4" /> Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

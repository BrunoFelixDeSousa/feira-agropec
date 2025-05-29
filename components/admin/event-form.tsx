"use client"

import type React from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Clock, Info, MapPin, Star, Tag, Upload, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { createEventAction, updateEventAction } from "@/app/admin/eventos/actions"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { paths } from "@/lib/paths"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  title: z.string().min(3, {
    message: "O título deve ter pelo menos 3 caracteres",
  }),
  description: z.string().min(10, {
    message: "A descrição deve ter pelo menos 10 caracteres",
  }),
  date: z.date({
    required_error: "Selecione uma data para o evento",
  }),
  time: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Formato de hora inválido (HH:MM)",
  }),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, {
    message: "Formato de hora inválido (HH:MM)",
  }),
  location: z.string().min(3, {
    message: "O local deve ter pelo menos 3 caracteres",
  }),
  type: z.string({
    required_error: "Selecione uma categoria",
  }),
  featured: z.boolean(),
  image: z.string().optional(),
  tags: z.array(z.string()),
})

type FormValues = z.infer<typeof formSchema>

interface EventFormProps {
  event?: any
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>(event?.image || "")
  const [currentTag, setCurrentTag] = useState("")
  const [activeTab, setActiveTab] = useState("informacoes")

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: event?.title ?? "",
      description: event?.description ?? "",
      date: event?.date ? new Date(event.date) : new Date(),
      time: event?.time ?? "09:00",
      endTime: event?.endTime ?? "10:00",
      location: event?.location ?? "",
      type: event?.type ?? "palestra",
      featured: event?.featured ?? false,
      image: event?.image ?? "",
      tags: event?.tags ?? [],
    },
  })

  const watchedValues = form.watch()

  const addTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevenir o comportamento padrão para evitar submissão do formulário
    e.preventDefault()

    if (currentTag.trim() && !watchedValues.tags.includes(currentTag.trim())) {
      form.setValue("tags", [...watchedValues.tags, currentTag.trim()])
      setCurrentTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      watchedValues.tags.filter((tag) => tag !== tagToRemove),
    )
  }

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    const formData = new FormData()
    Object.entries(data).forEach(([key, value]) => {
      if (key === "tags" && Array.isArray(value)) {
        formData.append(key, value.join(","))
      } else if (key === "date" && value instanceof Date) {
        formData.append(key, value.toISOString())
      } else if (typeof value === "boolean") {
        if (value) formData.append(key, "on")
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value))
      }
    })
    try {
      if (event?.id) {
        await updateEventAction(event.id, formData)
      } else {
        await createEventAction(formData)
      }
    } catch (error) {
      console.error("Erro ao salvar evento:", error)
      setIsSubmitting(false)
    }
  }

  // Função para lidar com o Enter no campo de tag
  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault() // Prevenir submissão do formulário
      addTag(e as unknown as React.MouseEvent<HTMLButtonElement>)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          <TabsTrigger value="informacoes">
            <Info className="mr-2 h-4 w-4" />
            Informações Básicas
          </TabsTrigger>
          <TabsTrigger value="detalhes">
            <Tag className="mr-2 h-4 w-4" />
            Detalhes
          </TabsTrigger>
          <TabsTrigger value="imagem">
            <Upload className="mr-2 h-4 w-4" />
            Imagem
          </TabsTrigger>
          <TabsTrigger value="preview">
            <Star className="mr-2 h-4 w-4" />
            Pré-visualização
          </TabsTrigger>
        </TabsList>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6">
            <TabsContent value="informacoes" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input placeholder="Título do evento" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="palestra">Palestra</SelectItem>
                          <SelectItem value="show">Show</SelectItem>
                          <SelectItem value="competicao">Competição</SelectItem>
                          <SelectItem value="exposicao">Exposição</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descreva o evento em detalhes" className="min-h-32" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              type="button" // Explicitamente definir como button para evitar submissão
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                              onClick={(e) => {
                                // Prevenir propagação do evento para evitar submissão
                                if (typeof e.stopPropagation === "function") e.stopPropagation()
                              }}
                            >
                              {field.value ? (
                                format(field.value, "PPP", { locale: ptBR })
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              field.onChange(date)
                            }}
                            initialFocus
                            onDayClick={(day, e) => {
                              // Prevenir propagação do evento para evitar submissão
                              if (e && typeof (e as any).stopPropagation === "function") (e as any).stopPropagation();
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora de Início</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="09:00" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora de Término</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="10:00" className="pl-9" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Local</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Local do evento" className="pl-9" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="detalhes" className="space-y-6">
              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {watchedValues.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                          {tag}
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-4 w-4 p-0 text-muted-foreground hover:text-foreground"
                            onClick={() => removeTag(tag)}
                          >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remover tag</span>
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Adicionar tag"
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                      />
                      <Button type="button" variant="outline" onClick={addTag}>
                        Adicionar
                      </Button>
                    </div>
                    <FormDescription>Adicione tags para facilitar a busca e categorização do evento</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="featured"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Evento em Destaque</FormLabel>
                      <FormDescription>Marque esta opção para destacar o evento na página inicial</FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </TabsContent>

            <TabsContent value="imagem" className="space-y-6">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/imagem.jpg"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          setPreviewImage(e.target.value)
                        }}
                      />
                    </FormControl>
                    <FormDescription>URL da imagem que será exibida no card do evento</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="border rounded-md p-4">
                <h3 className="text-sm font-medium mb-2">Pré-visualização da imagem</h3>
                {previewImage ? (
                  <div className="relative aspect-video overflow-hidden rounded-md border bg-muted">
                    <img
                      src={previewImage || "/placeholder.svg"}
                      alt="Preview"
                      className="object-cover w-full h-full"
                      onError={() => {
                        setPreviewImage("/placeholder.svg?height=400&width=600")
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center aspect-video rounded-md border bg-muted text-muted-foreground">
                    Nenhuma imagem definida
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="preview" className="space-y-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <h2 className="text-2xl font-bold">{watchedValues.title || "Título do Evento"}</h2>

                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">
                          <CalendarIcon className="mr-1 h-3 w-3" />
                          {watchedValues.date
                            ? format(watchedValues.date, "dd/MM/yyyy", { locale: ptBR })
                            : "Data não definida"}
                        </Badge>
                        <Badge variant="outline">
                          <Clock className="mr-1 h-3 w-3" />
                          {watchedValues.time || "00:00"} - {watchedValues.endTime || "00:00"}
                        </Badge>
                        <Badge variant="outline">
                          <MapPin className="mr-1 h-3 w-3" />
                          {watchedValues.location || "Local não definido"}
                        </Badge>
                        {watchedValues.type && (
                          <Badge>
                            {watchedValues.type.charAt(0).toUpperCase() + watchedValues.type.slice(1)}
                          </Badge>
                        )}
                        {watchedValues.featured && (
                          <Badge variant="secondary">
                            <Star className="mr-1 h-3 w-3" />
                            Destaque
                          </Badge>
                        )}
                      </div>
                    </div>

                    <Separator />

                    {previewImage && (
                      <div className="relative aspect-video overflow-hidden rounded-md border bg-muted">
                        <img
                          src={previewImage || "/placeholder.svg"}
                          alt={watchedValues.title || "Evento"}
                          className="object-cover w-full h-full"
                          onError={() => {
                            setPreviewImage("/placeholder.svg?height=400&width=600")
                          }}
                        />
                      </div>
                    )}

                    <div className="space-y-2">
                      <h3 className="font-semibold">Descrição</h3>
                      <p className="text-muted-foreground whitespace-pre-line">
                        {watchedValues.description || "Nenhuma descrição fornecida."}
                      </p>
                    </div>

                    {watchedValues.tags.length > 0 && (
                      <>
                        <Separator />
                        <div>
                          <h4 className="text-sm font-medium mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {watchedValues.tags.map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <div className="flex justify-end space-x-4 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push(paths.admin.eventos)}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Salvando..." : "Salvar Evento"}
              </Button>
            </div>
          </form>
        </Form>
      </Tabs>
    </div>
  )
}
